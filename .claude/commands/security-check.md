# Security Check

Run a lightweight security check before pushing to `main`. This is not a full penetration test on every push — it's a fast pass to catch the specific things a code change or deploy could realistically introduce, plus a periodic sanity check that the Supabase security posture hasn't regressed.

## What to check

### 1. No secrets in the diff about to be pushed
- Run `git diff origin/main..dev` (or equivalent) and scan for anything matching a JWT (`eyJ...`), an API key pattern, a `.env` file, or a hardcoded password/token
- The only key that should ever appear in committed code is the Supabase `sb_publishable_...` key in `src/supabase.ts` — that one is meant to be public (protected by RLS), not a leak
- If a `service_role` key, `SUPABASE_SERVICE_KEY`, `URBAN_AUTH_TOKEN`/`URBAN_APP_TOKEN`, or `RESEND_API_KEY` value (not just the variable name) shows up anywhere in tracked files, stop and flag it — those belong only in GitHub Secrets or the Supabase dashboard

### 2. Supabase RLS policies haven't regressed
Query `pg_policies` for the `reviews` table (via the Supabase MCP tools) and confirm:
- Exactly one SELECT policy for public/anon scoped to `approved = true` (or `status = 'approved'`) — no unrestricted `qual: true` policy alongside it
- Exactly one INSERT policy for public/anon with the name/rating/body length `with_check` constraints — no unrestricted `with_check: true` policy alongside it
- UPDATE/DELETE `qual` should be `auth.email() = ANY (ARRAY[...])` scoped to exactly the two known admin addresses (check the live policy in Supabase for the exact values — not stored in this repo since it's public), not `true`/"any authenticated user"
- This matters because Postgres RLS policies for the same command are OR'd together — a second, more permissive policy silently defeats a stricter one even if both exist. This exact bug was found and fixed on 2026-08-02 (two legacy unrestricted policies had survived alongside properly-scoped replacements, exposing all pending/declined reviews to anyone with the public API key).

### 3. No SECURITY DEFINER function is publicly callable unless intended
Run `get_advisors` (security) via the Supabase MCP tools and check for `anon_security_definer_function_executable` or `authenticated_security_definer_function_executable` warnings. The `notify_new_review()` trigger function should have `EXECUTE` revoked from `anon`/`authenticated`/`public` — it should only run via the `on_new_pending_review` trigger, never as a direct RPC call.

### 4. GitHub repo hygiene
- Confirm `main` branch protection is still active (`allow_force_pushes: false`, `allow_deletions: false` — enabled 2026-08-02). PR reviews are intentionally NOT required since the deploy workflow pushes directly to `main`.
- If `gh secret list` shows any secret no longer referenced in `.github/workflows/*.yml`, flag it as removable

### 5. Public-facing probes (only if it's been a while since the last full check)
- Confirm `.env`, `.git/config`, `package.json`, and similar sensitive paths still 404 on the live domain
- Confirm the deployed `docs/*.js` bundles contain no JWT-shaped strings other than none at all (the site uses the modern `sb_publishable_` key format, which doesn't look like a JWT)

## Instructions

1. Diff-scan for secrets first — this is the fastest check and the one most likely to catch a real mistake before it ships
2. Query live Supabase RLS policies and advisors — compare against the expected state described above
3. Only run the full public-probe pass (#5) if it hasn't been done recently, not on every single push — it's checking platform-level state that code changes don't affect
4. Report pass/fail per section. If something regressed, fix it immediately (this codebase's convention is to fix-and-verify inline, not just report) and note what was changed
