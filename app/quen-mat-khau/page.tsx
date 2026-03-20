"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    
    // Mock API Call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-xl border border-border">
        
        {!isSubmitted ? (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-3">Quên mật khẩu?</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">Đừng lo lắng, hãy nhập email bạn đã đăng ký. Chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu cho bạn.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-semibold mb-2 block text-foreground">Địa chỉ Email</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn..." 
                  className="h-12 bg-muted/50 focus-visible:bg-transparent rounded-xl" 
                  required 
                />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-bold shadow-md rounded-xl">
                {isLoading ? 'Đang gửi...' : (
                  <span className="flex items-center">Gửi xác nhận <ArrowRight className="ml-2 w-4 h-4" /></span>
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">Kiểm tra Email</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Chúng tôi đã gửi một liên kết khôi phục mật khẩu tới <span className="font-semibold text-foreground">{email}</span>. Vui lòng kiểm tra hộp thư đến và thư mục spam của bạn.
            </p>
            <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-xl" onClick={() => setIsSubmitted(false)}>
              Nhập lại email khác
            </Button>
          </div>
        )}
        
        <div className="mt-8 text-center sm:px-6">
           <Link href="/dang-nhap" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
             <ArrowLeft className="mr-2 w-4 h-4" /> Quay lại trang Đăng nhập
           </Link>
        </div>
      </div>
    </div>
  );
}
