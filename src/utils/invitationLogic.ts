import { CONFIG } from '../config';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isComplete: boolean;
}

/**
 * Calculates remaining time until the wedding timestamp in Cairo time (UTC+2).
 */
export function calculateCountdown(
  nowMs: number,
  targetIso: string = CONFIG.weddingDateIsoCairo
): CountdownState {
  const targetMs = new Date(targetIso).getTime();
  if (Number.isNaN(targetMs) || nowMs >= targetMs) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isComplete: true,
    };
  }

  const diffSeconds = Math.floor((targetMs - nowMs) / 1000);
  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds: diffSeconds,
    isComplete: false,
  };
}

/**
 * Formats an integer to a two-digit string with Arabic-Indic or standard numerals.
 */
export function formatTwoDigits(val: number): string {
  const clamped = Math.max(0, Math.floor(val));
  return clamped < 10 ? `0${clamped}` : `${clamped}`;
}

export interface WhatsAppRsvpInput {
  phone?: string;
  guestName?: string;
  companionsCount?: number;
  note?: string;
}

/**
 * Builds the pre-filled Arabic WhatsApp RSVP confirmation link.
 */
export function buildWhatsAppRsvpUrl(input: WhatsAppRsvpInput = {}): string {
  const cleanPhone = (input.phone ?? CONFIG.whatsappNumber).replace(/[^\d]/g, '');
  const nameSegment = input.guestName?.trim()
    ? `\nالاسم: ${input.guestName.trim()}`
    : '';
  const companionsSegment =
    typeof input.companionsCount === 'number' && input.companionsCount > 0
      ? `\nعدد الحضور: ${input.companionsCount}`
      : '';
  const noteSegment = input.note?.trim()
    ? `\nتهنئة للعروسين: ${input.note.trim()}`
    : '';

  const fullMessage = `${CONFIG.whatsappDefaultMessage}${nameSegment}${companionsSegment}${noteSegment}`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMessage)}`;
}

/**
 * Calculates optimal gold particle count based on viewport width and reduced-motion preference.
 */
export function getOptimalParticleCount(
  viewportWidth: number,
  prefersReducedMotion: boolean
): number {
  if (prefersReducedMotion) return 14;
  if (viewportWidth < 480) return 36;
  if (viewportWidth < 768) return 50;
  if (viewportWidth < 1200) return 66;
  return 82;
}

