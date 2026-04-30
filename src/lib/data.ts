// /**
//  * @file src/lib/data.ts
//  * @description 🔴 THE SOVEREIGN NUCLEUS (RED ZONE - DO NOT TOUCH)
//  * @version SCR-2026-FUSION-V40 (Financial Matrix Enforced)
//  * [SCR-063]: Injected 'PaymentWallet' and 'paymentSnapshot' for Sovereign Transactions.
//  */

// export type CarrierTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

// export interface RatingStats {
//   average: number;
//   count: number;
//   tier: CarrierTier;
// }

// export interface CarrierPerformance {
//   onTimeDepartureRate: number;
//   cancellationRate: number;
//   activeTripDuration: number;
//   lastAIAuditAt?: any;
// }

// export interface PaymentWallet {
//   id: string;
//   type: "wallet" | "bank" | "card" | "other";
//   provider: string;
//   accountNumber: string;
//   holderName: string;
//   isPrimary: boolean;
// }

// export interface UserProfile {
//   id: string;
//   uid?: string;
//   firstName?: string;
//   lastName?: string;
//   fullName?: string;
//   displayName?: string;
//   email: string;
//   phoneNumber?: string;
//   phoneCountryCode?: string;
//   phoneCountry?: string;
//   role?: "traveler" | "carrier" | "admin" | "owner" | "agent" | "developer";
//   isAdmin?: boolean;
//   isDeactivated?: boolean;
//   isFinancialFrozen?: boolean;
//   subscriptionStatus?: "active" | "frozen" | "expired" | "trial";
//   expiryDate?: any;
//   trialEndsAt?: any;
//   photoURL?: string;
//   operatingCountry?: string;
//   ratingStats?: RatingStats;
//   performance?: CarrierPerformance;
//   permissions?: Record<string, boolean>;
//   vehicleType?: string;
//   vehicleModel?: string;
//   vehicleYear?: string;
//   vehicleCapacity?: number;
//   vehicleCategory?: "small" | "bus" | string;
//   plateNumber?: string;
//   sidePanelNumber?: string;
//   paymentInformation?: string;
//   paymentWallets?: PaymentWallet[];
//   officeName?: string;
//   isVerifiedByAgent?: boolean;
//   officePhone?: string;
//   bagsPerSeat?: number | string;
//   numberOfStops?: number | string;
//   jurisdiction?: { origin: string; destination: string };
//   price?: number;
//   depositPercentage?: number;
//   conditions?: string;
//   savedTemplates?: any[];

//   facebookProfile?: string;
//   instagramProfile?: string;
//   tiktokProfile?: string;

//   agentTarget?: number;
//   agentBonus?: number;
//   agentApprovalStatus?: "pending" | "approved" | "rejected";
//   lifetimeEarnings?: number;

//   walletBalance?: number;
//   activeBookingId?: string;
//   activeIntentId?: string;
//   currentActiveTripId?: string;
//   atomicId?: string;
//   createdAt?: any;
//   updatedAt?: any;
//   isPartial?: boolean;
//   currency?: string;
//   isActive?: boolean;
// }

// export interface Trip {
//   id: string;
//   userId: string;
//   carrierId?: string;
//   carrierName?: string;
//   origin: string;
//   destination: string;
//   departureDate: string;
//   status: "Planned" | "In-Transit" | "Completed" | "Cancelled" | "Awaiting-Offers" | "Offer-Received" | "Pending-Carrier-Confirmation";
//   passengers?: number;
//   passengersDetails?: PassengerDetails[];
//   price?: number;
//   currency?: string;
//   availableSeats?: number;
//   vehicleCapacity?: number;
//   vehicleType?: string;
//   vehiclePlateNumber?: string;
//   vehicleCategory?: "small" | "bus" | string;
//   depositPercentage?: number;
//   meetingPoint?: string;
//   meetingPointLink?: string;
//   estimatedDurationHours?: number;
//   conditions?: string;
//   passengerName?: string;
//   passengerPhone?: string;
//   bookingIds?: string[];
//   originalCarrierId?: string;
//   transferStatus?: "Transferred" | "Normal";
//   facebookProfile?: string;
//   instagramProfile?: string;
//   tiktokProfile?: string;
//   numberOfStops?: number | string;
//   bagsPerSeat?: number | string;
//   viewedAt?: any;
//   createdAt?: any;
//   updatedAt?: any;
//   atomicId?: string;
//   targetPrice?: number;
//   agentId?: string;
//   agentFee?: number;
//   offersCount?: number;
//   notes?: string;
//   requestType?: "General" | "Direct";
//   targetCarrierId?: string;
// }

