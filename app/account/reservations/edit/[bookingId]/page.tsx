import UpdateBookingForm from "../../../../_components/UpdateBookingForm";
import { updateBooking } from "../../../../_lib/actions";
import { getBooking, getCabin } from "../../../../_lib/data-service";

export default async function Page({
  params,
}: {
  params: { bookingId: string };
}) {
  const booking = await getBooking(params.bookingId);
  const { maxCapacity } = await getCabin(booking.cabinId);
  const { numGuests, observations } = booking;

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{params.bookingId}
      </h2>

      <UpdateBookingForm
        bookingId={params.bookingId}
        maxCapacity={maxCapacity}
        numGuests={numGuests}
        observations={observations}
      />
    </div>
  );
}
