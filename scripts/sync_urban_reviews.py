"""
Fetches all reviews for Iulia (unit 53416) from the Urban internal API
and inserts any new ones into Supabase, deduplicating by created_at timestamp.

Required environment variables:
  URBAN_AUTH_TOKEN      - Session token from Urban (update in GitHub Secrets when it expires)
  URBAN_APP_TOKEN       - x-application header value from Urban
  SUPABASE_URL          - e.g. https://qkkptkngexrytcgjyjmn.supabase.co
  SUPABASE_SERVICE_KEY  - service_role key (not anon key — needed to bypass RLS for insert)
"""

import os
import json
import time
import requests
from datetime import datetime, timezone

UNIT_ID = 53416
URBAN_API = "https://urban.serviceos.com/api/v2.2/client"
PAGE_SIZE = 50

AUTH_TOKEN = os.environ["URBAN_AUTH_TOKEN"]
APP_TOKEN  = os.environ["URBAN_APP_TOKEN"]
SUPABASE_URL = os.environ["SUPABASE_URL"].rstrip("/")
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

URBAN_HEADERS = {
    "authorization": AUTH_TOKEN,
    "x-application": APP_TOKEN,
    "content-type": "application/json",
    "accept": "application/json",
}

SUPABASE_HEADERS = {
    "apikey": SUPABASE_KEY,
    "authorization": f"Bearer {SUPABASE_KEY}",
    "content-type": "application/json",
    "prefer": "return=minimal",
}


def fetch_urban_reviews():
    """Paginate through all Urban reviews for the unit, return those with text."""
    all_reviews = []
    offset = 0

    while True:
        payload = {"requests": [{"method": "GET", "path": f"units/{UNIT_ID}/ratings",
                                  "params": {"paging": {"offset": offset, "limit": PAGE_SIZE}}}]}
        resp = requests.post(URBAN_API, headers=URBAN_HEADERS, json=payload, timeout=15)
        resp.raise_for_status()
        data = resp.json()

        batch = data[0].get("ratings", [])
        if not batch:
            break

        with_text = [r for r in batch if r.get("comment", "").strip()]
        all_reviews.extend(with_text)
        print(f"  offset {offset}: {len(batch)} fetched, {len(with_text)} with text (running total: {len(all_reviews)})")

        if len(batch) < PAGE_SIZE:
            break
        offset += PAGE_SIZE
        time.sleep(0.3)  # be polite to the API

    return all_reviews


def get_existing_timestamps():
    """Fetch all created_at values already in Supabase to deduplicate."""
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/reviews",
        headers={**SUPABASE_HEADERS, "prefer": ""},
        params={"select": "created_at", "limit": 10000},
        timeout=15,
    )
    resp.raise_for_status()
    return {row["created_at"] for row in resp.json()}


def parse_date(date_str):
    """Parse Urban date string to ISO 8601 UTC."""
    if not date_str:
        return None
    try:
        # Urban returns e.g. "2026-03-29 15:31:30"
        dt = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
        return dt.isoformat()
    except ValueError:
        return date_str


def fix_name(body):
    """Correct common misspellings of Iulia's name."""
    import re
    body = re.sub(r'\bLulia\b', 'Iulia', body)
    body = re.sub(r'\blulia\b', 'Iulia', body)
    body = re.sub(r'\bJulia\b', 'Iulia', body)
    body = re.sub(r'\bLucia\b', 'Iulia', body)
    return body


def main():
    print("Fetching reviews from Urban...")
    urban_reviews = fetch_urban_reviews()
    print(f"Total with text: {len(urban_reviews)}")

    # Deduplicate by booking ref within Urban results
    seen_refs = set()
    unique_reviews = []
    for r in urban_reviews:
        ref = r.get("booking_ref_num") or r.get("id")
        if ref and ref not in seen_refs:
            seen_refs.add(ref)
            unique_reviews.append(r)
    print(f"After dedup by booking ref: {len(unique_reviews)}")

    print("Fetching existing timestamps from Supabase...")
    existing_ts = get_existing_timestamps()
    print(f"Existing rows in DB: {len(existing_ts)}")

    to_insert = []
    for r in unique_reviews:
        ts = parse_date(r.get("date_formatted") or r.get("created_at"))
        if not ts:
            continue
        # Normalise to match Supabase format (with +00:00 suffix)
        if ts in existing_ts or ts.replace("+00:00", "+00:00") in existing_ts:
            continue
        # Also check without tz suffix variants
        ts_variants = {ts, ts.replace("+00:00", ""), ts.replace("+00:00", "Z")}
        if ts_variants & existing_ts:
            continue

        body = fix_name((r.get("comment") or "").strip())
        if len(body) < 3:
            continue

        rating = int(r.get("rating") or r.get("stars") or 5)
        to_insert.append({
            "name": "Urban Client",
            "rating": rating,
            "body": body,
            "created_at": ts,
            "approved": True,
        })

    from collections import Counter
    rating_counts = Counter(r["rating"] for r in to_insert)
    print(f"New reviews to insert: {len(to_insert)} — ratings: {dict(sorted(rating_counts.items()))}")

    if not to_insert:
        print("Nothing to insert — database is up to date.")
        return

    # Insert in batches of 50
    batch_size = 50
    inserted = 0
    for i in range(0, len(to_insert), batch_size):
        batch = to_insert[i:i + batch_size]
        resp = requests.post(
            f"{SUPABASE_URL}/rest/v1/reviews",
            headers=SUPABASE_HEADERS,
            json=batch,
            timeout=15,
        )
        if resp.status_code not in (200, 201):
            print(f"  ERROR inserting batch {i//batch_size + 1}: {resp.status_code} {resp.text}")
        else:
            inserted += len(batch)
            print(f"  Inserted batch {i//batch_size + 1}: {len(batch)} rows")

    print(f"Done. Inserted {inserted} new reviews.")


if __name__ == "__main__":
    main()
