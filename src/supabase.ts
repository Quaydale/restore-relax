import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://qkkptkngexrytcgjyjmn.supabase.co",
  "sb_publishable_mM_Jq01FOaSw8Pj9D_8jrA_vo9TZOJn"
);

export type Review = {
  id: string;
  name: string;
  rating: number;
  body: string;
  created_at: string;
};
