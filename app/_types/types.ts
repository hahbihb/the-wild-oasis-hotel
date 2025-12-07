export type BookingType = {
  cabinId: number | null;
  cabinPrice: number | null;
  created_at: string;
  endDate: string | null;
  extrasPrice: number | null;
  guestId: number | null;
  hasBreakfast: boolean | null;
  id: number;
  isPaid: boolean | null;
  numGuests: number | null;
  numNights: number | null;
  observations: string | null;
  startDate: string | null;
  status: string | null;
  totalPrice: number | null;
};

export type GuestType = {
  countryFlag: string | null;
  created_at: string;
  email: string | null;
  fullName: string | null;
  id: number;
  nationalID: string | null;
  nationality: string | null;
};

export type CabinType = {
  created_at: string;
  description: string | null;
  discount: number | null;
  id: number;
  image: string | null;
  maxCapacity: number | null;
  name: string | null;
  regularPrice: number | null;
};

export type SettingsType = {
  breakfastPrice: number | null;
  created_at: string;
  id: number;
  maxBookingLength: number | null;
  maxGuestsPerBooking: number | null;
  minBookingLength: number | null;
};
