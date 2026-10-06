"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, Donation, ItemDonation } from './supabase';

type UnifiedFeedItem = (Donation | ItemDonation) & { timestamp: number };

interface StoreContextType {
  donations: Donation[];
  itemDonations: ItemDonation[];
  feed: UnifiedFeedItem[];
  addDonation: (donation: Omit<Donation, 'id' | 'created_at' | 'type'>) => Promise<void>;
  addItemDonation: (item: Omit<ItemDonation, 'id' | 'created_at' | 'type'>) => Promise<void>;
  deleteDonation: (id: string) => Promise<void>;
  deleteItemDonation: (id: string) => Promise<void>;
  totalMoney: number;
}

const mockDonations: Donation[] = [
  { id: '1', donor_name: 'Hamba Allah', amount: 500000, message: 'Semoga berkah untuk anak-anak.', is_anonymous: true, payment_status: 'success', created_at: new Date(Date.now() - 3600000).toISOString(), type: 'money' },
  { id: '2', donor_name: 'Budi Santoso', amount: 250000, is_anonymous: false, payment_status: 'success', created_at: new Date(Date.now() - 7200000).toISOString(), type: 'money' },
];

const mockItemDonations: ItemDonation[] = [
  { id: '3', donor_name: 'Siti Aminah', item_type: 'Pakaian Layak Pakai 👕', quantity: 15, description: 'Baju anak usia 5-10 tahun', created_at: new Date(Date.now() - 5400000).toISOString(), type: 'item' },
  { id: '4', donor_name: 'Agus Prayitno', item_type: 'Buku Tulis 📚', quantity: 50, description: 'Buku tulis kosong', created_at: new Date(Date.now() - 86400000).toISOString(), type: 'item' },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://mock.supabase.co';

  const [donations, setDonations] = useState<Donation[]>(isSupabaseConfigured ? [] : mockDonations);
  const [itemDonations, setItemDonations] = useState<ItemDonation[]>(isSupabaseConfigured ? [] : mockItemDonations);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Fetch initial data
    const fetchData = async () => {
      const [moneyRes, itemRes] = await Promise.all([
        supabase.from('donations').select('*').eq('payment_status', 'success'),
        supabase.from('item_donations').select('*')
      ]);

      if (moneyRes.data) setDonations(moneyRes.data.map(d => ({ ...d, type: 'money' })));
      if (itemRes.data) setItemDonations(itemRes.data.map(d => ({ ...d, type: 'item' })));
    };

    fetchData();

    // Subscribe to real-time changes
    const moneyChannel = supabase.channel('public:donations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'donations' }, payload => {
        if (payload.new.payment_status === 'success') {
          setDonations(prev => [{ ...payload.new as Donation, type: 'money' }, ...prev]);
        }
      }).subscribe();

    const itemChannel = supabase.channel('public:item_donations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'item_donations' }, payload => {
        setItemDonations(prev => [{ ...payload.new as ItemDonation, type: 'item' }, ...prev]);
      }).subscribe();

    return () => {
      supabase.removeChannel(moneyChannel);
      supabase.removeChannel(itemChannel);
    };
  }, [isSupabaseConfigured]);

  const addDonation = async (donation: Omit<Donation, 'id' | 'created_at' | 'type'>) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('donations').insert([{ ...donation, type: 'money' }]);
      if (error) console.error("Supabase Insert Error:", error);
    } else {
      const newDonation: Donation = {
        ...donation,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        type: 'money',
      };
      setDonations(prev => [newDonation, ...prev]);
    }
  };

  const addItemDonation = async (item: Omit<ItemDonation, 'id' | 'created_at' | 'type'>) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('item_donations').insert([{ ...item, type: 'item' }]);
      if (error) console.error("Supabase Insert Error:", error);
    } else {
      const newItem: ItemDonation = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        type: 'item',
      };
      setItemDonations(prev => [newItem, ...prev]);
    }
  };

  const deleteDonation = async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('donations').delete().eq('id', id);
      if (error) console.error("Supabase Delete Error:", error);
      else setDonations(prev => prev.filter(d => d.id !== id)); // Optimistic UI update
    } else {
      setDonations(prev => prev.filter(d => d.id !== id));
    }
  };

  const deleteItemDonation = async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('item_donations').delete().eq('id', id);
      if (error) console.error("Supabase Delete Error:", error);
      else setItemDonations(prev => prev.filter(d => d.id !== id)); // Optimistic UI update
    } else {
      setItemDonations(prev => prev.filter(d => d.id !== id));
    }
  };

  const feed: UnifiedFeedItem[] = [...donations, ...itemDonations]
    .map(item => ({ ...item, timestamp: new Date(item.created_at).getTime() }))
    .sort((a, b) => b.timestamp - a.timestamp);

  const totalMoney = donations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <StoreContext.Provider value={{ donations, itemDonations, feed, addDonation, addItemDonation, deleteDonation, deleteItemDonation, totalMoney }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
