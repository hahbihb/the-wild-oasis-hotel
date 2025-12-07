import { EyeSlashIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/solid";
import { getCabin, getCabins } from "../../_lib/data-service";
import { unstable_noStore as noStore } from "next/cache";
import Reservation from "../../_components/Reservation";
import { Suspense } from "react";
import Spinner from "../../_components/Spinner";
import Cabin from "../../_components/Cabin";

export async function generateMetadata({
  params,
}: {
  params: { cabinId: string };
}) {
  const { name } = await getCabin(params.cabinId);
  return {
    title: `Cabin ${name}`,
    description: `Book your stay at our luxurious cabin ${name} in the heart of the Dolomites.`,
  };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  return cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));
}

export default async function Page({
  params,
}: {
  params: { cabinId: string };
}) {
  // noStore();
  const cabin = await getCabin(params.cabinId);
  const { name } = cabin;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
