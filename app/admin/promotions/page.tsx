"use client";

import { useState } from 'react';
import { Search, Plus, Filter, Tag, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const initialPromotions = [
  { id: "KM_001", name: "Giảm Giá Đón Hè 2026", code: "SUMMER26", discount: "15%", type: "percentage", status: "active", usageCount: 45, maxUsage: 100 },
  { id: "KM_002", name: "Giảm 500k cho khách mới", code: "WELCOME500", discount: "500,000", type: "fixed", status: "active", usageCount: 120, maxUsage: "K.Hạn" },
  { id: "KM_003", name: "Khuyến mãi Quốc khánh 2/9", code: "QK0209", discount: "20%", type: "percentage", status: "scheduled", usageCount: 0, maxUsage: 50 },
  { id: "KM_004", name: "Voucher VIP Member", code: "VIPGOLD", discount: "2,000,000", type: "fixed", status: "active", usageCount: 12, maxUsage: 20 },
  { id: "KM_005", name: "Giảm giá Tour Quốc tế", code: "GLOBAL10", discount: "10%", type: "percentage", status: "expired", usageCount: 89, maxUsage: 150 },
];

export default function AdminPromotionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [promotions, setPromotions] = useState(initialPromotions);

  const filteredPromotions = promotions.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Quản lý Khuyến Mãi</h1>
          <p className="text-muted-foreground">Thiết lập các mã Voucher, chiến dịch giảm giá và Coupons.</p>
        </div>
        <Button size="lg" className="font-bold gap-2"><Plus className="w-4 h-4" /> Tạo Mã Mới</Button>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm theo Mã hoặc Tên chương trình..." 
              className="pl-9 bg-background h-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2 shrink-0 bg-background"><Filter className="w-4 h-4" /> Lọc Trạng thái</Button>
            <Button variant="outline" className="gap-2 shrink-0 bg-background"><Tag className="w-4 h-4" /> Lọc Loại Mã</Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 font-semibold border-b border-border/60">
              <tr>
                <th scope="col" className="px-6 py-4 rounded-tl-lg">Mã (Code)</th>
                <th scope="col" className="px-6 py-4">Chương trình Khuyến Mãi</th>
                <th scope="col" className="px-6 py-4 text-center">Giảm giá</th>
                <th scope="col" className="px-6 py-4 text-center">Lượt dùng</th>
                <th scope="col" className="px-6 py-4 text-center">Trạng thái</th>
                <th scope="col" className="px-6 py-4 text-right rounded-tr-lg">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.length > 0 ? (
                filteredPromotions.map((promo, index) => (
                  <tr key={promo.id} className={`border-b border-border/40 hover:bg-muted/20 transition-colors ${index === filteredPromotions.length - 1 ? 'border-none' : ''}`}>
                    <td className="px-6 py-4 font-mono font-bold text-primary text-base"><span className="border border-primary/30 bg-primary/5 px-2 py-1 rounded">{promo.code}</span></td>
                    <td className="px-6 py-4 font-medium max-w-[250px] truncate" title={promo.name}>{promo.name}</td>
                    <td className="px-6 py-4 text-center font-bold text-rose-500">{promo.discount} {promo.type === 'fixed' && 'đ'}</td>
                    <td className="px-6 py-4 text-center font-mono">
                      <span className="font-bold">{promo.usageCount}</span> / <span className="text-muted-foreground">{promo.maxUsage}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                        ${promo.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 
                          promo.status === 'scheduled' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                          'bg-slate-100 text-slate-500 border border-slate-200'}
                      `}>
                        {promo.status === 'active' ? 'Đang chạy' : promo.status === 'scheduled' ? 'Lên lịch' : 'Đã hết hạn'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-primary"><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-blue-500"><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-rose-500"><Trash2 className="w-4 h-4" /></Button>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Không tìm thấy mã khuyến mãi nào phù hợp với tìm kiếm.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
