import { Search, SlidersHorizontal, MapPin, Calendar, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import TourCard from '@/components/tour/TourCard';

const TOURS = [
  {
    id: "1", slug: "kham-pha-da-nang-3-ngay-2-dem", title: "Khám phá Đà Nẵng - Hội An - Bà Nà Hills trọn gói",
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80", destination: "Đà Nẵng",
    duration: "3 Ngày 2 Đêm", price: 3500000, rating: 4.8, reviewsCount: 124, isFeatured: true
  },
  {
    id: "2", slug: "nghi-duong-phu-quoc", title: "Nghỉ dưỡng Phú Quốc - Khám phá Nam Đảo & VinWonders",
    imageUrl: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=80", destination: "Phú Quốc",
    duration: "4 Ngày 3 Đêm", price: 5200000, rating: 4.9, reviewsCount: 89, isFeatured: true
  },
  {
    id: "3", slug: "sapa-fansipan", title: "Sapa mùa lúa chín - Chinh phục đỉnh Fansipan",
    imageUrl: "https://images.unsplash.com/photo-1629813350117-9095646199a6?w=800&q=80", destination: "Sapa",
    duration: "2 Ngày 1 Đêm", price: 2100000, rating: 4.7, reviewsCount: 256
  },
  {
    id: "4", slug: "nha-trang-bien-xanh", title: "Nha Trang - Lặn ngắm san hô & Tắm bùn khoáng",
    imageUrl: "https://images.unsplash.com/photo-1582294109151-e1293fbffb45?w=800&q=80", destination: "Nha Trang",
    duration: "3 Ngày 2 Đêm", price: 3100000, rating: 4.6, reviewsCount: 112
  },
  {
    id: "5", slug: "da-lat-thanh-pho-ngan-hoa", title: "Đà Lạt - Bức họa đồng quê chốn núi rừng",
    imageUrl: "https://images.unsplash.com/photo-1587825223366-224424e6b185?w=800&q=80", destination: "Đà Lạt",
    duration: "3 Ngày 2 Đêm", price: 2800000, rating: 4.7, reviewsCount: 198
  },
  {
    id: "6", slug: "ha-long-bay-cruise", title: "Du thuyền Vịnh Hạ Long 5 sao - Hành trình di sản",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-53982823b814?w=800&q=80", destination: "Hạ Long",
    duration: "2 Ngày 1 Đêm", price: 4500000, rating: 4.9, reviewsCount: 320
  }
];

export default async function SearchTourPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const destination = typeof resolvedParams.destination === 'string' ? resolvedParams.destination.toLowerCase() : '';
  const priceFilter = typeof resolvedParams.price === 'string' ? resolvedParams.price : '';
  const timeFilter = typeof resolvedParams.time === 'string' ? resolvedParams.time : '';
  const currentPage = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  const sortOption = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : '';
  const ITEMS_PER_PAGE = 3;
  
  let filteredTours = TOURS.filter(tour => {
    // 1. Lọc theo Destination hoặc Title
    if (destination && !tour.title.toLowerCase().includes(destination) && !tour.destination.toLowerCase().includes(destination)) {
      return false;
    }
    
    // 2. Lọc theo Giá
    if (priceFilter) {
      if (priceFilter === 'under-2m' && tour.price >= 2000000) return false;
      if (priceFilter === '2m-5m' && (tour.price < 2000000 || tour.price > 5000000)) return false;
      if (priceFilter === 'over-5m' && tour.price <= 5000000) return false;
    }

    // 3. Lọc theo Thời gian (Duration string matching)
    if (timeFilter) {
      if (timeFilter === '1-3' && !tour.duration.includes("1 Đêm") && !tour.duration.includes("2 Đêm") && !tour.duration.includes("1 Ngày")) return false;
      if (timeFilter === '4-7' && !tour.duration.includes("3 Đêm") && !tour.duration.includes("4 Đêm") && !tour.duration.includes("5 Đêm") && !tour.duration.includes("6 Đêm")) return false;
    }

    return true;
  });

  // 4. Sắp xếp kết quả
  if (sortOption === 'price-asc') {
    filteredTours.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filteredTours.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'rating') {
    filteredTours.sort((a, b) => b.rating - a.rating);
  }

  const totalPages = Math.ceil(filteredTours.length / ITEMS_PER_PAGE);
  const paginatedTours = filteredTours.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-muted/10 min-h-screen">
      {/* Breadcrumb / Page Header */}
      <div className="bg-primary/5 border-b border-primary/10 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Tìm Kiếm Tour Du Lịch</h1>
          <p className="text-muted-foreground">Khám phá hơn 10,000 hành trình tuyệt vời trên khắp thế giới.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filter */}
          <aside className="w-full lg:w-1/4 shrink-0">
            <form method="GET" action="/tour" className="bg-card border border-border/50 rounded-xl p-5 sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg">Bộ Lọc Tour</h2>
              </div>
              <Separator className="mb-6" />

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-3 block text-foreground tracking-wide">TÌM KIẾM</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input key={destination || 'empty'} name="destination" defaultValue={destination} placeholder="Tên tour hoặc địa điểm..." className="pl-9 h-10 w-full" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-3 block text-foreground tracking-wide">MỨC GIÁ</label>
                  <div className="space-y-2">
                    {[
                      { value: '', label: 'Tất cả mức giá' },
                      { value: 'under-2m', label: 'Dưới 2 triệu' },
                      { value: '2m-5m', label: 'Từ 2 - 5 triệu' },
                      { value: 'over-5m', label: 'Trên 5 triệu' }
                    ].map((price) => (
                      <div key={price.value} className="flex items-center space-x-2">
                        <input type="radio" name="price" value={price.value} id={`price-${price.value}`} defaultChecked={priceFilter === price.value} className="rounded-full border-input text-primary focus:ring-primary h-4 w-4" />
                        <label htmlFor={`price-${price.value}`} className="text-sm cursor-pointer">{price.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-3 block text-foreground tracking-wide">THỜI GIAN</label>
                  <div className="space-y-2">
                    {[
                      { value: '', label: 'Tất cả thời gian' },
                      { value: '1-3', label: 'Ngắn ngày (1 - 3 ngày)' },
                      { value: '4-7', label: 'Dài ngày (4 - 7 ngày)' }
                    ].map((time) => (
                      <div key={time.value} className="flex items-center space-x-2">
                        <input type="radio" name="time" value={time.value} id={`time-${time.value}`} defaultChecked={timeFilter === time.value} className="rounded-full border-input text-primary focus:ring-primary h-4 w-4" />
                        <label htmlFor={`time-${time.value}`} className="text-sm cursor-pointer">{time.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preserve sorting if existed */}
                {sortOption && <input type="hidden" name="sort" value={sortOption} />}
                
                <Button type="submit" className="w-full mt-4 h-10 font-medium">Áp Dụng Bộ Lọc</Button>
              </div>
            </form>
          </aside>

          {/* Tour List */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-muted-foreground">
                Hiển thị <span className="font-semibold text-foreground">{filteredTours.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredTours.length)}</span> trong số <span className="font-semibold text-foreground">{filteredTours.length}</span> kết quả
                {destination && <span> cho tìm kiếm "{typeof resolvedParams.destination === 'string' ? resolvedParams.destination : ''}"</span>}
              </p>
              
              <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Sắp xếp theo:</span>
                <form method="GET" action="/tour" className="flex flex-row items-center flex-1 w-full sm:w-auto">
                  {/* Preserve existing filters when sorting changes */}
                  <input type="hidden" name="destination" value={destination} />
                  <input type="hidden" name="price" value={priceFilter} />
                  <input type="hidden" name="time" value={timeFilter} />
                  <select 
                    name="sort" 
                    defaultValue={sortOption}
                    className="flex h-9 w-full sm:w-48 rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                  <Button type="submit" size="sm" variant="secondary" className="h-9 ml-2">Xếp</Button>
                </form>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedTours.length > 0 ? (
                paginatedTours.map((tour) => (
                  <TourCard key={tour.id} {...tour} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  Không tìm thấy tour nào phù hợp với tìm kiếm của bạn. Hãy thử thay đổi từ khóa!
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center text-sm font-medium">
                <nav className="flex items-center gap-1">
                  <a 
                    href={currentPage > 1 ? `/tour?${new URLSearchParams({...resolvedParams as Record<string, string>, page: String(currentPage - 1)}).toString()}` : '#'} 
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground w-9 h-9 p-0 ${currentPage <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                  >«</a>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <a 
                      key={i} 
                      href={`/tour?${new URLSearchParams({...resolvedParams as Record<string, string>, page: String(i + 1)}).toString()}`}
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border w-9 h-9 p-0 ${currentPage === i + 1 ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground hover:bg-accent'}`}
                    >{i + 1}</a>
                  ))}
                  
                  <a 
                    href={currentPage < totalPages ? `/tour?${new URLSearchParams({...resolvedParams as Record<string, string>, page: String(currentPage + 1)}).toString()}` : '#'} 
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground w-9 h-9 p-0 ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                  >»</a>
                </nav>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
