"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

export default function DashboardProfilePage() {
  const { user } = useAuth();
  
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">Cập nhật hồ sơ</h2>
      
      <form className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Họ và Tên</label>
            <input type="text" className="flex h-11 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" defaultValue={user?.name || ''} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Số điện thoại</label>
            <input type="text" className="flex h-11 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" defaultValue="" placeholder="Chưa cập nhật" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold mb-2 block">Email (<span className="text-green-600">Đã xác minh</span>)</label>
            <input type="email" className="flex h-11 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm transition-colors opacity-70 cursor-not-allowed" defaultValue={user?.email || ''} readOnly />
            <p className="text-xs text-muted-foreground mt-1.5">Email liên kết với tài khoản không thể thay đổi.</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold mb-2 block">Ngày sinh</label>
            <input type="date" className="flex h-11 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" defaultValue="1995-05-15" />
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <h3 className="text-xl font-bold mb-4 tracking-tight">Thay đổi mật khẩu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Mật khẩu mới</label>
            <input type="password" className="flex h-11 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" placeholder="Để trống nếu không đổi" />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Xác nhận mật khẩu mới</label>
            <input type="password" className="flex h-11 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" placeholder="Để trống nếu không đổi" />
          </div>
        </div>

        <div className="mt-8 pt-4 border-t flex justify-end">
          <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary bg-primary text-primary-foreground shadow-md hover:bg-primary/90 h-11 px-8">
            Lưu Thay Đổi
          </button>
        </div>
      </form>
    </div>
  );
}
