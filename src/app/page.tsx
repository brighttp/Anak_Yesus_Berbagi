"use client";

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { HandHeart, PackagePlus, MessageCircle, Wallet, Shirt } from 'lucide-react';

export default function Dashboard() {
  const { totalMoney, feed } = useStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const timeAgo = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " tahun lalu";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bulan lalu";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hari lalu";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit lalu";
    return Math.floor(seconds) + " detik lalu";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <section className="relative bg-white rounded-[2rem] shadow-sm border border-[#F4AE52]/20 overflow-hidden group">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Side */}
          <div className="relative h-72 md:h-auto overflow-hidden">
            <img 
              src="/hero-image.jpg" 
              alt="Anak-anak Panti Asuhan Tersenyum" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Gradients for text readability blending into the right column */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A1A0E]/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-white/20 md:to-white"></div>
            
            <div className="absolute bottom-6 left-6 right-6 md:hidden">
              <h2 className="text-white text-2xl font-bold mb-2">Bersama Kita Berbagi Kasih</h2>
              <p className="text-[#FEF3E2] text-sm font-medium">Setiap senyuman mereka adalah harapan kita.</p>
            </div>
          </div>

          {/* Content Side */}
          <div className="p-8 md:p-12 flex flex-col justify-center relative bg-white md:bg-transparent">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <HandHeart size={120} />
            </div>
            
            <div className="hidden md:block mb-8 relative z-10">
              <h2 className="text-3xl font-extrabold text-[#2A1A0E] mb-3 leading-tight">
                Bersama Kita <br/><span className="text-[#D4621A]">Berbagi Kasih ✨</span>
              </h2>
              <p className="text-[#2A1A0E]/70 font-medium">Wujudkan masa depan yang lebih cerah dengan aksi nyata hari ini.</p>
            </div>

            <div className="bg-gradient-to-br from-[#FEF3E2] to-white rounded-2xl p-6 border border-[#F4AE52]/30 mb-8 relative z-10 shadow-sm w-fit pr-12">
              <h3 className="text-[#2A1A0E]/70 font-semibold mb-2 text-sm uppercase tracking-wider">Total Saldo Terkumpul</h3>
              <div className="flex items-baseline gap-1.5 text-[#D4621A] drop-shadow-sm">
                <span className="text-2xl sm:text-3xl font-bold">Rp</span>
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  {new Intl.NumberFormat('id-ID').format(totalMoney)}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Link href="/sumbang-uang" 
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#D4621A] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#b55013] transition-all hover:-translate-y-1 hover:shadow-md active:translate-y-0">
                <Wallet className="w-5 h-5" />
                Sumbang Uang
              </Link>
              <Link href="/sumbang-barang"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-[#D4621A] border-2 border-[#D4621A] px-6 py-4 rounded-xl font-bold hover:bg-[#FEF3E2] transition-all hover:-translate-y-1 hover:shadow-md active:translate-y-0">
                <PackagePlus className="w-5 h-5" />
                Barang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Feed & History */}
      <section className="mt-12">
        <h3 className="text-2xl font-bold text-[#2A1A0E] mb-6 flex items-center gap-2">
          Riwayat Kebaikan <span className="text-[#F4AE52]">✨</span>
        </h3>
        
        <div className="space-y-4">
          {feed.length === 0 ? (
            <div className="text-center py-12 text-[#2A1A0E]/50 bg-white rounded-2xl border border-dashed border-[#F4AE52]">
              Belum ada donasi. Jadilah yang pertama berbagi!
            </div>
          ) : (
            feed.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#F4AE52]/20 hover:border-[#F4AE52] transition-colors flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="bg-[#FEF3E2] p-3 rounded-full shrink-0 text-[#D4621A] w-fit">
                  {item.type === 'money' ? <Wallet size={24} /> : <Shirt size={24} />}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                    <h4 className="font-bold text-[#2A1A0E] text-lg">
                      {item.type === 'money' && item.is_anonymous ? 'Orang Baik (Anonim)' : item.donor_name}
                    </h4>
                    <span className="text-sm text-[#2A1A0E]/50 bg-[#FEF3E2] px-3 py-1 rounded-full w-fit">
                      {timeAgo(item.created_at)}
                    </span>
                  </div>
                  
                  <div className="text-[#D4621A] font-semibold text-lg mb-2">
                    {item.type === 'money' 
                      ? formatCurrency(item.amount) 
                      : `${item.quantity} x ${item.item_type}`
                    }
                  </div>

                  {item.type === 'item' && item.description && (
                    <p className="text-[#2A1A0E]/70 text-sm mb-3">"{item.description}"</p>
                  )}

                  {item.type === 'money' && item.message && (
                    <div className="mt-3 bg-[#FEF3E2]/50 p-4 rounded-xl rounded-tl-none border border-[#F4AE52]/20 flex gap-3 items-start">
                      <MessageCircle className="w-5 h-5 text-[#F4AE52] shrink-0 mt-0.5" />
                      <p className="text-[#2A1A0E] text-sm italic">{item.message}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
