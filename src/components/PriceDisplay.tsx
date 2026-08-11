"use client";

import { useCurrency } from "@/context/CurrencyContext";

export default function PriceDisplay({ eurAmount, className }: { eurAmount: number; className?: string }) {
  const { format } = useCurrency();
  return <span className={className}>{format(eurAmount)}</span>;
}
