import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatToRupiah(number: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}

export function formatIDRInput(value: string){
  const isNegative = value.startsWith("-")

  const numeric = value.replace(/[^\d]/g, "")

  const raw = Number(numeric) * (isNegative ? -1 : 1)
  const formatted = (isNegative ? "-" : "") + new Intl.NumberFormat("id-ID").format(Number(numeric))

  return { raw, display: formatted }
}