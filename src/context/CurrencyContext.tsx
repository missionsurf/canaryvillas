"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "EUR" | "GBP";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rate: number; // EUR → GBP rate
  convert: (eurAmount: number) => number;
  symbol: string;
  format: (eurAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "EUR",
  setCurrency: () => {},
  rate: 0.86,
  convert: (n) => n,
  symbol: "€",
  format: (n) => `€${n.toFixed(0)}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("EUR");
  const [rate, setRate] = useState(0.86);

  useEffect(() => {
    const saved = localStorage.getItem("cv_currency") as Currency | null;
    if (saved === "GBP" || saved === "EUR") setCurrencyState(saved);

    fetch("https://open.er-api.com/v6/latest/EUR")
      .then((r) => r.json())
      .then((d) => { if (d?.rates?.GBP) setRate(d.rates.GBP); })
      .catch(() => {});
  }, []);

  function setCurrency(c: Currency) {
    setCurrencyState(c);
    localStorage.setItem("cv_currency", c);
  }

  const symbol = currency === "GBP" ? "£" : "€";

  function convert(eurAmount: number) {
    return currency === "GBP" ? eurAmount * rate : eurAmount;
  }

  function format(eurAmount: number) {
    const amount = convert(eurAmount);
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rate, convert, symbol, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
