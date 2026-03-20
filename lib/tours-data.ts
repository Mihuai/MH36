// Dữ liệu Tours dùng chung - đồng bộ giữa listing, detail, và booking
export const TOURS_DATA = [
  {
    id: "1",
    slug: "kham-pha-da-nang-3-ngay-2-dem",
    title: "Khám phá Đà Nẵng - Hội An - Bà Nà Hills trọn gói",
    destination: "Đà Nẵng, Việt Nam",
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
    duration: "3 Ngày 2 Đêm",
    price: 3500000,
    rating: 4.8,
    reviewsCount: 124,
    isFeatured: true,
    description: "Hành trình 3 ngày 2 đêm đưa bạn đến với Đà Nẵng – thành phố đáng sống nhất Việt Nam. Chiêm ngưỡng Phố cổ Hội An, Bà Nà Hills - đường lên tiên cảnh, thưởng thức đặc sản miền Trung.",
  },
  {
    id: "2",
    slug: "nghi-duong-phu-quoc",
    title: "Nghỉ dưỡng Phú Quốc - Khám phá Nam Đảo & VinWonders",
    destination: "Phú Quốc, Kiên Giang",
    imageUrl: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=80",
    duration: "4 Ngày 3 Đêm",
    price: 5200000,
    rating: 4.9,
    reviewsCount: 89,
    isFeatured: true,
    description: "Trải nghiệm kỳ nghỉ tuyệt vời tại Đảo Ngọc Phú Quốc. Tham quan Grand World, lặn ngắm san hô tại Nam Đảo và thưởng thức hải sản tươi ngon.",
  },
  {
    id: "3",
    slug: "sapa-fansipan",
    title: "Sapa mùa lúa chín - Chinh phục đỉnh Fansipan",
    destination: "Sapa, Lào Cai",
    imageUrl: "https://images.unsplash.com/photo-1629813350117-9095646199a6?w=800&q=80",
    duration: "2 Ngày 1 Đêm",
    price: 2100000,
    rating: 4.7,
    reviewsCount: 256,
    isFeatured: false,
    description: "Chinh phục nóc nhà Đông Dương - đỉnh Fansipan 3143m, ngắm ruộng bậc thang vàng óng, khám phá văn hóa dân tộc.",
  },
  {
    id: "4",
    slug: "nha-trang-bien-xanh",
    title: "Nha Trang - Lặn ngắm san hô & Tắm bùn khoáng",
    destination: "Nha Trang, Khánh Hòa",
    imageUrl: "https://images.unsplash.com/photo-1582294109151-e1293fbffb45?w=800&q=80",
    duration: "3 Ngày 2 Đêm",
    price: 3100000,
    rating: 4.6,
    reviewsCount: 112,
    isFeatured: false,
    description: "Khám phá thiên đường biển Nha Trang, lặn ngắm san hô đẹp nhất Việt Nam, tắm bùn khoáng thư giãn tại I-Resort.",
  },
  {
    id: "5",
    slug: "da-lat-thanh-pho-ngan-hoa",
    title: "Đà Lạt - Bức họa đồng quê chốn núi rừng",
    destination: "Đà Lạt, Lâm Đồng",
    imageUrl: "https://images.unsplash.com/photo-1587825223366-224424e6b185?w=800&q=80",
    duration: "3 Ngày 2 Đêm",
    price: 2800000,
    rating: 4.7,
    reviewsCount: 198,
    isFeatured: false,
    description: "Thành phố ngàn hoa - Đà Lạt với khí hậu mát mẻ quanh năm, vườn hoa rực rỡ, cà phê sáng sương mù lãng mạn.",
  },
  {
    id: "6",
    slug: "ha-long-bay-cruise",
    title: "Du thuyền Vịnh Hạ Long 5 sao - Hành trình di sản",
    destination: "Hạ Long, Quảng Ninh",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-53982823b814?w=800&q=80",
    duration: "2 Ngày 1 Đêm",
    price: 4500000,
    rating: 4.9,
    reviewsCount: 320,
    isFeatured: true,
    description: "Hành trình trải nghiệm Vịnh Hạ Long trên du thuyền 5 sao, chèo kayak qua hang động, ngắm hoàng hôn trên biển.",
  }
];

export function getTourById(id: string) {
  return TOURS_DATA.find(t => t.id === id) || null;
}

export function getTourBySlug(slug: string) {
  return TOURS_DATA.find(t => t.slug === slug) || null;
}
