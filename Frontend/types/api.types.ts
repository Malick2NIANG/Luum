// Mirrors Backend/prisma/schema.prisma. Dates are ISO strings (JSON over HTTP).

export type RoleType = 'CLIENT' | 'MERCHANT' | 'GP' | 'ADMIN';

export type TripStatus =
  | 'UPCOMING'
  | 'COLLECTING'
  | 'IN_TRANSIT'
  | 'COMPLETED'
  | 'CANCELLED';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COLLECTING'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'REFUNDED';

export type ItemStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'HANDED_TO_GP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PackageStatus =
  | 'AWAITING_DROPOFF'
  | 'DROPPED_OFF'
  | 'RECEIVED_BY_GP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'REFUSED'
  | 'CANCELLED';

export type PaymentType =
  | 'ESCROW_HOLD'
  | 'MERCHANT_PAYOUT'
  | 'GP_PAYOUT'
  | 'PLATFORM_FEE'
  | 'REFUND';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED';

export type MessageType = 'TEXT' | 'IMAGE' | 'VOICE' | 'FILE';

export type ReviewType =
  | 'CLIENT_TO_GP'
  | 'CLIENT_TO_MERCHANT'
  | 'GP_TO_CLIENT'
  | 'GP_TO_MERCHANT'
  | 'MERCHANT_TO_GP';

export type NotifType =
  | 'ORDER_CONFIRMED'
  | 'PACKAGE_HANDED_TO_GP'
  | 'PACKAGE_RECEIVED_BY_GP'
  | 'GP_IN_TRANSIT'
  | 'ORDER_DELIVERED'
  | 'NEW_MESSAGE'
  | 'PAYMENT_RELEASED'
  | 'GP_CANCELLED_TRIP'
  | 'PACKAGE_REFUSED'
  | 'KYC_APPROVED'
  | 'KYC_REJECTED'
  | 'DISPUTE_OPENED'
  | 'DISPUTE_RESOLVED';

export type DisputeStatus =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'RESOLVED_CLIENT'
  | 'RESOLVED_MERCHANT'
  | 'CLOSED';

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  avatar?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  roles?: RoleType[];
  createdAt: string;
  updatedAt: string;
}

export interface Merchant {
  id: string;
  userId: string;
  shopName: string;
  description?: string | null;
  address: string;
  city: string;
  country: string;
  idDocumentUrl?: string | null;
  isKycVerified: boolean;
  isApproved: boolean;
  rejectionNote?: string | null;
  payoutMethod?: string | null;
  payoutAccount?: string | null;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface GP {
  id: string;
  userId: string;
  idDocumentUrl?: string | null;
  isKycVerified: boolean;
  isApproved: boolean;
  rejectionNote?: string | null;
  totalTrips: number;
  maxWeightPerTrip: number;
  payoutMethod?: string | null;
  payoutAccount?: string | null;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  merchantId: string;
  name: string;
  description?: string | null;
  price: number;
  priceEur?: number | null;
  weight: number;
  images: string[];
  category?: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  gpId: string;
  originCity: string;
  originCountry: string;
  destCity: string;
  destCountry: string;
  departureDate: string;
  arrivalDate?: string | null;
  pricePerKg: number;
  maxWeight: number;
  usedWeight: number;
  status: TripStatus;
  flightTicketUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  clientId: string;
  status: OrderStatus;
  subtotalEur: number;
  shippingEur: number;
  platformFeeEur: number;
  totalEur: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryCountry: string;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  merchantId: string;
  packageId?: string | null;
  quantity: number;
  unitPrice: number;
  weight: number;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  orderId: string;
  gpId: string;
  tripId: string;
  merchantId: string;
  status: PackageStatus;
  weight: number;
  prepPhotoUrl?: string | null;
  receptionPhotoUrl?: string | null;
  deliveryPhotoUrl?: string | null;
  refusalReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  recipientId?: string | null;
  stripeId?: string | null;
  waveRef?: string | null;
  omRef?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  orderId: string;
  messages?: Message[];
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content?: string | null;
  fileUrl?: string | null;
  duration?: number | null;
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  type: ReviewType;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotifType;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  reporterId: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  resolution?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
