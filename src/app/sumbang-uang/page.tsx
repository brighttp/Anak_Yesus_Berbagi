"use client";

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { ArrowLeft, CheckCircle2, Wallet, QrCode, UploadCloud, FileImage } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NOMINAL_OPTIONS = [50000, 100000, 250000, 500000, 1000000];

export default function SumbangUang() {
  const router = useRouter();
  const { addDonation } = useStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState<number | ''>('');
  const [donorName, setDonorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handleLanjutkan = () => {
    if (!amount || amount < 10000) return;
    if (!isAnonymous && !donorName.trim()) return;
    setStep(2);
  };

  const handleUploadProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleDonasiSelesai = async () => {
    if (!paymentProof) return;

    setIsLoading(true);
    try {
      const finalName = isAnonymous ? 'Orang Baik (Anonim)' : donorName;
      
      // Convert file to base64 for prototype storage
      const reader = new FileReader();
      reader.readAsDataURL(paymentProof);
      reader.onload = async () => {
        const base64Url = reader.result as string;

        await addDonation({
          donor_name: finalName,
          amount: Number(amount),
          message,
          proof_url: base64Url,
          is_anonymous: isAnonymous,
          payment_status: 'success', // Auto success for prototype manual flow
        });
        
        // Beri efek loading untuk pengalaman user yang baik
        setTimeout(() => {
          router.push('/');
        }, 1500);
      };
      
      reader.onerror = () => {
        alert("Gagal membaca file gambar.");
        setIsLoading(false);
      };

    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan sistem.');
      setIsLoading(false);
    }
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
            <Wallet /> Sumbang Uang
          </h2>
          <p className="text-white/80">Setiap rupiah sangat berarti untuk mereka.</p>
        </div>

        <div className="p-6 sm:p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#2A1A0E] mb-3">Pilih Nominal</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {NOMINAL_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setAmount(opt)}
                      className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                        amount === opt 
                          ? 'border-[#D4621A] bg-[#FEF3E2] text-[#D4621A]' 
                          : 'border-gray-200 text-gray-600 hover:border-[#F4AE52] hover:bg-gray-50'
                      }`}
                    >
                      {formatCurrency(opt)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2A1A0E] mb-2">Atau Nominal Lainnya (Min. Rp 10.000)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">Rp</span>
                  <input
                    type="number"
                    min="10000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D4621A] focus:ring-0 outline-none transition-colors text-lg font-semibold"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2A1A0E] mb-2">Nama Donatur</label>
                <input
                  type="text"
                  disabled={isAnonymous}
                  value={isAnonymous ? '' : donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D4621A] focus:ring-0 outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder="Nama Lengkap"
                />
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#D4621A] focus:ring-[#D4621A]"
                  />
                  <span className="text-sm font-medium text-[#2A1A0E]/70">Anonim / Samarkan Nama</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2A1A0E] mb-2">Pesan / Doa (Opsional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D4621A] focus:ring-0 outline-none transition-colors resize-none"
                  placeholder="Tuliskan doa atau pesan penyemangat..."
                />
              </div>

              <button
                onClick={handleLanjutkan}
                disabled={!amount || amount < 10000 || (!isAnonymous && !donorName.trim())}
                className="w-full bg-[#D4621A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#b55013] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lanjutkan Pembayaran
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              
              <div className="bg-[#FEF3E2]/50 p-6 rounded-2xl border border-[#F4AE52]/30 text-center">
                <h3 className="text-lg font-bold text-[#2A1A0E] mb-1">Scan QRIS Panti Asuhan</h3>
                <p className="text-[#2A1A0E]/70 text-sm mb-6">Silakan transfer sesuai dengan nominal donasi Anda.</p>
                
                <div className="bg-white p-3 sm:p-5 rounded-2xl inline-block shadow-sm border border-gray-200 mb-6">
                  {/* Gambar QRIS Asli */}
                  <div className="w-[280px] sm:w-[380px] relative flex items-center justify-center rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="/qris.png" 
                      alt="QRIS Anak Yesus Berbagi" 
                      className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Jika gambar tidak ditemukan, tampilkan pesan bantuan
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerHTML = '<div class="text-center p-4 text-xs text-gray-400 border-2 border-dashed rounded-lg border-gray-300 w-full h-full flex items-center justify-center">Foto QRIS belum dimasukkan.<br/>Taruh file "qris.png" di folder public.</div>';
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="mb-2 text-[#2A1A0E]/70">Total yang harus ditransfer:</div>
                <div className="text-3xl font-extrabold text-[#D4621A]">{formatCurrency(Number(amount))}</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                <label className="block text-sm font-bold text-[#2A1A0E] mb-2">
                  Upload Bukti Pembayaran <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-4">Wajib melampirkan screenshot atau foto bukti transfer agar donasi dapat diverifikasi.</p>
                
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${paymentProof ? 'border-[#10B981] bg-[#10B981]/5' : 'border-[#F4AE52] bg-[#FEF3E2]/30 hover:bg-[#FEF3E2]'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {paymentProof ? (
                      <>
                        <FileImage className="w-8 h-8 mb-2 text-[#10B981]" />
                        <p className="text-sm font-semibold text-[#10B981]">{paymentProof.name}</p>
                        <p className="text-xs text-[#10B981]/70 mt-1">Ketuk untuk mengubah file</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 mb-2 text-[#D4621A]" />
                        <p className="text-sm font-medium text-[#2A1A0E]"><span className="font-semibold text-[#D4621A]">Pilih file</span> atau tarik dan lepas</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG atau PDF (Maks. 5MB)</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleUploadProof} />
                </label>
              </div>

              <button
                onClick={handleDonasiSelesai}
                disabled={!paymentProof || isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#10B981] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#059669] transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="animate-pulse">Menyimpan Donasi...</span>
                ) : (
                  <>
                    <CheckCircle2 />
                    Donasi Selesai
                  </>
                )}
              </button>
              
              <button 
                onClick={() => setStep(1)} 
                disabled={isLoading}
                className="w-full text-center text-[#2A1A0E]/60 font-medium hover:text-[#D4621A] py-2"
              >
                Kembali
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
