export interface BusinessConfig {
  brandName: string;
  brandSubline: string;
  brandSubtitleRu: string;
  brandSubtitleKz: string;
  logoOriginal: string;
  logoTransparent: string;
  logoMark: string;
  instagramUrl: string;
  instagramHandle: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  whatsappRequiresConfirmation: boolean;
  departureCity: {
    ru: string;
    kz: string;
  };
  // Aliases for convenience
  companyName: string;
  phoneWhatsAppRaw: string;
  phoneWhatsAppDisplay: string;
  city: string;
}

export const businessConfig: BusinessConfig = {
  brandName: "ALL TOUR",
  brandSubline: "CONTENT TOUR",
  brandSubtitleRu: "Туры и контент-путешествия из Алматы",
  brandSubtitleKz: "Алматыдан турлар мен контент-саяхаттар",
  logoOriginal: "/assets/brand/photo_16.jpg",
  logoTransparent: "/assets/brand/logo-transparent.png",
  logoMark: "/assets/brand/logo-mark.png",
  instagramUrl: "https://www.instagram.com/all_tour.kz/",
  instagramHandle: "@all_tour.kz",
  whatsappNumber: "77711434268",
  whatsappDisplay: "+7 771 143 42 68",
  whatsappRequiresConfirmation: true,
  departureCity: {
    ru: "Алматы",
    kz: "Алматы",
  },
  companyName: "ALL TOUR",
  phoneWhatsAppRaw: "77711434268",
  phoneWhatsAppDisplay: "+7 771 143 42 68",
  city: "Алматы",
};

export const BUSINESS_CONFIG = businessConfig;
