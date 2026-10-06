"use client";

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Trash2, Image as ImageIcon, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminPage() {
  const { donations, itemDonations, deleteDonation, deleteItemDonation } = useStore();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'uang' | 'barang'>('uang');
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '251223') {
      setIsAuthenticated(true);
    } else {
      alert('Password salah!');
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-3xl shadow-sm border border-[#F4AE52]/20 text-center">
        <div className="bg-[#FEF3E2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="text-[#D4621A] w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#2A1A0E] mb-2">Login Admin</h2>
        <p className="text-[#2A1A0E]/60 mb-6 text-sm">Masukkan password untuk mengakses halaman kontrol database.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan Password"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D4621A] focus:ring-0 outline-none transition-colors text-center"
          />
          <button type="submit" className="w-full bg-[#D4621A] text-white py-3 rounded-xl font-bold hover:bg-[#b55013] transition-colors">
            Masuk
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Modal for viewing proof */}
      {selectedProof && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedProof(null)}>
          <div className="bg-white rounded-2xl p-2 max-w-2xl w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProof(null)} className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full font-bold">X</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedProof} alt="Bukti Pembayaran" className="w-full h-auto rounded-xl max-h-[85vh] object-contain" />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-[#F4AE52]/20">
        <div>
          <h1 className="text-2xl font-bold text-[#2A1A0E] flex items-center gap-2">
            <ShieldCheck className="text-[#10B981]" /> Panel Admin
          </h1>
          <p className="text-sm text-[#2A1A0E]/60">Kelola data donasi dan hapus jika tidak valid.</p>
        </div>
        <Link href="/" className="text-sm font-medium text-[#D4621A] hover:underline px-4 py-2 bg-[#FEF3E2] rounded-lg border border-[#F4AE52]/30">
          Lihat Website
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#F4AE52]/20 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('uang')}
            className={`flex-1 py-4 font-bold transition-colors ${activeTab === 'uang' ? 'text-[#D4621A] border-b-2 border-[#D4621A] bg-[#FEF3E2]/30' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            Donasi Uang ({donations.length})
          </button>
          <button 
            onClick={() => setActiveTab('barang')}
            className={`flex-1 py-4 font-bold transition-colors ${activeTab === 'barang' ? 'text-[#D4621A] border-b-2 border-[#D4621A] bg-[#FEF3E2]/30' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            Donasi Barang ({itemDonations.length})
          </button>
        </div>

        {/* Uang Tab */}
        {activeTab === 'uang' && (
          <div className="overflow-x-auto p-4 sm:p-6">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="p-4 rounded-l-xl">Waktu</th>
                  <th className="p-4">Nama Donatur</th>
                  <th className="p-4">Nominal</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Bukti</th>
                  <th className="p-4 text-center rounded-r-xl">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="p-4 text-sm text-gray-500">{new Date(d.created_at).toLocaleString('id-ID')}</td>
                    <td className="p-4 font-medium">{d.donor_name} {d.is_anonymous && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded ml-2">Anonim</span>}</td>
                    <td className="p-4 font-bold text-[#10B981]">{formatCurrency(d.amount)}</td>
                    <td className="p-4"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">{d.payment_status}</span></td>
                    <td className="p-4">
                      {d.proof_url ? (
                        <button onClick={() => setSelectedProof(d.proof_url!)} className="text-sm flex items-center gap-1 text-blue-600 hover:underline">
                          <ImageIcon size={16} /> Lihat
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => { if(confirm('Yakin hapus?')) deleteDonation(d.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && <tr><td colSpan={6} className="text-center p-8 text-gray-400">Kosong</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Barang Tab */}
        {activeTab === 'barang' && (
          <div className="overflow-x-auto p-4 sm:p-6">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="p-4 rounded-l-xl">Waktu</th>
                  <th className="p-4">Nama Donatur</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Deskripsi</th>
                  <th className="p-4 text-center rounded-r-xl">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {itemDonations.map(d => (
                  <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="p-4 text-sm text-gray-500">{new Date(d.created_at).toLocaleString('id-ID')}</td>
                    <td className="p-4 font-medium">{d.donor_name}</td>
                    <td className="p-4">{d.item_type}</td>
                    <td className="p-4 font-bold text-[#D4621A]">{d.quantity}</td>
                    <td className="p-4 text-sm text-gray-500 truncate max-w-[200px]">{d.description || '-'}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => { if(confirm('Yakin hapus?')) deleteItemDonation(d.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {itemDonations.length === 0 && <tr><td colSpan={6} className="text-center p-8 text-gray-400">Kosong</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
