import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for our database
export type Donation = {
  id: string;
  donor_name: string;
  amount: number;
  message?: string;
  proof_url?: string;
  is_anonymous: boolean;
  payment_status: 'pending' | 'success';
  created_at: string;
  type: 'money';
};

export type ItemDonation = {
  id: string;
  donor_name: string;
  item_type: string;
  quantity: number;
  description?: string;
  created_at: string;
  type: 'item';
};
