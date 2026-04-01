import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MH36 TRAVEL - Nền tảng Đặt tour du lịch',
    short_name: 'MH36 TRAVEL',
    description: 'Hàng ngàn tour du lịch hấp dẫn trong nước và quốc tế đang chờ đón bạn. Trải nghiệm dịch vụ đẳng cấp với ứng dụng MH36.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