// export type PassengerDetails = {
//   name: string;
//   nationality: string;
//   documentNumber: string;
//   type: "adult" | "minor" | "infant";
// };

// export interface Booking {
//   id: string;
//   tripId: string;
//   carrierTripId?: string;
//   userId: string;
//   carrierId: string;
//   seats: number;
//   status: "Confirmed" | "Pending-Payment" | "Pending-Payment-Verification" | "Pending-Carrier-Confirmation" | "Cancelled" | "Completed" | "Rated";
//   totalPrice: number;
//   currency?: string;
//   passengersDetails?: PassengerDetails[];
//   paymentSnapshot?: PaymentWallet[];
//   createdAt?: any;
//   updatedAt?: any;
//   atomicId?: string;
//   bookedByCarrier?: boolean;
//   paidAt?: any;
//   cancelReason?: string;
//   cancelledBy?: string;
//   cancelledAt?: any;
//   verifiedEmail?: string;
//   depositVoucherId?: string;
//   paymentDeclaredAt?: any;
// }

// export interface Offer {
//   id: string;
//   tripId: string;
//   carrierId: string;
//   carrierName?: string;
//   price: number;
//   currency: string;
//   depositPercentage: number;
//   vehicleType: string;
//   estimatedDurationHours: number;
//   status: "Pending" | "Accepted" | "Rejected";
//   meetingPoint?: string;
//   notes?: string;
//   conditions?: string;
//   createdAt: any;
//   carrierTripId?: string;
//   passengerIntentId?: string;
// }

// export interface Notification {
//   id: string;
//   type: string;
//   title: string;
//   message: string;
//   isRead: boolean;
//   isSovereign?: boolean;
//   link?: string;
//   createdAt: any;
// }

// export interface LedgerEntry {
//   id: string;
//   date?: any;
//   amount: number;
//   type: "credit" | "debit";
//   category: "EXPENSE" | "REVENUE" | string;
//   description: string;
//   currency?: string;
//   referenceId?: string;
//   status: "pending" | "completed" | "failed";
//   constitutionalReason?: string;
//   sourceDetails?: string;
//   adminEmail?: string;
//   createdAt?: any;
// }

// export interface FinanceSummary {
//   id: string;
//   totalRevenue: number;
//   totalIncome: number;
//   totalExpenses: number;
//   netProfit: number;
//   sovereignBalance: number;
//   pendingClearance: number;
//   lastUpdated: any;
// }

// export interface PricingRule {
//   id: string;
//   name: string;
//   countryName: string;
//   currency: string;
//   baseFare: number;
//   perKmRate: number;
//   commissionPercentage: number;
//   minDistance: number;
//   carrierSubscriptionFee: number;
//   travelerCommissionFee: number;
//   travelerDiscount: number;
//   trialOverrideDays: number;
//   isActive: boolean;
//   updatedAt: any;
// }

// export interface TopupRequest {
//   id: string;
//   userId: string;
//   userName?: string;
//   carrierId: string;
//   carrierName: string;
//   amount: number;
//   currency: string;
//   status: "pending" | "approved" | "rejected" | "PENDING" | "APPROVED" | "REJECTED";
//   paymentMethod: string;
//   method?: string;
//   receiptUrl?: string;
//   proofImageUrl?: string;
//   rejectionReason?: string;
//   requestedAt: any;
//   createdAt?: any;
//   processedAt?: any;
//   processedBy?: string;
//   notes?: string;
// }

// export type PaymentMethod = "CLIQ" | "CASH" | "WALLET" | "BANK_TRANSFER";

// export interface Chat {
//   id: string;
//   isGroupChat: boolean;
//   participants: string[];
//   lastMessage?: string;
//   lastMessageTimestamp?: any;
//   unreadCounts?: Record<string, number>;
//   isClosed?: boolean;
// }

// export interface Message {
//   id: string;
//   content: string;
//   senderId: string;
//   senderName: string;
//   timestamp: any;
//   type?: "text" | "system";
// }

// export interface TransferRequest {
//   id: string;
//   originalTripId: string;
//   tripId: string;
//   fromCarrierId: string;
//   toCarrierId: string;
//   status: "pending" | "accepted" | "rejected" | "Pending";
//   createdAt: any;
//   updatedAt: any;
//   tripDetails: {
//     origin: string;
//     destination: string;
//     departureDate: string;
//     passengerCount: number;
//   };
// }

