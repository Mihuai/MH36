"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type PaymentConfig = {
  vnpay: {
    enabled: boolean;
    environment: 'sandbox' | 'production';
    url: string;
    tmnCode: string;
    hashSecret: string;
  };
  momo: {
    enabled: boolean;
    environment: 'sandbox' | 'production';
    partnerCode: string;
    accessKey: string;
    secretKey: string;
  };
  bankTransfer: {
    enabled: boolean;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
};

const defaultPaymentConfig: PaymentConfig = {
  vnpay: {
    enabled: true,
    environment: 'sandbox',
    url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    tmnCode: 'JKS1E794',
    hashSecret: 'L40Z1HLNJKK7B9YON6S71V19YHQRJU95'
  },
  momo: {
    enabled: true,
    environment: 'sandbox',
    partnerCode: 'MOMOQWEX20220919',
    accessKey: '2nfksdhfsdiuow34',
    secretKey: 'jfksdnvuih4q839hrnksnfi381ndms'
  },
  bankTransfer: {
    enabled: true,
    bankName: 'TCB',
    accountNumber: '5999999922',
    accountName: 'CONG TY TNHH MH36 TRAVEL'
  }
};

type PaymentContextType = {
  paymentConfig: PaymentConfig;
  updatePaymentConfig: (newConfig: PaymentConfig) => void;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(defaultPaymentConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const STORAGE_KEY = 'mh36_payment_config_v2'; // version bump để reset config cũ
    // Xoá config cũ nếu tồn tại
    localStorage.removeItem('mh36_payment_config');
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPaymentConfig({
          vnpay: { ...defaultPaymentConfig.vnpay, ...(parsed.vnpay || {}) },
          momo: { ...defaultPaymentConfig.momo, ...(parsed.momo || {}) },
          bankTransfer: { ...defaultPaymentConfig.bankTransfer, ...(parsed.bankTransfer || {}) }
        });
      } catch (e) {
        console.error("Failed to parse payment config");
      }
    }
    setIsLoaded(true);
  }, []);

  const updatePaymentConfig = (newConfig: PaymentConfig) => {
    setPaymentConfig(newConfig);
    localStorage.setItem('mh36_payment_config_v2', JSON.stringify(newConfig));
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <PaymentContext.Provider value={{ paymentConfig, updatePaymentConfig }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
