"use client";

import { useState } from 'react';
import { Search, Info, Download, Filter, UserCheck, ShieldAlert, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const initialUsers = [
  { id: "U1", name: "Nguyễn Văn Tuấn", email: "tuan.nv@example.com", rp: 12000, tours: 4, joined: "12/03/2026", status: "verified" },
  { id: "U2", name: "Trần Thị Mai", email: "tranmai99@example.com", rp: 500, tours: 1, joined: "10/03/2026", status: "verified" },
  { id: "U3", name: "Lê Hoàng Bảo", email: "bao.lh_dev@example.com", rp: 0, tours: 0, joined: "15/03/2026", status: "unverified" },
  { id: "U4", name: "Phạm Hồng Ngọc", email: "ngocph88@example.com", rp: 35000, tours: 12, joined: "01/01/2026", status: "vip" },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(initialUsers);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Quản lý Khách hàng</h1>
          <p className="text-muted-foreground">Giám sát và quản lý dữ liệu toàn bộ khách hàng nền tảng.</p>
        </div>
        <Button size="lg" variant="outline" className="font-bold gap-2"><Download className="w-4 h-4" /> Xuất Data (CSV)</Button>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm theo Tên, Email khách hàng..." 
              className="pl-9 bg-background h-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2 shrink-0 bg-background"><Filter className="w-4 h-4" /> Lọc hạng thẻ  </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 font-semibold border-b border-border/60">
              <tr>
                <th scope="col" className="px-6 py-4 rounded-tl-lg">Khách hàng</th>
                <th scope="col" className="px-6 py-4">Tài khoản & Xác thực</th>
                <th scope="col" className="px-6 py-4 text-center">Reward (Điểm)</th>
                <th scope="col" className="px-6 py-4 text-center">Tổng số Tour</th>
                <th scope="col" className="px-6 py-4 text-right rounded-tr-lg">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className={`border-b border-border/40 hover:bg-muted/20 transition-colors ${index === filteredUsers.length - 1 ? 'border-none' : ''}`}>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                             {user.name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-bold">{user.name}</p>
                             <p className="text-xs text-muted-foreground">Tham gia: {user.joined}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="font-medium">{user.email}</p>
                       <div className="flex items-center gap-1 mt-1">
                          {user.status === 'vip' && <span className="flex items-center text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold"><BadgeCheck className="w-3 h-3 mr-1"/> VIP Member</span>}
                          {user.status === 'verified' && <span className="flex items-center text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold"><UserCheck className="w-3 h-3 mr-1"/> Đã xác minh</span>}
                          {user.status === 'unverified' && <span className="flex items-center text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold"><ShieldAlert className="w-3 h-3 mr-1"/> Chưa xác minh mail</span>}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-amber-500">{new Intl.NumberFormat().format(user.rp)}</td>
                    <td className="px-6 py-4 text-center font-bold">{user.tours}</td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-primary"><Info className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Không tìm thấy khách hàng nào khớp với tìm kiếm.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
