"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Settings = {
  companyName: string;
  description: string;
  address: string;
  hotline: string;
  email: string;
  social: {
    facebook: string;
    zalo: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    twitter: string;
  };
  newsletter: {
    title: string;
    description: string;
    gmailAccount?: string;
    appPassword?: string;
  };
  images: {
    logoUrl: string;
    heroImageUrl: string;
  };
  reminders: {
    zaloOaToken: string;
    zaloTemplateId: string;
    smsApiKey: string;
    smsBrandname: string;
  };
};

const defaultSettings: Settings = {
  companyName: "MH36 TRAVEL - Dịch vụ du lịch chuyên nghiệp",
  description: "Nền tảng đặt tour du lịch uy tín, giá rẻ và chuyên nghiệp hàng đầu Việt Nam. Khám phá các điểm đến hấp dẫn cùng MH36 Travel.",
  address: "Số 123 Đường Xuân Thủy, Cầu Giấy, Hà Nội",
  hotline: "1900 1000 000",
  email: "cskh@mh36travel.com",
  social: {
    facebook: "https://facebook.com/mh36travel",
    zalo: "https://zalo.me/mh36travel",
    instagram: "https://instagram.com/mh36travel",
    tiktok: "https://tiktok.com/@mh36travel",
    youtube: "https://youtube.com/@mh36travel",
    twitter: "https://twitter.com/mh36travel"
  },
  newsletter: {
    title: "Đăng ký nhận ưu đãi",
    description: "Nhận ngay các thông tin khuyến mãi và tour mới nhất từ chúng tôi.",
    gmailAccount: "",
    appPassword: ""
  },
  images: {
    logoUrl: "",
    heroImageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80"
  },
  reminders: {
    zaloOaToken: "",
    zaloTemplateId: "",
    smsApiKey: "",
    smsBrandname: ""
  }
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateSocial: (platform: keyof Settings['social'], url: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mh36_general_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings config");
      }
    }
    setIsLoaded(true);
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('mh36_general_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const updateSocial = (platform: keyof Settings['social'], url: string) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        social: { ...prev.social, [platform]: url }
      };
      localStorage.setItem('mh36_general_settings', JSON.stringify(updated));
      return updated;
    });
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateSocial }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
