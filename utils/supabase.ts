import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=es2022&bundle";
import { Database } from "./supabase.types.ts"

export const supabase = createClient<Database, 'public'>(
    "https://bwqgcpmtjjpdocrieixv.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3cWdjcG10ampwZG9jcmllaXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODE5NjYsImV4cCI6MjA4MDA1Nzk2Nn0.SGSFDgxzwMqzAikKnE9y0HmMOSOaWf1tKnJWeLeu3rY",
);