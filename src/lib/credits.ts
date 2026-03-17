import { supabase } from './supabase';
import type { CreditTransaction } from '../types';

// Deduct credits (returns false if insufficient)
export async function deductCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<boolean> {
  // Fetch current balance
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits, is_dev')
    .eq('id', userId)
    .single();

  if (!profile) return false;

  // Dev users have infinite credits
  if (profile.is_dev) {
    // Still log the transaction but don't deduct
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: -amount,
      reason: `${reason} (dev — grátis)`,
    });
    return true;
  }

  if (profile.credits < amount) return false;

  // Deduct
  const { error } = await supabase
    .from('profiles')
    .update({ credits: profile.credits - amount })
    .eq('id', userId);

  if (error) return false;

  // Log transaction
  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: -amount,
    reason,
  });

  return true;
}

// Get transaction history
export async function getTransactions(userId: string): Promise<CreditTransaction[]> {
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
}
