import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://kwcszafjapqufhwfazdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3Y3N6YWZqYXBxdWZod2ZhemRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTQ3MjQsImV4cCI6MjA2NjE3MDcyNH0.Ah_SVYRsXRKAIsKymIeLm90p6LrBNTGno3lAjviVxCA';
export const supabase = createClient(supabaseUrl, supabaseKey);