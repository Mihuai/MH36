import { Star, MessageSquare, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReviewsPage() {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">Đánh giá của tôi</h2>
      
      <div className="space-y-6">
        
        {/* Review Item */}
        <div className="border border-border/50 rounded-xl p-6 bg-muted/5">
           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-border/50 pb-4 mb-4 gap-4">
              <div>
                 <h3 className="font-bold text-lg mb-1.5">Khám phá Đà Nẵng - Hội An - Bà Nà Hills</h3>
                 <span className="text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-md">Khởi hành: 10/12/2025</span>
              </div>
              <div className="flex text-amber-400 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shrink-0">
                 <Star className="w-4 h-4 fill-current mx-0.5" />
                 <Star className="w-4 h-4 fill-current mx-0.5" />
                 <Star className="w-4 h-4 fill-current mx-0.5" />
                 <Star className="w-4 h-4 fill-current mx-0.5" />
                 <Star className="w-4 h-4 fill-current mx-0.5" />
              </div>
           </div>
           
           <div className="relative pl-6 py-2">
              <MessageSquare className="absolute top-2 left-0 w-6 h-6 text-primary/30 -translate-x-1" />
              <p className="text-foreground leading-relaxed italic">
                 "Tour đi rất vui, hướng dẫn viên nhiệt tình, hỗ trợ chu đáo gia đình có con nhỏ như mình. Khách sạn ở Đà Nẵng sạch sẽ view đẹp và đồ ăn ngon. Đặc biệt thích Bà Nà dù hôm đi thời tiết hơi sương mù. Rất đáng tiền để trải nghiệm cùng MH36, hẹn gặp lại ở tour tiếp theo!"
              </p>
           </div>
           
           <div className="mt-5 pt-4 border-t border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-muted-foreground gap-3">
              <span className="font-medium">Đăng lúc 15:30 • Ngày 16/12/2025</span>
              <Button variant="ghost" size="sm" className="h-8 group">
                <Edit3 className="w-3.5 h-3.5 mr-1.5 group-hover:text-primary transition-colors" /> Chỉnh sửa đánh giá
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
}
