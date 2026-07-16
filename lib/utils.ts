import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export function formatDate(d: string): string {
  return format(parseISO(d), "d 'de' MMMM, yyyy", { locale: es })
}
export function formatShortDate(d: string): string {
  return format(parseISO(d), "d 'de' MMMM", { locale: es })
}
export function todayISO(): string { return new Date().toISOString().split('T')[0] }

export function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')
}

export function readingTime(text: string): string {
  const m = Math.ceil(text.trim().split(/\s+/).length / 200)
  return m === 1 ? '1 min de lectura' : `${m} min de lectura`
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, text.slice(0, max).lastIndexOf(' ')) + '…'
}
