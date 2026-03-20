import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star } from 'lucide-react';

interface TourCardProps {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  destination: string;
  duration: string;
  price: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
}

export default function TourCard({
  id,
  slug,
  title,
  imageUrl,
  destination,
  duration,
  price,
  rating,
  reviewsCount,
  isFeatured
}: TourCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full group transition-all hover:shadow-md border-border/50 bg-card">
      <Link href={`/tour/${slug}`} className="relative aspect-[4/3] overflow-hidden block">
        <img
          src={imageUrl || '/images/placeholder-tour.jpg'}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {isFeatured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold shadow-sm border-none">
            Nổi bật
          </Badge>
        )}
      </Link>
      
      <CardContent className="p-4 flex-grow flex flex-col gap-2 relative">
        <div className="flex items-center text-xs text-muted-foreground gap-3 mt-1">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">{destination}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{duration}</span>
          </div>
        </div>
        
        <Link href={`/tour/${slug}`} className="hover:text-primary transition-colors focus:outline-none focus:text-primary">
          <h3 className="font-semibold text-[1.1rem] line-clamp-2 mt-1 mb-2 leading-tight">
            {title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1.5 mt-auto">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-medium text-sm">{rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({reviewsCount} đánh giá)</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-1 flex justify-between items-end bg-card">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-0.5 font-medium">Giá từ</span>
          <span className="font-bold tracking-tight text-primary text-lg leading-none">
            {new Intl.NumberFormat('vi-VN').format(price)} <span className="text-sm">đ</span>
          </span>
        </div>
        <Link href={`/booking/${id}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 shadow-sm">
          Đặt Tour Ngay
        </Link>
      </CardFooter>
    </Card>
  );
}
