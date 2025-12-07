"use client";
import { createContext, useContext, useState } from "react";

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

interface ReservationContextType {
  range: {
    from: Date | undefined;
    to?: Date | undefined;
  };
  setRange: React.Dispatch<
    React.SetStateAction<{
      from: Date | undefined;
      to?: Date | undefined;
    }>
  >;
  resetRange: () => void;
}

function ReservationProvider({ children }) {
  const [range, setRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  function resetRange() {
    setRange({ from: undefined, to: undefined });
  }
  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }

  return context;
}

export { ReservationProvider, useReservation };
