"use client";

import { useState, useEffect } from 'react';
import { Save, Globe, Mail, MapPin, PhoneCall, Link as LinkIcon, CheckCircle2, Send, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettings } from '@/contexts/SettingsContext';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState({ logo: false, hero: false });

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('social.')) {
      const socialField = field.split('.')[1];
      setFormData({
        ...formData,
        social: {
          ...formData.social,
          [socialField]: value
        }
      });
    } else if (field.startsWith('newsletter.')) {
      const newsField = field.split('.')[1];
      setFormData({
        ...formData,
        newsletter: {
          ...formData.newsletter,
          [newsField]: value
        }
      });
    } else if (field.startsWith('images.')) {
      const imgField = field.split('.')[1];
      setFormData({
        ...formData,
        images: {
          ...formData.images,
          [imgField]: value
        }
      });
    } else if (field.startsWith('reminders.')) {
      const reminderField = field.split('.')[1];
      setFormData({
        ...formData,
        reminders: {
          ...formData.reminders,
          [reminderField]: value
        }
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleImageUpload = async (type: 'logoUrl' | 'heroImageUrl', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [type === 'logoUrl' ? 'logo' : 'hero']: true }));
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      if (result.success) {
        handleChange(`images.${type}`, result.url);
      } else {
        alert("Lỗi upload: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi upload ảnh.");
    } finally {
      setIsUploading(prev => ({ ...prev, [type === 'logoUrl' ? 'logo' : 'hero']: false }));
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Cài đặt chung</h1>
            <p className="text-muted-foreground">Quản lý các thông tin cơ bản, liên hệ và hiển thị của Website.</p>
          </div>
          <div className="flex items-center gap-3">
            {isSaved && <span className="text-sm text-green-600 font-medium flex items-center gap-1 animate-in fade-in"><CheckCircle2 className="w-4 h-4" /> Đã lưu !</span>}
            <Button onClick={handleSave} size="lg" className="font-bold gap-2"><Save className="w-4 h-4" /> Lưu thay đổi</Button>
          </div>
        </div>

        {/* Thông tin Website */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-8">
           <div className="bg-muted/30 px-6 py-4 border-b border-border/60">
             <h3 className="font-bold text-lg flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Thông tin Website</h3>
           </div>
           
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
               <label className="text-sm font-semibold mb-2 block">Tên Công Ty / Thương Hiệu</label>
               <Input 
                 value={formData.companyName}
                 onChange={(e) => handleChange('companyName', e.target.value)}
                 className="h-11 bg-muted/10 font-bold" 
               />
             </div>
             
             <div className="md:col-span-2">
               <label className="text-sm font-semibold mb-2 block">Mô tả ngắn (SEO Meta Description)</label>
               <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-muted/10 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
               />
             </div>
           </div>
        </div>

        {/* Thiết lập Hình ảnh Sàn giao dịch */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-8">
           <div className="bg-muted/30 px-6 py-4 border-b border-border/60">
             <h3 className="font-bold text-lg flex items-center gap-2"><ImageIcon className="w-5 h-5 text-indigo-500" /> Hình ảnh hiển thị</h3>
           </div>
           
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <label className="text-sm font-semibold mb-2 block">Logo Thương hiệu Đầu trang</label>
               <div className="flex gap-4 items-center">
                 {formData.images?.logoUrl ? (
                   <img src={formData.images.logoUrl} alt="Logo" className="w-20 h-20 object-contain rounded-xl border bg-white shrink-0 p-2" />
                 ) : (
                   <div className="w-20 h-20 rounded-xl border bg-muted flex items-center justify-center shrink-0">
                      <span className="text-xs text-muted-foreground font-medium text-center">Chưa có<br/>Logo</span>
                   </div>
                 )}
                 <div className="flex-1">
                   <Input type="file" accept="image/*" onChange={(e) => handleImageUpload('logoUrl', e)} disabled={isUploading.logo} className="cursor-pointer file:text-primary file:font-semibold" />
                   {isUploading.logo && <span className="text-xs text-primary font-medium mt-1 inline-block">Đang tải logo lên...</span>}
                 </div>
               </div>
             </div>
             
             <div>
               <label className="text-sm font-semibold mb-2 block">Ảnh nền Trang chủ (Hero Banner)</label>
               <div className="flex gap-4 items-center">
                 {formData.images?.heroImageUrl ? (
                   <img src={formData.images.heroImageUrl} alt="Banner" className="w-32 h-20 object-cover rounded-xl border shrink-0" />
                 ) : (
                   <div className="w-32 h-20 rounded-xl border bg-muted flex items-center justify-center shrink-0">
                      <span className="text-xs text-muted-foreground font-medium">Chưa có Ảnh nền</span>
                   </div>
                 )}
                 <div className="flex-1">
                   <Input type="file" accept="image/*" onChange={(e) => handleImageUpload('heroImageUrl', e)} disabled={isUploading.hero} className="cursor-pointer file:text-primary file:font-semibold" />
                   {isUploading.hero && <span className="text-xs text-primary font-medium mt-1 inline-block">Đang tải banner lên...</span>}
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Thông tin Liên Hệ */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-8">
           <div className="bg-muted/30 px-6 py-4 border-b border-border/60">
             <h3 className="font-bold text-lg flex items-center gap-2"><PhoneCall className="w-5 h-5 text-green-500" /> Thông tin Liên Hệ</h3>
           </div>
           
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
               <label className="text-sm font-semibold mb-2 block">Địa chỉ Trụ sở</label>
               <div className="relative">
                  <MapPin className="absolute top-3.5 left-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="h-11 bg-muted/10 pl-9" 
                  />
               </div>
             </div>
             
             <div>
               <label className="text-sm font-semibold mb-2 block">Hotline (Số điện thoại)</label>
               <div className="relative">
                  <PhoneCall className="absolute top-3.5 left-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={formData.hotline}
                    onChange={(e) => handleChange('hotline', e.target.value)}
                    className="h-11 bg-muted/10 pl-9 font-bold" 
                  />
               </div>
             </div>
             
             <div>
               <label className="text-sm font-semibold mb-2 block">Email Hỗ trợ</label>
               <div className="relative">
                  <Mail className="absolute top-3.5 left-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="h-11 bg-muted/10 pl-9" 
                  />
               </div>
             </div>
           </div>
        </div>

        {/* Mạng Xã Hội */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-8">
           <div className="bg-muted/30 px-6 py-4 border-b border-border/60">
             <h3 className="font-bold text-lg flex items-center gap-2"><LinkIcon className="w-5 h-5 text-blue-500" /> Mạng xã hội</h3>
           </div>
           
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="text-sm font-semibold mb-2 block">Facebook Page URL</label>
               <Input 
                 value={formData.social.facebook}
                 onChange={(e) => handleChange('social.facebook', e.target.value)}
                 className="h-11 bg-muted/10" 
                 placeholder="https://facebook.com/..."
               />
             </div>
             <div>
               <label className="text-sm font-semibold mb-2 block">Zalo OA Link</label>
               <Input 
                 value={formData.social.zalo}
                 onChange={(e) => handleChange('social.zalo', e.target.value)}
                 className="h-11 bg-muted/10" 
                 placeholder="https://zalo.me/..."
               />
             </div>
             <div>
               <label className="text-sm font-semibold mb-2 block">Instagram URL</label>
               <Input 
                 value={formData.social.instagram}
                 onChange={(e) => handleChange('social.instagram', e.target.value)}
                 className="h-11 bg-muted/10" 
                 placeholder="https://instagram.com/..."
               />
             </div>
             <div>
               <label className="text-sm font-semibold mb-2 block">Tiktok Channel</label>
               <Input 
                 value={formData.social.tiktok}
                 onChange={(e) => handleChange('social.tiktok', e.target.value)}
                 className="h-11 bg-muted/10" 
                 placeholder="https://tiktok.com/..."
               />
             </div>
             <div>
               <label className="text-sm font-semibold mb-2 block">Youtube Channel</label>
               <Input 
                 value={formData.social.youtube}
                 onChange={(e) => handleChange('social.youtube', e.target.value)}
                 className="h-11 bg-muted/10" 
                 placeholder="https://youtube.com/..."
               />
             </div>
             <div>
               <label className="text-sm font-semibold mb-2 block">Twitter / X</label>
               <Input 
                 value={formData.social.twitter}
                 onChange={(e) => handleChange('social.twitter', e.target.value)}
                 className="h-11 bg-muted/10" 
                 placeholder="https://twitter.com/..."
               />
             </div>
           </div>
        </div>

        {/* Thiết lập Form Đăng ký (Newsletter) */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-8">
           <div className="bg-muted/30 px-6 py-4 border-b border-border/60">
             <h3 className="font-bold text-lg flex items-center gap-2"><Send className="w-5 h-5 text-indigo-500" /> Cấu hình form Đăng ký (Newsletter)</h3>
           </div>
           
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
               <label className="text-sm font-semibold mb-2 block">Tiêu đề Form Đăng ký</label>
               <Input 
                 value={formData.newsletter.title}
                 onChange={(e) => handleChange('newsletter.title', e.target.value)}
                 className="h-11 bg-muted/10 font-bold" 
               />
               <p className="text-xs text-muted-foreground mt-2">Dòng chữ hiển thị trên form Đăng nhập Email ở Footer</p>
             </div>
             
             <div className="md:col-span-2">
               <label className="text-sm font-semibold mb-2 block">Mô tả kèm theo (Không bắt buộc)</label>
               <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-muted/10 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  value={formData.newsletter.description}
                  onChange={(e) => handleChange('newsletter.description', e.target.value)}
                  placeholder="Khuyến khích người dùng để lại Email..."
               />
             </div>

             <div className="md:col-span-2 border-t border-border/40 pt-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                 <div className="absolute -top-3 left-4 bg-card px-2 text-xs font-semibold text-muted-foreground">Cấu hình Gửi Email Tự động</div>
                 <div>
                   <label className="text-sm font-semibold mb-2 flex items-center gap-2">Tài khoản Gmail (Email người gửi) <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded uppercase leading-none font-bold">Quan trọng</span></label>
                   <div className="relative">
                      <Mail className="absolute top-3.5 left-3 w-4 h-4 text-muted-foreground" />
                      <Input 
                        value={formData.newsletter.gmailAccount || ''}
                        onChange={(e) => handleChange('newsletter.gmailAccount', e.target.value)}
                        className="h-11 bg-muted/10 pl-9 font-medium" 
                        placeholder="Ví dụ: thuonghieu@gmail.com"
                        type="email"
                        autoComplete="off"
                      />
                   </div>
                 </div>

                 <div>
                   <label className="text-sm font-semibold mb-2 flex flex-wrap items-center gap-2">Mật khẩu ứng dụng (Google App Password) <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-[10px] font-normal md:ml-auto">Hướng dẫn lấy mật khẩu</a></label>
                   <Input 
                     value={formData.newsletter.appPassword || ''}
                     onChange={(e) => handleChange('newsletter.appPassword', e.target.value)}
                     className="h-11 bg-muted/10 font-mono tracking-widest text-lg" 
                     placeholder="xxxxxxxxxxxxxxxx"
                     type="password"
                     autoComplete="new-password"
                   />
                   <p className="text-xs text-muted-foreground mt-2">Mật khẩu 16 ký tự dùng để hệ thống cấp quyền gửi thư tự động.</p>
                 </div>
             </div>
           </div>
        </div>

        {/* Cấu hình Nhắc Lịch (Zalo / SMS) */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-8">
           <div className="bg-muted/30 px-6 py-4 border-b border-border/60">
             <h3 className="font-bold text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5 text-green-500" /> Cấu hình Nhắc lịch (Zalo / SMS)</h3>
           </div>
           
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-6">
               <h4 className="font-semibold text-primary/80 border-b pb-2 mb-4">Cấu hình Zalo ZNS API</h4>
               <div>
                 <label className="text-sm font-semibold mb-2 block">Zalo OA Access Token</label>
                 <Input 
                   value={formData.reminders?.zaloOaToken || ''}
                   onChange={(e) => handleChange('reminders.zaloOaToken', e.target.value)}
                   className="h-11 bg-muted/10 font-mono text-xs" 
                   placeholder="Nhập Access Token từ Zalo For Developers"
                 />
               </div>
               <div>
                 <label className="text-sm font-semibold mb-2 block">Template ID Zalo ZNS</label>
                 <Input 
                   value={formData.reminders?.zaloTemplateId || ''}
                   onChange={(e) => handleChange('reminders.zaloTemplateId', e.target.value)}
                   className="h-11 bg-muted/10" 
                   placeholder="VD: 123456"
                 />
                 <p className="text-xs text-muted-foreground mt-2">Mã mẫu ZNS xét duyệt để gửi nhắc nhở.</p>
               </div>
             </div>
             
             <div className="space-y-6">
               <h4 className="font-semibold text-primary/80 border-b pb-2 mb-4">Cấu hình SMS API</h4>
               <div>
                 <label className="text-sm font-semibold mb-2 block">API Key Dịch vụ SMS (Ví dụ: SpeedSMS)</label>
                 <Input 
                   value={formData.reminders?.smsApiKey || ''}
                   onChange={(e) => handleChange('reminders.smsApiKey', e.target.value)}
                   className="h-11 bg-muted/10 font-mono text-xs" 
                   placeholder="Nhập API Key cung cấp bởi dịch vụ SMS"
                 />
               </div>
               <div>
                 <label className="text-sm font-semibold mb-2 block">Brandname Đăng ký</label>
                 <Input 
                   value={formData.reminders?.smsBrandname || ''}
                   onChange={(e) => handleChange('reminders.smsBrandname', e.target.value)}
                   className="h-11 bg-muted/10 font-bold" 
                   placeholder="VD: MH36TRAVEL"
                 />
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
