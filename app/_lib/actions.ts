"use server";
import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import supabase from "./supabase";
import { getBookings } from "./data-service";
import { stat } from "fs";
import { redirect } from "next/navigation";

function validateNationalID(id) {
  if (typeof id !== "string") return false;
  const trimmed = id.trim(); // remove accidental whitespace
  return /^[A-Za-z0-9]{6,12}$/.test(trimmed);
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to update your profile.");
  }

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = String(formData.get("nationality")).split(
    "%"
  );

  if (!validateNationalID(nationalID)) {
    throw new Error("Invalid National ID number.");
  }

  const updateData = {
    nationalID,
    nationality,
    countryFlag,
  };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function deleteReservation(bookingId) {
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  // throw new Error();
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");
  revalidatePath("/account/reservations");
}

export async function updateBooking(formData: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to update reservation.");
  }

  const observations = formData.get("observations");
  const numGuests = formData.get("numGuests");
  const bookingId = formData.get("bookingId");

  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  const updateData = {
    observations,
    numGuests: Number(numGuests),
  };

  const { data, error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  revalidatePath("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
