"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock Authentication Logic
    setTimeout(() => {
      if (email === 'admin@mh36travel.com' && password === 'admin123') {
        login({ id: 'admin-1', name: 'Quản trị viên', email, role: 'admin' });
        // Redirect to Admin Dashboard on success
        router.push('/admin');
      } else if (email && password.length >= 6) {
        login({ id: `user-${Date.now()}`, name: email.split('@')[0], email, role: 'customer' });
        // Mock any valid user to Client Dashboard
        router.push('/dashboard');
      } else {
        setError('Email hoặc mật khẩu không chính xác.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-lg border border-border/50">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold tracking-tighter text-primary">MH36 TRAVEL</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Đăng nhập</h2>
          <p className="text-muted-foreground text-sm">Chào mừng bạn trở lại, hãy đăng nhập để tiếp tục</p>
        </div>
        
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Email hoặc Số điện thoại</label>
            <Input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email hoặc SĐT..." 
              className="h-11 bg-muted/30 focus-visible:bg-transparent" 
              required 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold">Mật khẩu</label>
              <Link href="/quen-mat-khau" className="text-xs text-primary font-medium hover:underline">Quên mật khẩu?</Link>
            </div>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="h-11 bg-muted/30 focus-visible:bg-transparent" 
              required 
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-bold shadow-md mt-6">
            {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
          </Button>
        </form>
        
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <div className="relative flex justify-center text-xs"><span className="px-3 bg-card text-muted-foreground tracking-wide font-medium uppercase">Hoặc đăng nhập với</span></div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
             <Button variant="outline" className="w-full flex-1 h-11 bg-background font-medium hover:bg-accent hover:text-accent-foreground text-sm">Google</Button>
             <Button variant="outline" className="w-full flex-1 h-11 bg-background font-medium hover:bg-accent hover:text-accent-foreground text-sm">Facebook</Button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Chưa có tài khoản? <Link href="/dang-ky" className="text-primary font-semibold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
