"use client";

import { useState, useEffect } from 'react';
import { LayoutDashboard, CreditCard, Settings, ChevronRight, Save, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePayment } from '@/contexts/PaymentContext';

export default function PaymentSettingsPage() {
  const { paymentConfig, updatePaymentConfig } = usePayment();
  const [formData, setFormData] = useState(paymentConfig);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(paymentConfig);
  }, [paymentConfig]);

  const handleSave = () => {
    updatePaymentConfig(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChange = (provider: 'vnpay' | 'momo' | 'bankTransfer', field: string, value: any) => {
    setFormData({
      ...formData,
      [provider]: {
        ...formData[provider],
        [field]: value
      }
    });
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Cấu hình Payment Gateway</h1>
                <p className="text-muted-foreground">Thiết lập các API Keys và cấu hình môi trường thanh toán cho hệ thống.</p>
              </div>
              <div className="flex items-center gap-3">
                {isSaved && <span className="text-sm text-green-600 font-medium flex items-center gap-1 animate-in fade-in"><CheckCircle2 className="w-4 h-4" /> Đã lưu !</span>}
                <Button onClick={handleSave} size="lg" className="font-bold gap-2"><Save className="w-4 h-4" /> Lưu cấu hình</Button>
              </div>
            </div>

            {/* VNPay Config */}
            <div className={`bg-card rounded-2xl border ${formData.vnpay.enabled ? 'border-primary/50' : 'border-border/60'} shadow-sm overflow-hidden mb-8 transition-colors`}>
               <div className="bg-primary/5 px-6 py-4 flex justify-between items-center border-b border-border/60">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 border shadow-sm">
                     <span className="font-bold text-blue-600 text-[10px]">VNPAY</span>
                   </div>
                   <div>
                     <h3 className="font-bold text-lg leading-tight">Tích hợp VNPay</h3>
                     <p className="text-xs text-muted-foreground">Thanh toán qua mã QR ứng dụng ngân hàng và thẻ nội địa</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 bg-background px-3 py-1.5 rounded-lg border shadow-sm">
                   <span className="text-sm font-semibold">Kích hoạt:</span>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formData.vnpay.enabled} onChange={(e) => handleChange('vnpay', 'enabled', e.target.checked)} />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                   </label>
                 </div>
               </div>
               <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-card opacity-100 transition-opacity" style={{ opacity: formData.vnpay.enabled ? 1 : 0.5 }}>
                 <div>
                   <label className="text-sm font-semibold mb-2 block">Môi trường (Environment)</label>
                   <select 
                     value={formData.vnpay.environment}
                     onChange={(e) => handleChange('vnpay', 'environment', e.target.value)}
                     disabled={!formData.vnpay.enabled}
                     className="flex h-11 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:opacity-50">
                     <option value="sandbox">Sandbox (Thử nghiệm)</option>
                     <option value="production">Production (Thực tế)</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-sm font-semibold mb-2 block">VNPay URL</label>
                   <Input 
                     value={formData.vnpay.url}
                     onChange={(e) => handleChange('vnpay', 'url', e.target.value)}
                     disabled={!formData.vnpay.enabled}
                     className="h-11 bg-muted/30 disabled:opacity-50" 
                   />
                 </div>
                 <div>
                   <label className="text-sm font-semibold mb-2 block">Terminal Code (vnp_TmnCode)</label>
                   <Input 
                     value={formData.vnpay.tmnCode}
                     onChange={(e) => handleChange('vnpay', 'tmnCode', e.target.value)}
                     disabled={!formData.vnpay.enabled}
                     className="h-11 bg-muted/30 disabled:opacity-50" 
                   />
                 </div>
                 <div>
                   <label className="text-sm font-semibold mb-2 block">Hash Secret (vnp_HashSecret)</label>
                   <Input 
                     type="password" 
                     value={formData.vnpay.hashSecret}
                     onChange={(e) => handleChange('vnpay', 'hashSecret', e.target.value)}
                     disabled={!formData.vnpay.enabled}
                     className="h-11 bg-muted/30 disabled:opacity-50" 
                   />
                 </div>
               </div>
            </div>

            {/* MoMo Config */}
            <div className={`bg-card rounded-2xl border ${formData.momo.enabled ? 'border-[#A50064]/50' : 'border-border/60'} shadow-sm overflow-hidden transition-colors`}>
               <div className="bg-[#A50064]/5 px-6 py-4 flex justify-between items-center border-b border-border/60">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-[#A50064] text-white rounded-lg flex items-center justify-center p-1 shadow-sm">
                     <span className="font-bold text-[10px]">MoMo</span>
                   </div>
                   <div>
                     <h3 className="font-bold text-lg leading-tight">Tích hợp Ví MoMo</h3>
                     <p className="text-xs text-muted-foreground">Thanh toán tự động qua cổng thanh toán MoMo E-Wallet</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 bg-background px-3 py-1.5 rounded-lg border shadow-sm">
                   <span className="text-sm font-semibold">Kích hoạt:</span>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formData.momo.enabled} onChange={(e) => handleChange('momo', 'enabled', e.target.checked)} />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A50064]"></div>
                   </label>
                 </div>
               </div>
               <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-card opacity-100 transition-opacity" style={{ opacity: formData.momo.enabled ? 1 : 0.5 }}>
                 <div>
                   <label className="text-sm font-semibold mb-2 block">Môi trường (Environment)</label>
                   <select 
                     value={formData.momo.environment}
                     onChange={(e) => handleChange('momo', 'environment', e.target.value)}
                     disabled={!formData.momo.enabled}
                     className="flex h-11 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:opacity-50">
                     <option value="sandbox">Sandbox (Thử nghiệm)</option>
                     <option value="production">Production (Thực tế)</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-sm font-semibold mb-2 block">Partner Code</label>
                   <Input 
                     value={formData.momo.partnerCode}
                     onChange={(e) => handleChange('momo', 'partnerCode', e.target.value)}
                     disabled={!formData.momo.enabled}
                     className="h-11 bg-muted/30 disabled:opacity-50" 
                   />
                 </div>
                 <div>
                   <label className="text-sm font-semibold mb-2 block">Access Key</label>
                   <Input 
                     value={formData.momo.accessKey}
                     onChange={(e) => handleChange('momo', 'accessKey', e.target.value)}
                     disabled={!formData.momo.enabled}
                     className="h-11 bg-muted/30 disabled:opacity-50" 
                   />
                 </div>
                 <div>
                   <label className="text-sm font-semibold mb-2 block">Secret Key</label>
                   <Input 
                     type="password" 
                     value={formData.momo.secretKey}
                     onChange={(e) => handleChange('momo', 'secretKey', e.target.value)}
                     disabled={!formData.momo.enabled}
                     className="h-11 bg-muted/30 disabled:opacity-50" 
                   />
                 </div>
               </div>
            </div>

            {/* Bank Transfer Config */}
            <div className={`bg-card rounded-2xl border ${formData.bankTransfer.enabled ? 'border-primary/50' : 'border-border/60'} shadow-sm overflow-hidden transition-colors mt-8`}>
               <div className="bg-primary/5 px-6 py-4 flex justify-between items-center border-b border-border/60">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center p-1 shadow-sm font-bold text-xl">
                     🏦
                   </div>
                   <div>
                     <h3 className="font-bold text-lg leading-tight">Chuyển khoản Ngân Hàng (VietQR)</h3>
                     <p className="text-xs text-muted-foreground">Khách hàng quét mã QR Code để chuyển khoản thủ công</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 bg-background px-3 py-1.5 rounded-lg border shadow-sm">
                   <span className="text-sm font-semibold">Kích hoạt:</span>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formData.bankTransfer.enabled} onChange={(e) => handleChange('bankTransfer', 'enabled', e.target.checked)} />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                   </label>
                 </div>
               </div>
               <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-card opacity-100 transition-opacity" style={{ opacity: formData.bankTransfer.enabled ? 1 : 0.5 }}>
                 <div>
                   <label className="text-sm font-semibold mb-2 block">Tên Ngân Hàng (Mã BIN/Tên viết tắt - Vd: MB, VCB, ACB)</label>
                   <Input 
                     value={formData.bankTransfer.bankName}
                     onChange={(e) => handleChange('bankTransfer', 'bankName', e.target.value.toUpperCase())}
                     disabled={!formData.bankTransfer.enabled}
                     className="h-11 bg-muted/30 disabled:opacity-50 uppercase" 
                     placeholder="Ví dụ: MBBANK"
                   />
                 </div>
                 <div>
                   <label className="text-sm font-semibold mb-2 block">Số Tài Khoản</label>
                   <Input 
                     value={formData.bankTransfer.accountNumber}
                     onChange={(e) => handleChange('bankTransfer', 'accountNumber', e.target.value)}
                     disabled={!formData.bankTransfer.enabled}
                     className="h-11 bg-muted/30 disabled:opacity-50"
                     placeholder="Ví dụ: 09123456789"
                   />
                 </div>
                 <div className="md:col-span-2">
                   <label className="text-sm font-semibold mb-2 block">Tên Chủ Tài Khoản (In hoa không dấu)</label>
                   <Input 
                     value={formData.bankTransfer.accountName}
                     onChange={(e) => handleChange('bankTransfer', 'accountName', e.target.value.toUpperCase())}
                     disabled={!formData.bankTransfer.enabled}
                     className="h-11 bg-muted/30 disabled:opacity-50 uppercase" 
                     placeholder="Ví dụ: CONG TY TNHH MH36 TRAVEL"
                   />
                 </div>
               </div>
            </div>

      </div>
    </div>
  );
}
