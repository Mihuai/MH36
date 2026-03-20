"use client";

import { useState } from 'react';
import { Map, Calendar, MapPin, CheckCircle2, X, Printer, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const tours = [
  {
    id: "#B_19283",
    title: "Nghỉ dưỡng Phú Quốc - Khám phá Nam Đảo & VinWonders",
    image: "https://images.unsplash.com/photo-1533619043865-1c2e2f32ff2f?auto=format&fit=crop&w=400&q=80",
    departure: "TP.HCM",
    departureDate: "15/05/2026",
    passengers: "2 Người lớn, 1 Trẻ em",
    amount: "12.500.000 ₫",
    rawAmount: 12500000,
    status: "confirmed",
    statusLabel: "Đã xác nhận",
    duration: "5 Ngày 4 Đêm",
    paymentMethod: "VNPAY",
    note: "Phòng view biển tầng cao"
  },
  {
    id: "#B_19271",
    title: "Khám phá Đà Nẵng - Hội An - Bà Nà Hills",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
    departure: "Hà Nội",
    departureDate: "10/12/2025",
    passengers: "2 Người lớn",
    amount: "7.000.000 ₫",
    rawAmount: 7000000,
    status: "completed",
    statusLabel: "Đã kết thúc",
    duration: "3 Ngày 2 Đêm",
    paymentMethod: "Chuyển khoản QR",
    note: ""
  }
];

export default function BookedToursPage() {
  const [selectedTour, setSelectedTour] = useState<typeof tours[0] | null>(null);

  const handlePrintInvoice = (tour: typeof tours[0]) => {
    const printContent = `
      <html><head><title>Hoá đơn ${tour.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: auto; }
        h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .total { font-size: 1.3em; font-weight: bold; color: #7c3aed; }
        .footer { margin-top: 40px; text-align: center; color: #888; font-size: 12px; }
      </style></head>
      <body>
        <h1>🌏 MH36 TRAVEL — HOÁ ĐƠN ĐẶT TOUR</h1>
        <div class="row"><span>Mã giao dịch</span><strong>${tour.id}</strong></div>
        <div class="row"><span>Tour</span><strong>${tour.title}</strong></div>
        <div class="row"><span>Điểm khởi hành</span><span>${tour.departure}</span></div>
        <div class="row"><span>Ngày khởi hành</span><span>${tour.departureDate}</span></div>
        <div class="row"><span>Thời gian</span><span>${tour.duration}</span></div>
        <div class="row"><span>Hành khách</span><span>${tour.passengers}</span></div>
        <div class="row"><span>Phương thức TT</span><span>${tour.paymentMethod}</span></div>
        <div class="row"><span>Trạng thái</span><span>${tour.statusLabel}</span></div>
        <div class="row total"><span>Tổng tiền</span><span>${tour.amount}</span></div>
        <div class="footer">Cảm ơn quý khách đã tin tưởng MH36 TRAVEL • Hotline: 1900 xxxx</div>
      </body></html>
    `;
    const w = window.open('', '_blank');
    if (w) { w.document.write(printContent); w.document.close(); w.print(); }
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">Tour đã đặt</h2>
      
      <div className="space-y-6">
        {tours.map((tour) => (
          <div key={tour.id} className="border border-border/50 rounded-xl p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
            <div className="w-full md:w-48 h-40 md:h-36 bg-muted rounded-lg overflow-hidden shrink-0 relative">
              <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2 gap-4">
                <h3 className="font-bold text-lg line-clamp-2">{tour.title}</h3>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${
                  tour.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> {tour.statusLabel}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> Điểm đi: {tour.departure}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> Khởi hành: {tour.departureDate}</span>
                <span className="flex items-center gap-1.5"><Map className="w-4 h-4 text-primary" /> Hành khách: {tour.passengers}</span>
              </div>
              
              <div className="mt-auto flex items-center justify-between border-t pt-4">
                <div>
                  <span className="block text-xs text-muted-foreground mb-0.5">Tổng tiền thanh toán</span>
                  <span className={`font-bold text-lg ${tour.status === 'confirmed' ? 'text-primary' : 'text-muted-foreground'}`}>{tour.amount}</span>
                </div>
                <div className="flex gap-2">
                  {tour.status === 'completed' ? (
                    <Link href="/dashboard/reviews">
                      <Button variant="outline" size="sm" className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 shadow-sm">Đánh giá hành trình</Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" className="hidden sm:flex border-border/80 shadow-sm gap-1.5" onClick={() => handlePrintInvoice(tour)}>
                      <Printer className="w-3.5 h-3.5" /> Tải hoá đơn
                    </Button>
                  )}
                  <Button size="sm" className="shadow-sm gap-1.5" onClick={() => setSelectedTour(tour)}>
                    <FileText className="w-3.5 h-3.5" /> Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Chi tiết Tour */}
      <Dialog open={!!selectedTour} onOpenChange={() => setSelectedTour(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold pr-8 line-clamp-2">{selectedTour?.title}</DialogTitle>
          </DialogHeader>
          {selectedTour && (
            <div className="space-y-3 text-sm pt-2">
              <img src={selectedTour.image} alt={selectedTour.title} className="w-full h-44 object-cover rounded-xl mb-4" />
              {[
                ["Mã Booking", selectedTour.id],
                ["Trạng thái", selectedTour.statusLabel],
                ["Điểm khởi hành", selectedTour.departure],
                ["Ngày khởi hành", selectedTour.departureDate],
                ["Thời gian", selectedTour.duration],
                ["Hành khách", selectedTour.passengers],
                ["Phương thức TT", selectedTour.paymentMethod],
                ...(selectedTour.note ? [["Ghi chú", selectedTour.note]] : [])
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <strong className="text-right max-w-[60%]">{value}</strong>
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground">Tổng tiền</span>
                <strong className="text-primary text-base">{selectedTour.amount}</strong>
              </div>
              <Button onClick={() => handlePrintInvoice(selectedTour)} variant="outline" className="w-full mt-2 gap-2">
                <Printer className="w-4 h-4" /> In / Tải hoá đơn
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