// export interface StaffLedgerEntry {
//   id: string;
//   staffId: string;
//   type: "salary" | "bonus" | "advance" | "adjustment";
//   amount: number;
//   currency: string;
//   status: "pending" | "completed";
//   description: string;
//   createdAt: any;
// }

// export interface StaffTimesheet {
//   id: string;
//   staffId: string;
//   date: string;
//   hours: number;
//   task: string;
//   status: "pending" | "approved" | "rejected";
//   createdAt: any;
// }

/**
 * @file src/lib/data.ts
 * @description 🔴 THE SOVEREIGN NUCLEUS (RED ZONE - DO NOT TOUCH)
 * @version SCR-2026-FUSION-V40 (Financial Matrix Enforced)
 * [SCR-063]: Injected 'PaymentWallet' and 'paymentSnapshot' for Sovereign Transactions.
 */

export type CarrierTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export interface RatingStats {
  average: number;
  count: number;
  tier: CarrierTier;
}

export interface CarrierPerformance {
  onTimeDepartureRate: number;
  cancellationRate: number;
  activeTripDuration: number;
  lastAIAuditAt?: any;
}

export interface PaymentWallet {
  id: string;
  type: "wallet" | "bank" | "card" | "other";
  provider: string;
  accountNumber: string;
  holderName: string;
  isPrimary: boolean;
}

export interface UserProfile {
  id: string;
  uid?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  displayName?: string;
  email: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  phoneCountry?: string;
  role?: "traveler" | "carrier" | "admin" | "owner" | "agent" | "developer";
  isAdmin?: boolean;
  isDeactivated?: boolean;
  isFinancialFrozen?: boolean;
  subscriptionStatus?: "active" | "frozen" | "expired" | "trial";
  expiryDate?: any;
  trialEndsAt?: any;
  photoURL?: string;
  operatingCountry?: string;
  ratingStats?: RatingStats;
  performance?: CarrierPerformance;
  permissions?: Record<string, boolean>;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleCapacity?: number;
  vehicleCategory?: "small" | "bus" | string;
  plateNumber?: string;
  sidePanelNumber?: string;
  paymentInformation?: string;
  paymentWallets?: PaymentWallet[];
  officeName?: string;
  isVerifiedByAgent?: boolean;
  officePhone?: string;
  bagsPerSeat?: number | string;
  numberOfStops?: number | string;
  jurisdiction?: { origin: string; destination: string };
  price?: number;
  depositPercentage?: number;
  conditions?: string;
  savedTemplates?: any[];

  facebookProfile?: string;
  instagramProfile?: string;
  tiktokProfile?: string;

  agentTarget?: number;
  agentBonus?: number;
  agentApprovalStatus?: "pending" | "approved" | "rejected";
  lifetimeEarnings?: number;

  walletBalance?: number;
  activeBookingId?: string;
  activeIntentId?: string;
  currentActiveTripId?: string;
  atomicId?: string;
  createdAt?: any;
  updatedAt?: any;
  isPartial?: boolean;
  currency?: string;
  isActive?: boolean;
}

export interface Trip {
  id: string;
  userId: string;
  carrierId?: string;
  carrierName?: string;
  origin: string;
  destination: string;
  departureDate: string;
  status: "Planned" | "In-Transit" | "Completed" | "Cancelled" | "Awaiting-Offers" | "Offer-Received" | "Pending-Carrier-Confirmation";
  passengers?: number;
  passengersDetails?: PassengerDetails[];
  price?: number;
  currency?: string;
  availableSeats?: number;
  vehicleCapacity?: number;
  vehicleType?: string;
  vehiclePlateNumber?: string;
  vehicleCategory?: "small" | "bus" | string;
  depositPercentage?: number;
  meetingPoint?: string;
  meetingPointLink?: string;
  estimatedDurationHours?: number;
  conditions?: string;
  passengerName?: string;
  passengerPhone?: string;
  bookingIds?: string[];
  originalCarrierId?: string;
  transferStatus?: "Transferred" | "Normal";
  facebookProfile?: string;
  instagramProfile?: string;
  tiktokProfile?: string;
  numberOfStops?: number | string;
  bagsPerSeat?: number | string;
  viewedAt?: any;
  createdAt?: any;
  updatedAt?: any;
  atomicId?: string;
  targetPrice?: number;
  agentId?: string;
  agentName?: string;
  agentFee?: number;
  offersCount?: number;
  notes?: string;
  requestType?: "General" | "Direct";
  targetCarrierId?: string;
  creatorRole?: "agent" | "carrier" | "traveler";
}

