"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Youtube, Twitter, CheckCircle2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => setIsSubscribed(false), 8000);
      } else {
        setError(result.error || 'Đã có lỗi xảy ra. Hãy thử lại.');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi kết nối. Hãy thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="border-t bg-card mt-auto transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Cột 1: Thông tin */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4 group">
              {settings.images?.logoUrl ? (
                <img src={settings.images.logoUrl} alt={settings.companyName} className="h-10 w-auto object-contain" />
              ) : (
                <span className="text-2xl font-black tracking-tighter drop-shadow-sm group-hover:opacity-80 transition-all italic underline-offset-8 text-primary">
                  MH36 TRAVEL
                </span>
              )}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {settings.description}
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Hotline:</strong> {settings.hotline}</p>
              <p><strong>Email:</strong> {settings.email}</p>
            </div>
          </div>
          
          {/* Cột 2: Danh mục */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-base">Hành trình tuyệt vời</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/tour?destination=da-nang" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Du lịch Đà Nẵng</Link></li>
              <li><Link href="/tour?destination=phu-quoc" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Du lịch Phú Quốc</Link></li>
              <li><Link href="/tour?destination=nha-trang" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Du lịch Nha Trang</Link></li>
              <li><Link href="/tour?destination=sapa" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Du lịch Sapa</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-base">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/lien-he" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Trung tâm trợ giúp</Link></li>
              <li><Link href="/faqs" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Câu hỏi thường gặp</Link></li>
              <li><Link href="/chinh-sach" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Chính sách bảo mật</Link></li>
              <li><Link href="/dieu-khoan" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          {/* Cột 4: Kết nối */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-base">Kết nối với chúng tôi</h3>
            <div className="flex flex-wrap gap-3 mb-8">
              {settings.social.facebook && (
                <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-500/10 hover:bg-blue-500 hover:text-white flex items-center justify-center text-blue-500 transition-all duration-300">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.social.instagram && (
                <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-pink-500/10 hover:bg-pink-500 hover:text-white flex items-center justify-center text-pink-500 transition-all duration-300">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.social.youtube && (
                <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500 hover:text-white flex items-center justify-center text-red-500 transition-all duration-300">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.social.twitter && (
                 <a href={settings.social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-sky-500/10 hover:bg-sky-500 hover:text-white flex items-center justify-center text-sky-500 transition-all duration-300">
                  <Twitter className="w-4 h-4" />
                 </a>
              )}
            </div>
            
            <h3 className="font-bold text-foreground mb-2 text-sm">{settings.newsletter.title}</h3>
            {settings.newsletter.description && (
              <p className="text-xs text-muted-foreground mb-3">{settings.newsletter.description}</p>
            )}
            
            {isSubscribed ? (
               <div className="flex items-center gap-2 text-sm text-green-600 bg-green-500/10 p-3 rounded-lg animate-in fade-in">
                 <CheckCircle2 className="w-5 h-5" />
                 <span>Đăng ký thành công! Kiểm tra email của bạn nhé.</span>
               </div>
            ) : (
              <div className="space-y-2">
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập Email của bạn..." 
                    className="flex h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" 
                    required
                    disabled={isLoading}
                  />
                  <Button type="submit" className="h-10" disabled={isLoading}>
                    {isLoading ? '...' : 'Đăng ký'}
                  </Button>
                </form>
                {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} {settings.companyName}. Đã bảo lưu mọi quyền.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-foreground">Việt Nam (VN)</span>
            <span className="cursor-pointer hover:text-foreground">VND (đ)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
