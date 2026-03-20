"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock Registration Logic
    setTimeout(() => {
      login({ id: `user-${Date.now()}`, name: formData.name || 'Thành viên mới', email: formData.email, role: 'customer' });
      // Simulate successful registration, then redirect to user dashboard
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-lg border border-border/50">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold tracking-tighter text-primary">MH36 TRAVEL</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Đăng ký tài khoản</h2>
          <p className="text-muted-foreground text-sm">Tạo tài khoản để nhận nhiều ưu đãi du lịch</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Họ và Tên</label>
            <Input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Nhập họ tên của bạn..." 
              className="h-11 bg-muted/30 focus-visible:bg-transparent" 
              required 
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Email</label>
            <Input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="example@email.com" 
              className="h-11 bg-muted/30 focus-visible:bg-transparent" 
              required 
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Số điện thoại</label>
            <Input 
              type="tel" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="0912345678" 
              className="h-11 bg-muted/30 focus-visible:bg-transparent" 
              required 
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Mật khẩu</label>
            <Input 
              type="password" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••" 
              className="h-11 bg-muted/30 focus-visible:bg-transparent" 
              required 
              minLength={6}
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-bold shadow-md mt-6">
            {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </Button>
        </form>
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Đã có tài khoản? <Link href="/dang-nhap" className="text-primary font-semibold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