export type PassengerDetails = {
  name: string;
  nationality: string;
  documentNumber: string;
  type: "adult" | "minor" | "infant";
  phone?: string;
};

export interface Booking {
  id: string;
  tripId: string;
  carrierTripId?: string;
  userId: string;
  carrierId: string;
  seats: number;
  status: "Confirmed" | "Pending-Payment" | "Pending-Payment-Verification" | "Pending-Carrier-Confirmation" | "Cancelled" | "Completed" | "Rated";
  totalPrice: number;
  currency?: string;
  passengersDetails?: PassengerDetails[];
  paymentSnapshot?: PaymentWallet[];
  createdAt?: any;
  updatedAt?: any;
  atomicId?: string;
  bookedByCarrier?: boolean;
  bookedByAgent?: boolean;
  agentId?: string;
  agentName?: string;
  agentFee?: number;
  creatorRole?: "agent" | "carrier" | "traveler";
  paidAt?: any;
  cancelReason?: string;
  cancelledBy?: string;
  cancelledAt?: any;
  verifiedEmail?: string;
  depositVoucherId?: string;
  paymentDeclaredAt?: any;
}

export interface Offer {
  id: string;
  tripId: string;
  carrierId: string;
  carrierName?: string;
  price: number;
  currency: string;
  depositPercentage: number;
  vehicleType: string;
  estimatedDurationHours: number;
  status: "Pending" | "Accepted" | "Rejected";
  meetingPoint?: string;
  notes?: string;
  conditions?: string;
  createdAt: any;
  carrierTripId?: string;
  passengerIntentId?: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  isSovereign?: boolean;
  link?: string;
  createdAt: any;
}

export interface LedgerEntry {
  id: string;
  date?: any;
  amount: number;
  type: "credit" | "debit";
  category: "EXPENSE" | "REVENUE" | string;
  description: string;
  currency?: string;
  referenceId?: string;
  status: "pending" | "completed" | "failed";
  constitutionalReason?: string;
  sourceDetails?: string;
  adminEmail?: string;
  createdAt?: any;
}

export interface FinanceSummary {
  id: string;
  totalRevenue: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  sovereignBalance: number;
  pendingClearance: number;
  lastUpdated: any;
}

export interface PricingRule {
  id: string;
  name: string;
  countryName: string;
  currency: string;
  baseFare: number;
  perKmRate: number;
  commissionPercentage: number;
  minDistance: number;
  carrierSubscriptionFee: number;
  travelerCommissionFee: number;
  travelerDiscount: number;
  trialOverrideDays: number;
  isActive: boolean;
  updatedAt: any;
}

export interface TopupRequest {
  id: string;
  userId: string;
  userName?: string;
  carrierId: string;
  carrierName: string;
  amount: number;
  currency: string;
  status: "pending" | "approved" | "rejected" | "PENDING" | "APPROVED" | "REJECTED";
  paymentMethod: string;
  method?: string;
  receiptUrl?: string;
  proofImageUrl?: string;
  rejectionReason?: string;
  requestedAt: any;
  createdAt?: any;
  processedAt?: any;
  processedBy?: string;
  notes?: string;
}

export type PaymentMethod = "CLIQ" | "CASH" | "WALLET" | "BANK_TRANSFER";

export interface Chat {
  id: string;
  isGroupChat: boolean;
  participants: string[];
  lastMessage?: string;
  lastMessageTimestamp?: any;
  unreadCounts?: Record<string, number>;
  isClosed?: boolean;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: any;
  type?: "text" | "system";
}

export interface TransferRequest {
  id: string;
  originalTripId: string;
  tripId: string;
  fromCarrierId: string;
  toCarrierId: string;
  status: "pending" | "accepted" | "rejected" | "Pending";
  createdAt: any;
  updatedAt: any;
  tripDetails: {
    origin: string;
    destination: string;
    departureDate: string;
    passengerCount: number;
  };
}

export interface StaffLedgerEntry {
  id: string;
  staffId: string;
  type: "salary" | "bonus" | "advance" | "adjustment";
  amount: number;
  currency: string;
  status: "pending" | "completed";
  description: string;
  createdAt: any;
}

export interface StaffTimesheet {
  id: string;
  staffId: string;
  date: string;
  hours: number;
  task: string;
  status: "pending" | "approved" | "rejected";
  createdAt: any;
}
