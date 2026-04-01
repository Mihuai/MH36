"use client";

import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Filter, Package, Eye, Edit, Trash2, PlusCircle, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

const mockTours = [
  { id: "T001", name: "Tour Phú Quốc Mùa Hè 3N2Đ", code: "PQ2026", price: 3500000, status: "active", bookings: 45, imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80" },
  { id: "T002", name: "Đà Nẵng - Hội An 4N3Đ", code: "DNHA26", price: 4200000, status: "active", bookings: 120, imageUrl: "https://images.unsplash.com/photo-1582294109151-e1293fbffb45?w=400&q=80" },
  { id: "T003", name: "Khám phá Vịnh Hạ Long", code: "HL26", price: 2800000, status: "draft", bookings: 0, imageUrl: "https://images.unsplash.com/photo-1528127269322-53982823b814?w=400&q=80" },
  { id: "T004", name: "Sapa Mùa Lúa Chín 3N2Đ", code: "SP26", price: 3100000, status: "active", bookings: 86, imageUrl: "https://images.unsplash.com/photo-1629813350117-9095646199a6?w=400&q=80" },
  { id: "T005", name: "Nha Trang Biển Gọi 4N3Đ", code: "NT26", price: 4500000, status: "paused", bookings: 12, imageUrl: "https://images.unsplash.com/photo-1587825223366-224424e6b185?w=400&q=80" },
];

export default function AdminToursPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tours, setTours] = useState(mockTours);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [currentTour, setCurrentTour] = useState<any>(null);
  
  const initialFormState = { 
    name: '', code: '', price: 0, status: 'active', bookings: 0, imageUrl: '',
    description: '', includes: '', excludes: '',
    itinerary: [{ day: 1, title: '', content: '' }]
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isUploading, setIsUploading] = useState(false);

  const filteredTours = tours.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Kiểm tra dung lượng file (4.5MB là giới hạn Vercel, cài 4MB cho an toàn)
    const MAX_SIZE = 4 * 1024 * 1024; // 4MB
    if (file.size > MAX_SIZE) {
      alert(`File quá lớn (${(file.size / (1024 * 1024)).toFixed(2)}MB). Vui lòng chọn ảnh dưới 4MB để đảm bảo hệ thống hoạt động ổn định.`);
      e.target.value = ''; // Reset input
      return;
    }

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      
      if (result.success) {
        setFormData(prev => ({ ...prev, imageUrl: result.url }));
      } else {
        // Xử lý các lỗi nghiệp vụ từ API (vd: bucket lỗi, format không hỗ trợ)
        alert("Lỗi upload: " + (result.error || "Không xác định"));
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi kết nối khi upload. Hãy kiểm tra lại mạng hoặc thử lại sau.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSubmit = () => {
    const newTour = { 
       id: `T${Math.floor(Math.random() * 1000)}`,
       ...formData,
       bookings: 0
    };
    setTours([newTour, ...tours]);
    setIsAddOpen(false);
    setFormData(initialFormState);
  };

  const handleEditSubmit = () => {
    setTours(tours.map(t => t.id === currentTour.id ? { ...t, ...formData } : t));
    setIsEditOpen(false);
  };

  const handleDeleteSubmit = () => {
    setTours(tours.filter(t => t.id !== currentTour.id));
    setIsDeleteOpen(false);
  };

  const openAdd = () => {
    setFormData(initialFormState);
    setIsAddOpen(true);
  };

  const openEdit = (tour: any) => {
    setCurrentTour(tour);
    setFormData({ 
      name: tour.name, code: tour.code, price: tour.price, status: tour.status, bookings: tour.bookings, imageUrl: tour.imageUrl || '',
      description: tour.description || '',
      includes: tour.includes ? tour.includes.join('\n') : '',
      excludes: tour.excludes ? tour.excludes.join('\n') : '',
      itinerary: tour.itinerary?.length > 0 ? tour.itinerary : [{ day: 1, title: '', content: '' }]
    });
    setIsEditOpen(true);
  };

  const openDelete = (tour: any) => {
    setCurrentTour(tour);
    setIsDeleteOpen(true);
  };

  const handleItineraryChange = (index: number, field: string, value: string) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const handleAddDay = () => {
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        { day: formData.itinerary.length + 1, title: '', content: '' }
      ]
    });
  };

  const handleRemoveDay = (index: number) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, day: i + 1 })); // Resync days
    setFormData({ ...formData, itinerary: newItinerary });
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Quản lý Tour</h1>
          <p className="text-muted-foreground">Xem, thêm mới và quản lý danh sách các tour du lịch hiện có.</p>
        </div>
        <Button onClick={openAdd} size="lg" className="font-bold gap-2"><Plus className="w-4 h-4" /> Thêm Tour mới</Button>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm theo Tên Tour, Mã Tour..." 
              className="pl-9 bg-background h-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2 shrink-0 bg-background"><Filter className="w-4 h-4" /> Bộ lọc</Button>
            <Button variant="outline" className="gap-2 shrink-0 bg-background"><Package className="w-4 h-4" /> Xuất Excel</Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 font-semibold border-b border-border/60">
              <tr>
                <th scope="col" className="px-6 py-4 rounded-tl-lg">Mã Tour</th>
                <th scope="col" className="px-6 py-4">Ảnh</th>
                <th scope="col" className="px-6 py-4">Tên Tour</th>
                <th scope="col" className="px-6 py-4">Mức Giá</th>
                <th scope="col" className="px-6 py-4 text-center">Đã Đặt</th>
                <th scope="col" className="px-6 py-4 text-center">Trạng thái</th>
                <th scope="col" className="px-6 py-4 text-right rounded-tr-lg">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.map((tour, index) => (
                <tr key={tour.id} className={`border-b border-border/40 hover:bg-muted/20 transition-colors ${index === filteredTours.length - 1 ? 'border-none' : ''}`}>
                  <td className="px-6 py-4 font-mono font-medium text-foreground">{tour.code}</td>
                  <td className="px-6 py-4">
                    <img src={tour.imageUrl || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=150&q=80"} alt={tour.name} className="w-12 h-12 rounded-xl object-cover bg-muted border" />
                  </td>
                  <td className="px-6 py-4 font-semibold max-w-[250px] truncate" title={tour.name}>{tour.name}</td>
                  <td className="px-6 py-4 font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)}</td>
                  <td className="px-6 py-4 text-center font-bold text-primary">{tour.bookings}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                      ${tour.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 
                        tour.status === 'draft' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 
                        'bg-rose-100 text-rose-700 border border-rose-200'}
                    `}>
                      {tour.status === 'active' ? 'Đang mở' : tour.status === 'draft' ? 'Bản nháp' : 'Tạm dừng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-primary"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-blue-500" onClick={() => openEdit(tour)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-rose-500" onClick={() => openDelete(tour)}><Trash2 className="w-4 h-4" /></Button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Skeleton */}
        <div className="p-4 border-t border-border/60 bg-muted/10 flex justify-between items-center text-sm text-muted-foreground">
           <span>Hiển thị 1 đến {Math.min(filteredTours.length, 5)} trong {filteredTours.length} tours</span>
           <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Trước</Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="sm" disabled>Sau</Button>
           </div>
        </div>
      </div>

      {/* Dialog Add Tour */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] flex flex-col p-0 overflow-hidden w-[95vw]">
          <DialogHeader className="p-6 border-b bg-card shrink-0">
            <DialogTitle className="text-2xl font-bold">Thêm Tour mới</DialogTitle>
            <DialogDescription>Điền thông tin chi tiết đầy đủ cho Tour du lịch mới.</DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Cột 1: Thông tin cơ bản */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg text-primary">Thông tin Cơ bản</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Tên Tour <span className="text-destructive">*</span></label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Vd: Tour Phú Quốc 3N2Đ..." className="h-11 rounded-xl shadow-sm" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold mb-1.5 block">Mã Tour</label>
                      <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="Vd: PQ2026" className="h-11 rounded-xl shadow-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-bold mb-1.5 block">Mức giá (₫)</label>
                      <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="h-11 rounded-xl shadow-sm font-bold" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Hình ảnh Tour (Upload)</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 rounded-2xl bg-muted/20 border border-dashed border-border/60">
                      {formData.imageUrl ? (
                        <div className="relative group shrink-0">
                           <img src={formData.imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-xl border-2 border-primary/20 shadow-md" />
                           <button onClick={() => setFormData({...formData, imageUrl: ''})} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center bg-muted/10 shrink-0">
                           <ImageIcon className="w-6 h-6 text-muted-foreground/30 mb-1" />
                           <span className="text-[10px] text-muted-foreground/50 uppercase font-bold tracking-tighter">No Preview</span>
                        </div>
                      )}
                      <div className="flex-1 w-full">
                        <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="cursor-pointer file:text-primary file:font-bold file:mr-4 file:px-4 file:bg-primary/5 file:border-none file:rounded-lg h-11 bg-background" />
                        <p className="text-[10px] text-muted-foreground mt-2 font-medium italic">* Nên dùng ảnh HD, tỉ lệ 4:3 hoặc 16:9. Tối đa 4MB.</p>
                        {isUploading && <span className="text-xs text-primary font-bold mt-2 inline-flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Đang xử lý ảnh...</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Giới thiệu ngắn</label>
                    <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-[100px] rounded-xl shadow-sm resize-none" placeholder="Tóm tắt về trải nghiệm của tour..." />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                     <div>
                        <label className="text-sm font-bold mb-1.5 block">Dịch vụ Bao gồm</label>
                        <Textarea value={formData.includes} onChange={e => setFormData({...formData, includes: e.target.value})} className="h-32 text-sm rounded-xl bg-green-50/20 border-green-100/50" placeholder="- Vé máy bay&#10;- Khách sạn 4 sao..." />
                     </div>
                     <div>
                        <label className="text-sm font-bold mb-1.5 block">Không Bao gồm</label>
                        <Textarea value={formData.excludes} onChange={e => setFormData({...formData, excludes: e.target.value})} className="h-32 text-sm rounded-xl bg-orange-50/20 border-orange-100/50" placeholder="- Tiền tip HDV&#10;- Thuế VAT..." />
                     </div>
                  </div>
                </div>
              </div>

              {/* Cột 2: Lịch trình chi tiết */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                   <div className="flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-lg text-primary">Lịch trình Chi tiết</h3>
                   </div>
                   <Button type="button" variant="outline" size="sm" onClick={handleAddDay} className="gap-2 h-9 rounded-lg font-bold border-primary/30 text-primary hover:bg-primary/5">
                      Thêm Ngày Mới
                   </Button>
                </div>
                
                <div className="space-y-4 pr-1">
                   {formData.itinerary.map((day, index) => (
                      <div key={index} className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden group">
                         <div className="bg-muted/10 p-3 flex justify-between items-center border-b border-border/40">
                            <span className="text-xs font-black text-primary/60 uppercase tracking-widest">Ngày {day.day}</span>
                            <button onClick={() => handleRemoveDay(index)} className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/5 transition-all outline-none">
                               <X className="w-4 h-4" />
                            </button>
                         </div>
                         <div className="p-4 space-y-4">
                            <Input 
                               value={day.title} 
                               onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} 
                               placeholder="Tiêu đề chính (Vd: Hà Nội - Sapa...)" 
                               className="h-10 bg-background border-none shadow-none font-bold text-[15px] focus-visible:ring-0 px-0"
                            />
                            <Textarea 
                               value={day.content} 
                               onChange={(e) => handleItineraryChange(index, 'content', e.target.value)} 
                               placeholder="Mô tả chi tiết các hoạt động..." 
                               className="min-h-[120px] bg-muted/20 border-none rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary/20"
                            />
                         </div>
                      </div>
                   ))}
                   {formData.itinerary.length === 0 && (
                     <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border/40 rounded-3xl bg-muted/5">
                       <PlusCircle className="w-10 h-10 mx-auto mb-4 opacity-10" />
                       <p className="font-bold">Chưa có lịch trình.</p>
                       <p className="text-xs opacity-70">Bấm "Thêm Ngày Mới" để bắt đầu xây dựng lộ trình.</p>
                     </div>
                   )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sticky bottom-0 p-6 bg-card border-t flex flex-col sm:flex-row gap-3 sm:justify-end shrink-0">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl px-6 h-11 font-semibold">Thoát</Button>
            <Button onClick={handleAddSubmit} className="rounded-xl px-10 h-11 font-bold shadow-lg shadow-primary/20">Lưu & Tạo Tour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Tour */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] flex flex-col p-0 overflow-hidden w-[95vw]">
          <DialogHeader className="p-6 border-b bg-card shrink-0">
            <DialogTitle className="text-2xl font-bold">Cập nhật Tour Du lịch</DialogTitle>
            <DialogDescription>Sửa đổi thông tin, hình ảnh hoặc lộ trình cho {currentTour?.name}</DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Cột 1: Thông tin cơ bản */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg text-primary">Thông tin Cơ bản</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Tên Tour</label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-11 rounded-xl shadow-sm" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold mb-1.5 block">Mã Tour</label>
                      <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="h-11 rounded-xl shadow-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-bold mb-1.5 block">Mức giá (₫)</label>
                      <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="h-11 rounded-xl shadow-sm font-bold" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Đổi Hình ảnh (Upload)</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 rounded-2xl bg-muted/20 border border-dashed border-border/60">
                      {formData.imageUrl ? (
                        <div className="relative group shrink-0">
                           <img src={formData.imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-xl border-2 border-primary/20 shadow-md" />
                           <button onClick={() => setFormData({...formData, imageUrl: ''})} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center bg-muted/10 shrink-0">
                           <ImageIcon className="w-6 h-6 text-muted-foreground/30 mb-1" />
                           <span className="text-[10px] text-muted-foreground/50 uppercase font-bold tracking-tighter">No Preview</span>
                        </div>
                      )}
                      <div className="flex-1 w-full">
                        <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="cursor-pointer file:text-primary file:font-bold file:mr-4 file:px-4 file:bg-primary/5 file:border-none file:rounded-lg h-11 bg-background" />
                        <p className="text-[10px] text-muted-foreground mt-2 font-medium italic">* Tối đa 4MB. Các định dạng hỗ trợ: JPG, PNG, WEBP.</p>
                        {isUploading && <span className="text-xs text-primary font-bold mt-2 inline-flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Đang xử lý ảnh...</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                     <label className="text-sm font-bold mb-1.5 block">Trạng thái Tour</label>
                     <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                       <option value="active">Đang mở bán (Active)</option>
                       <option value="draft">Bản nháp (Draft)</option>
                       <option value="paused">Tạm dừng (Paused)</option>
                     </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Giới thiệu Tổng quan</label>
                    <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-[100px] rounded-xl shadow-sm resize-none" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                     <div>
                        <label className="text-sm font-bold mb-1.5 block">Dịch vụ Bao gồm</label>
                        <Textarea value={formData.includes} onChange={e => setFormData({...formData, includes: e.target.value})} className="h-32 text-sm rounded-xl bg-green-50/20 border-green-100/50" />
                     </div>
                     <div>
                        <label className="text-sm font-bold mb-1.5 block">Không Bao gồm</label>
                        <Textarea value={formData.excludes} onChange={e => setFormData({...formData, excludes: e.target.value})} className="h-32 text-sm rounded-xl bg-orange-50/20 border-orange-100/50" />
                     </div>
                  </div>
                </div>
              </div>

              {/* Cột 2: Lịch trình chi tiết */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                   <div className="flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-lg text-primary">Lịch trình Chi tiết</h3>
                   </div>
                   <Button type="button" variant="outline" size="sm" onClick={handleAddDay} className="gap-2 h-9 rounded-lg font-bold border-primary/30 text-primary hover:bg-primary/5">
                      Thêm Ngày Mới
                   </Button>
                </div>
                
                <div className="space-y-4 pr-1">
                   {formData.itinerary.map((day, index) => (
                      <div key={index} className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden group">
                         <div className="bg-muted/10 p-3 flex justify-between items-center border-b border-border/40">
                            <span className="text-xs font-black text-primary/60 uppercase tracking-widest">Ngày {day.day}</span>
                            <button onClick={() => handleRemoveDay(index)} className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/5 transition-all outline-none">
                               <X className="w-4 h-4" />
                            </button>
                         </div>
                         <div className="p-4 space-y-4">
                            <Input 
                               value={day.title} 
                               onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} 
                               placeholder="Tiêu đề ngày..." 
                               className="h-10 bg-background border-none shadow-none font-bold text-[15px] focus-visible:ring-0 px-0"
                            />
                            <Textarea 
                               value={day.content} 
                               onChange={(e) => handleItineraryChange(index, 'content', e.target.value)} 
                               placeholder="Nội dung hoạt động..." 
                               className="min-h-[120px] bg-muted/20 border-none rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary/20"
                            />
                         </div>
                      </div>
                   ))}
                   {formData.itinerary.length === 0 && (
                     <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border/40 rounded-3xl bg-muted/5">
                        <PlusCircle className="w-10 h-10 mx-auto mb-4 opacity-10" />
                        <p className="font-bold">Chưa có lịch trình.</p>
                        <p className="text-xs opacity-70">Bấm "Thêm Ngày Mới" để khai báo.</p>
                     </div>
                   )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sticky bottom-0 p-6 bg-card border-t flex flex-col sm:flex-row gap-3 sm:justify-end shrink-0">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)} className="rounded-xl px-6 h-11 font-semibold">Hủy bỏ</Button>
            <Button onClick={handleEditSubmit} className="rounded-xl px-10 h-11 font-bold shadow-lg shadow-primary/20">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Delete Tour */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa Tour này?</DialogTitle>
            <DialogDescription>Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa tour {currentTour?.name}?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={handleDeleteSubmit}>Chắc chắn Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
