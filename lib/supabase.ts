import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mbpkdmswzhyibmrlhadi.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icGtkbXN3emh5aWJtcmxoYWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MDkxMTEsImV4cCI6MjEwNTA4NTExMX0.tYmZ-lWFjpoIeuNCFVjw51PgIxwBaTh_5WadiyfjlT0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
