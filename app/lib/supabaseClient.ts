// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Tu URL oficial basada en el ID de tu proyecto
const SUPABASE_URL = 'https://nmwubtldkgtkceogluph.supabase.co'; 

// Tu clave anónima real que acabas de encontrar
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5td3VidGxka2d0a2Nlb2dsdXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MDgyNjIsImV4cCI6MjA5NDk4NDI2Mn0.mKhoDag501bLsluCir6Sk8BBnbzb3g6DbpFrpJmfljw'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);