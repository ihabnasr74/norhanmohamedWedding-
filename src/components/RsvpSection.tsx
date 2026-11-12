import React, { useState } from 'react';
import { MessageCircle, CheckCircle2, Users, Sparkles } from 'lucide-react';
import { buildWhatsAppRsvpUrl } from '../utils/invitationLogic';
import { CONFIG } from '../config';

export const RsvpSection: React.FC = () => {
  const [guestName, setGuestName] = useState('');
  const [companionsCount, setCompanionsCount] = useState<number>(1);
  const [note, setNote] = useState('');
  const [rsvpSaved, setRsvpSaved] = useState(false);

  const whatsappHref = buildWhatsAppRsvpUrl({
    phone: CONFIG.whatsappNumber,
    guestName,
    companionsCount,
    note,
  });

  const handleConfirmClick = () => {
    setRsvpSaved(true);
  };

  return (
    <section
      id="rsvp-section"
      aria-labelledby="rsvp-heading"
      className="relative py-20 sm:py-28 px-4 sm:px-8 max-w-3xl mx-auto text-center"
    >
      <div className="royal-glass-card rounded-3xl p-7 sm:p-12 border-[#D4AF37]/35">
        <span className="text-xs sm:text-sm font-kufi text-[#D4AF37] tracking-widest block mb-3">
          تأكيدُ التشرّفِ بالحضور
        </span>

        <h2
          id="rsvp-heading"
          className="font-ruqaa text-3xl sm:text-5xl text-metallic-gold leading-relaxed pb-1"
          style={{ textWrap: 'balance' }}
        >
          شاركونا فرحةَ الليلةِ المنتظرة
        </h2>

        <p className="mt-3 text-sm sm:text-base text-[#F7F3E8]/80 font-tajawal max-w-lg mx-auto leading-relaxed">
          يسعدنا تأكيد حضوركم أو إرسال تهنئة خاصة للعروسين {CONFIG.title} مباشرةً عبر واتساب
        </p>

        {/* Optional Guest Customization Fields */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
          <div>
            <label
              htmlFor="guest-name-input"
              className="block text-xs sm:text-sm font-kufi text-[#F5E6AD]/90 mb-2"
            >
              الاسم الكريم (اختياري)
            </label>
            <input
              id="guest-name-input"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="اكتب اسمك هنا..."
              className="w-full px-4 py-3 rounded-xl bg-[#26030A]/80 border border-[#D4AF37]/35 text-[#F7F3E8] placeholder-[#F7F3E8]/40 text-sm font-tajawal focus:outline-none focus:border-[#FBF5B7] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="guest-count-select"
              className="block text-xs sm:text-sm font-kufi text-[#F5E6AD]/90 mb-2"
            >
              عدد الحضور
            </label>
            <div className="relative">
              <select
                id="guest-count-select"
                value={companionsCount}
                onChange={(e) => setCompanionsCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[#26030A]/80 border border-[#D4AF37]/35 text-[#F7F3E8] text-sm font-tajawal focus:outline-none focus:border-[#FBF5B7] transition-colors appearance-none"
              >
                <option value={1}>شخص واحد (١)</option>
                <option value={2}>شخصان (٢)</option>
                <option value={3}>٣ أشخاص</option>
                <option value={4}>٤ أشخاص</option>
                <option value={5}>العائلة الكريمة (٥+)</option>
              </select>
              <Users className="w-4 h-4 text-[#D4AF37] pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="guest-note-input"
              className="block text-xs sm:text-sm font-kufi text-[#F5E6AD]/90 mb-2"
            >
              كلمة تهنئة للعروسين (اختياري)
            </label>
            <input
              id="guest-note-input"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="بارك الله لكما وبارك عليكما وجمع بينكما في خير..."
              className="w-full px-4 py-3 rounded-xl bg-[#26030A]/80 border border-[#D4AF37]/35 text-[#F7F3E8] placeholder-[#F7F3E8]/40 text-sm font-tajawal focus:outline-none focus:border-[#FBF5B7] transition-colors"
            />
          </div>
        </div>

        {/* Luxury WhatsApp CTA */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleConfirmClick}
            data-testid="whatsapp-rsvp-button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-xl bg-gradient-to-r from-[#5A0B1C] via-[#7A1127] to-[#5A0B1C] border border-[#D4AF37]/75 text-[#F7F3E8] font-kufi font-semibold text-sm sm:text-base shadow-[0_12px_35px_rgba(32,4,10,0.85),0_0_25px_rgba(212,175,55,0.3)] hover:border-[#FBF5B7] hover:shadow-[0_14px_45px_rgba(212,175,55,0.5)] transition-all duration-300 whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-5 h-5 text-[#FBF5B7]" />
            <span>تأكيد الحضور عبر واتساب</span>
          </a>

          {rsvpSaved && (
            <div
              role="status"
              data-testid="rsvp-confirmation-status"
              className="flex items-center gap-2 text-xs sm:text-sm text-[#FBF5B7] font-tajawal"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                تم تجهيز رسالة التأكيد الخاصة بك {guestName ? `يا ${guestName}` : ''} — ننتظركم بكلّ شوق!
              </span>
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
