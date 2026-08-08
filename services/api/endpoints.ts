export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/register/verify-otp',
    VERIFY_EMAIL: '/auth/verify-email',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/me',
    UPDATE_FCM_TOKEN: '/auth/fcm-token',
  },

  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/update',
  },

  // Added Profile Endpoints
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile/update',
    OTP_SEND: '/auth/send-update-otp',
    OTP_VERIFY: '/auth/verify-update-contact',
    PASSWORD: {
      SEND_OTP: '/profile/password/send-otp',
      VERIFY_OTP: '/profile/password/verify-otp',
      UPDATE: '/profile/password/update',
    },
  },

  // Notification Bell Icon / Quick Actions
  NOTIFICATIONS: {
    UNSEEN: '/notifications',
    MARK_READ: (id: number | string) => `/notifications/${id}`,
  },

  // Full Notification Management (user/notifications prefix)
  USER_NOTIFICATIONS: {
    LIST: '/notifications/all-list',
    READ: (id: string | number) => `/notifications/${id}`,
    READ_ALL: '/notifications/mark-all-read',
    DELETE: (id: string | number) => `/notifications/${id}`,
    UNREAD_COUNT: '/notifications/unread-count',
  },

  MARKET: {
    STOCKS: '/market/stocks',
  },

  OPTION_CHAIN: {
    DATA: '/option-chain/data',
    EXPIRIES: '/angel/expiries',
    QUOTE: '/angel/quote',
  },

  SERVICE_PLANS: {
    LIST: '/services',
    DETAILS: (id: number | string) => `/services/${id}`,
  },

  CUSTOMER_PROFILE: {
    GET_PROFILE: '/profile',
  },

  TIPS: {
    LIST: '/tips',
    DETAILS: (id: string | number) => `/tips/${id}`,
    CATEGORIES: '/tips/categories',
  },

  NEWS: {
    LIST: '/news',
    CREATE: '/news',
    DETAILS: (id: number | string) => `/news/${id}`,
    CATEGORIES: {
      LIST: '/news/categories',
      CREATE: '/news/categories',
      DETAILS: (id: number | string) => `/news/categories/${id}`,
    },
  },

  BLOGS: {
    LIST: '/blogs',
    CREATE: '/blogs',
    DETAILS: (id: number | string) => `/blogs/${id}`,
  },

  // Announcements
  ANNOUNCEMENTS: {
    LIST: '/announcements',
    ACTIVE: '/announcements',
    DETAILS: (id: number | string) => `/announcements/${id}`,
  },

  //  Policies API
  POLICIES: {
    LIST: '/policies/masters',
    SLUG_POLICY: '/policies/content/:slug',
  },

  // Acceptance Endpoints
  ACCEPTANCE: {
    BASE: '/acceptance',
    ACCEPT: '/policy/accept',
  },
  // KYC Endpoints (auth:sanctum)
  KYC: {
    START: '/kyc/initiate',
    STATUS: '/kyc/status',
    FULL_DETAILS: '/kyc/full-details',
  },

  // Mobile Subscription & Razorpay (auth:sanctum)
  SUBSCRIPTION: {
    BASE: '/mobile/subscription',
    PLANS: '/mobile/subscription/plans',
    COUPONS: '/mobile/subscription/coupons',
    APPLY_COUPON: '/mobile/subscription/apply-coupon',
    RAZORPAY: {
      INITIATE: '/mobile/subscription/razorpay/initiate',
      VERIFY: '/mobile/subscription/razorpay/verify',
    },
    CURRENT: '/mobile/subscription/current',
    INVOICES: {
      LIST: '/mobile/subscription/invoices',
      DOWNLOAD: (id: number | string) => `/mobile/subscription/invoice/${id}/download`,
    },
  },

  AGREEMENT: {
    DRAFT: '/user/agreements/draft',
    FIND_DRAFT: (planId: number | string, durationId: number | string) => `/user/agreements/draft/${planId}/${durationId}`,
    STATUS: (id: number | string) => `/user/agreements/status/${id}`,
    MANUAL_PAYMENT: '/user/agreements/manual-payment',
    CREATE_RAZORPAY_ORDER: '/user/agreements/create-razorpay-order',
    VERIFY_RAZORPAY_PAYMENT: '/user/agreements/verify-razorpay-payment',
    INCREMENT_TRY: (id: number | string) => `/user/agreements/increment-try/${id}`,
    ACCOUNT_SERVICES: '/user/agreements/account-services',
    RESUME_DRAFT: (id: number | string) => `/user/agreements/resume-draft/${id}`,
    COMPLETE_USER_AGREEMENT_ESIGN: (id: number | string) => `/user/agreements/complete-esign/${id}`,
    CHECK_USER_ESIGN_STATUS: (id: number | string) => `/user/agreements/check-esign-status/${id}`,
  },

  COUPONS: {
    ACTIVE: '/coupons/active',
  },

  // Tickets
  TICKETS: {
    LIST: '/tickets/my-tickets',
    STORE: '/tickets',
    DETAILS: (id: number | string) => `/tickets/${id}`,
  },

  // User Chat Api (auth:sanctum)
  CHAT: {
    SUPPORT_ADMIN: '/chat/support-admin',
    CONVERSATIONS: '/chat/conversations',
    HISTORY: '/chat/history',
    MESSAGES: (userId: string) => `/chat/messages/${userId}`,
    SEND: '/chat/send',
    NOTIFICATIONS: {
      MARK_READ: (id: number | string) => `/chat/notifications/read/${id}`,
      READ_ALL: '/chat/notifications/read-all',
    },
  },

  // Watchlist (auth:protect)
  WATCHLIST: {
    LIST: '/user/watchlists',
    CREATE: '/user/watchlists',
    UPDATE: (id: string) => `/user/watchlists/${id}`,
    DELETE: (id: string) => `/user/watchlists/${id}`,
    SCRIPTS: (id: string) => `/user/watchlists/${id}/scripts`,
    ADD_SCRIPT: '/user/watchlists/scripts',
    REMOVE_SCRIPT: (id: string) => `/user/watchlists/scripts/${id}`,
    SEARCH: '/user/watchlists/search',
  },
  // Option Chain
  // OPTION_CHAIN: {
  //   DATA: '/option-chain/data',
  //   EXPIRIES: '/angel/expiries',
  //   QUOTE: '/angel/quote',
  // },
};