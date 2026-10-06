"use client";

import { useStore } from '@/lib/store';
import { Package, User } from 'lucide-react';
import Link from 'next/link';

export default function RekapBarang() {
  const { itemDonations } = useStore();

  // Aggregate items by category
  const aggregatedItems = itemDonations.reduce((acc, curr) => {
    if (!acc[curr.item_type]) {
      acc[curr.item_type] = 0;
    }
    acc[curr.item_type] += curr.quantity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Summary */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-[#F4AE52]/20 text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Package size={160} />
        </div>
        <h2 className="text-[#2A1A0E]/60 font-medium text-lg mb-6">Total Barang Terkumpul</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.keys(aggregatedItems).length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-4">
              Belum ada barang terkumpul
            </div>
          ) : (
            Object.entries(aggregatedItems).map(([type, total]) => (
              <div key={type} className="bg-[#FEF3E2] p-4 rounded-2xl border border-[#F4AE52]/30 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl font-bold text-[#D4621A]">{total}</span>
                <span className="text-sm font-semibold text-[#2A1A0E] text-center">{type}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Detailed Inventory List */}
      <section className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#2A1A0E] flex items-center gap-2">
            Rincian Donatur Barang <span className="text-[#F4AE52]">📦</span>
          </h3>
          <Link href="/sumbang-barang" className="text-sm font-medium text-[#D4621A] hover:underline">
            + Sumbang Barang
          </Link>
        </div>
        
        <div className="bg-white rounded-3xl shadow-sm border border-[#F4AE52]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FEF3E2]/50 border-b border-[#F4AE52]/20">
                  <th className="p-4 font-semibold text-[#2A1A0E]">Nama Donatur</th>
                  <th className="p-4 font-semibold text-[#2A1A0E]">Kategori</th>
                  <th className="p-4 font-semibold text-[#2A1A0E] text-center">Jumlah</th>
                  <th className="p-4 font-semibold text-[#2A1A0E] hidden sm:table-cell">Deskripsi</th>
                  <th className="p-4 font-semibold text-[#2A1A0E]">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {itemDonations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Data donasi barang masih kosong.
                    </td>
                  </tr>
                ) : (
                  itemDonations
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((item) => (
                    <tr key={item.id} className="border-b border-[#F4AE52]/10 hover:bg-[#FEF3E2]/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2 font-medium text-[#2A1A0E]">
                          <User size={16} className="text-[#D4621A]" />
                          {item.donor_name}
                        </div>
                      </td>
                      <td className="p-4 text-[#2A1A0E]">{item.item_type}</td>
                      <td className="p-4 text-center font-bold text-[#D4621A]">{item.quantity}</td>
                      <td className="p-4 text-sm text-[#2A1A0E]/70 hidden sm:table-cell max-w-xs truncate">
                        {item.description || '-'}
                      </td>
                      <td className="p-4 text-sm text-[#2A1A0E]/60">
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
