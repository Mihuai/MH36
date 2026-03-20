"use client";

import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Filter, Package, Eye, Edit, Trash2, PlusCircle, X } from 'lucide-react';
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

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, imageUrl: result.url }));
      } else {
        alert("Lỗi upload: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi upload ảnh.");
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Thêm Tour mới</DialogTitle>
            <DialogDescription>Điền thông tin chi tiết đầy đủ cho Tour du lịch mới.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
            {/* Cột 1: Thông tin cơ bản */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2 text-primary">Thông tin Cơ bản</h3>
              <div>
                <label className="text-sm font-semibold mb-2 block">Tên Tour</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Vd: Tour Đà Nẵng..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Mã Tour</label>
                  <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="Vd: DN2026" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Mức giá</label>
                  <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Hình ảnh Tour (Upload)</label>
                <div className="flex gap-4 items-center">
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-xl border shrink-0" />
                  )}
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="cursor-pointer file:text-primary file:font-semibold" />
                    {isUploading && <span className="text-xs text-primary font-medium mt-1 inline-block">Đang tải ảnh lên...</span>}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Giới thiệu Tổng quan</label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="h-24" placeholder="Viết mô tả hấp dẫn về tour..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-sm font-semibold mb-2 block">Dịch vụ Bao gồm</label>
                    <Textarea value={formData.includes} onChange={e => setFormData({...formData, includes: e.target.value})} className="h-24 text-sm" placeholder="- Vé máy bay&#10;- Khách sạn 4 sao..." />
                 </div>
                 <div>
                    <label className="text-sm font-semibold mb-2 block">Không Bao gồm</label>
                    <Textarea value={formData.excludes} onChange={e => setFormData({...formData, excludes: e.target.value})} className="h-24 text-sm" placeholder="- Tiền tip HDV&#10;- Thuế VAT..." />
                 </div>
              </div>
            </div>

            {/* Cột 2: Lịch trình chi tiết */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                 <h3 className="font-semibold text-lg text-primary">Lịch trình Chi tiết</h3>
                 <Button type="button" variant="outline" size="sm" onClick={handleAddDay} className="gap-2 h-8">
                    <PlusCircle className="w-4 h-4" /> Thêm Ngày Mới
                 </Button>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                 {formData.itinerary.map((day, index) => (
                    <div key={index} className="bg-muted/30 border border-border/50 rounded-xl p-4 relative group">
                       <button onClick={() => handleRemoveDay(index)} className="absolute top-3 right-3 text-muted-foreground hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
                       <h4 className="font-bold text-sm mb-3 text-primary">Ngày {day.day}</h4>
                       <div className="space-y-3">
                          <Input 
                             value={day.title} 
                             onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} 
                             placeholder="Tiêu đề (Vd: Hà Nội - Sapa - Bản Cát Cát...)" 
                             className="h-9 bg-background"
                          />
                          <Textarea 
                             value={day.content} 
                             onChange={(e) => handleItineraryChange(index, 'content', e.target.value)} 
                             placeholder="Sáng: HDV đón khách tại Sân bay...&#10;Trưa: ...&#10;Tối: ..." 
                             className="h-28 bg-background text-sm"
                          />
                       </div>
                    </div>
                 ))}
                 {formData.itinerary.length === 0 && (
                   <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">Chưa có lịch trình. Bấm "Thêm Ngày Mới" để bắt đầu.</div>
                 )}
              </div>
            </div>
          </div>
          <DialogFooter className="bg-muted/20 p-4 -mx-6 -mb-6 mt-2 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy bỏ</Button>
            <Button onClick={handleAddSubmit} className="font-bold px-8">Tạo Tour Ngay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Tour */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Cập nhật Tour Du lịch</DialogTitle>
            <DialogDescription>Sửa đổi thông tin, hình ảnh hoặc lộ trình cho {currentTour?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
            {/* Cột 1: Thông tin cơ bản */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2 text-primary">Thông tin Cơ bản</h3>
              <div>
                <label className="text-sm font-semibold mb-2 block">Tên Tour</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Mã Tour</label>
                  <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Mức giá</label>
                  <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Đổi Hình ảnh (Upload)</label>
                <div className="flex gap-4 items-center">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-xl border shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border bg-muted flex items-center justify-center shrink-0">
                       <span className="text-xs text-muted-foreground">None</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="cursor-pointer file:text-primary file:font-semibold" />
                    {isUploading && <span className="text-xs text-primary font-medium mt-1 inline-block">Đang tải ảnh lên...</span>}
                  </div>
                </div>
              </div>

              <div>
                 <label className="text-sm font-semibold mb-2 block">Trạng thái Tour</label>
                 <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                   <option value="active">Đang mở bán (Active)</option>
                   <option value="draft">Bản nháp (Draft)</option>
                   <option value="paused">Tạm dừng (Paused)</option>
                 </select>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Giới thiệu Tổng quan</label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="h-24" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-sm font-semibold mb-2 block">Dịch vụ Bao gồm</label>
                    <Textarea value={formData.includes} onChange={e => setFormData({...formData, includes: e.target.value})} className="h-24 text-sm" />
                 </div>
                 <div>
                    <label className="text-sm font-semibold mb-2 block">Không Bao gồm</label>
                    <Textarea value={formData.excludes} onChange={e => setFormData({...formData, excludes: e.target.value})} className="h-24 text-sm" />
                 </div>
              </div>
            </div>

            {/* Cột 2: Lịch trình chi tiết */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                 <h3 className="font-semibold text-lg text-primary">Lịch trình Chi tiết</h3>
                 <Button type="button" variant="outline" size="sm" onClick={handleAddDay} className="gap-2 h-8 border-primary text-primary hover:bg-primary/10">
                    <PlusCircle className="w-4 h-4" /> Thêm Ngày Mới
                 </Button>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                 {formData.itinerary.map((day, index) => (
                    <div key={index} className="bg-muted/30 border border-border/50 rounded-xl p-4 relative group">
                       <button onClick={() => handleRemoveDay(index)} className="absolute top-3 right-3 text-muted-foreground hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
                       <h4 className="font-bold text-sm mb-3 text-primary">Ngày {day.day}</h4>
                       <div className="space-y-3">
                          <Input 
                             value={day.title} 
                             onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} 
                             placeholder="Tiêu đề ngày..." 
                             className="h-9 bg-background"
                          />
                          <Textarea 
                             value={day.content} 
                             onChange={(e) => handleItineraryChange(index, 'content', e.target.value)} 
                             placeholder="Nội dung hoạt động..." 
                             className="h-28 bg-background text-sm"
                          />
                       </div>
                    </div>
                 ))}
                 {formData.itinerary.length === 0 && (
                   <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">Chưa có lịch trình. Bấm "Thêm Ngày Mới" để khai báo.</div>
                 )}
              </div>
            </div>
          </div>
          <DialogFooter className="bg-muted/20 p-4 -mx-6 -mb-6 mt-2 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy bỏ</Button>
            <Button onClick={handleEditSubmit} className="font-bold px-8">Lưu thay đổi</Button>
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
