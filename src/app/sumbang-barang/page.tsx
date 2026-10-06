"use client";

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { ArrowLeft, PackagePlus, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ITEM_CATEGORIES = [
  'Pakaian Layak Pakai 👕',
  'Buku Tulis 📚',
  'Sembako 📦',
  'Mainan Anak 🧸',
  'Peralatan Mandi 🧼',
  'Lainnya 🎁'
];

export default function SumbangBarang() {
  const router = useRouter();
  const { addItemDonation } = useStore();
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [donorName, setDonorName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !quantity || !donorName.trim()) return;

    setIsLoading(true);
    await addItemDonation({
      donor_name: donorName,
      item_type: category,
      quantity: Number(quantity),
      description: description,
    });
    
    setTimeout(() => {
      router.push('/rekap-barang');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-[#2A1A0E]/60 hover:text-[#D4621A] transition-colors mb-6 font-medium">
        <ArrowLeft size={20} />
        Kembali ke Dashboard
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-[#F4AE52]/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-[#D4621A] p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <PackagePlus /> Sumbang Barang
          </h2>
          <p className="text-white/80">Bagikan barang-barang bermanfaat untuk mereka.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">
              <strong>MANDATORY:</strong> Nama asli wajib diisi agar panitia mudah menghubungi Anda untuk koordinasi penyerahan barang. Opsi anonim tidak tersedia untuk donasi barang.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2A1A0E] mb-2">Nama Lengkap Donatur <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D4621A] focus:ring-0 outline-none transition-colors"
              placeholder="Nama asli sesuai KTP/identitas"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2A1A0E] mb-3">Kategori Barang <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ITEM_CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all text-left ${
                    category === cat 
                      ? 'border-[#D4621A] bg-[#FEF3E2] text-[#D4621A]' 
                      : 'border-gray-200 text-gray-600 hover:border-[#F4AE52] hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2A1A0E] mb-2">Jumlah Barang <span className="text-red-500">*</span></label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D4621A] focus:ring-0 outline-none transition-colors text-lg"
              placeholder="Contoh: 10"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2A1A0E] mb-2">Deskripsi Barang (Opsional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D4621A] focus:ring-0 outline-none transition-colors resize-none"
              placeholder="Contoh: Pakaian wanita usia 15 tahun kondisi masih sangat bagus..."
            />
          </div>

          <button
            type="submit"
            disabled={!category || !quantity || !donorName.trim() || isLoading}
            className="w-full bg-[#D4621A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#b55013] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <span className="animate-pulse">Memproses Data...</span>
            ) : (
              'Kirim Formulir Donasi Barang'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
