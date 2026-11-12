import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCountdown,
  formatTwoDigits,
  buildWhatsAppRsvpUrl,
  getOptimalParticleCount,
} from './invitationLogic';
import { CONFIG } from '../config';

test('calculateCountdown computes accurate days, hours, minutes, and seconds to Cairo target', () => {
  // 10 days, 2 hours, 30 minutes, 15 seconds before 2026-11-24T20:00:00+02:00
  const targetMs = new Date('2026-11-24T20:00:00+02:00').getTime();
  const offsetMs = ((10 * 86400) + (2 * 3600) + (30 * 60) + 15) * 1000;
  const result = calculateCountdown(targetMs - offsetMs, '2026-11-24T20:00:00+02:00');

  assert.equal(result.isComplete, false);
  assert.equal(result.days, 10);
  assert.equal(result.hours, 2);
  assert.equal(result.minutes, 30);
  assert.equal(result.seconds, 15);
});

test('calculateCountdown returns zeros and isComplete=true when target date is reached', () => {
  const targetMs = new Date('2026-11-24T20:00:00+02:00').getTime();
  const result = calculateCountdown(targetMs + 5000, '2026-11-24T20:00:00+02:00');

  assert.equal(result.isComplete, true);
  assert.equal(result.days, 0);
  assert.equal(result.hours, 0);
  assert.equal(result.minutes, 0);
  assert.equal(result.seconds, 0);
});

test('formatTwoDigits pads single digits properly', () => {
  assert.equal(formatTwoDigits(0), '00');
  assert.equal(formatTwoDigits(7), '07');
  assert.equal(formatTwoDigits(24), '24');
});

test('buildWhatsAppRsvpUrl includes phone number and encoded Arabic details', () => {
  const url = buildWhatsAppRsvpUrl({
    phone: '+20 100-000-0000',
    guestName: 'أحمد علي',
    companionsCount: 2,
    note: 'ألف مبروك',
  });

  assert.ok(url.startsWith('https://wa.me/201000000000?text='));
  const decoded = decodeURIComponent(url.split('?text=')[1]);
  assert.ok(decoded.includes('محمد & نورهان'));
  assert.ok(decoded.includes('أحمد علي'));
  assert.ok(decoded.includes('عدد الحضور: 2'));
  assert.ok(decoded.includes('ألف مبروك'));
});

test('getOptimalParticleCount scales down on mobile and reduced motion', () => {
  assert.equal(getOptimalParticleCount(1440, true), 14);
  assert.ok(getOptimalParticleCount(390, false) < getOptimalParticleCount(1440, false));
});

test('CONFIG contains exact required Arabic wedding invitation strings', () => {
  assert.equal(CONFIG.groomName, 'محمد');
  assert.equal(CONFIG.brideName, 'نورهان');
  assert.equal(CONFIG.title, 'محمد & نورهان');
  assert.equal(CONFIG.celebrations.length, 3);
  assert.equal(CONFIG.celebrations[0].dayAndDate, 'السبت 21 نوفمبر 2026');
  assert.equal(CONFIG.celebrations[1].dayAndDate, 'الأحد 22 نوفمبر 2026');
  assert.equal(CONFIG.celebrations[2].dayAndDate, 'الثلاثاء 24 نوفمبر 2026');
});
