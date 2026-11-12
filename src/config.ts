/**
 * ═══════════════════════════════════════════════════════════════════════════
 * كائن إعدادات الدعوة (CONFIG) — عدّل القيم أدناه بسهولة لتخصيص الدعوة
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface CelebrationItem {
  id: 'bride-henna' | 'groom-henna' | 'wedding';
  title: string;
  dayAndDate: string;
  location: string;
  subtitle?: string;
  iconType: 'henna' | 'heart' | 'crown';
  isMainWedding?: boolean;
}

export const CONFIG = {
  // ١) بيانات العروسين والعنوان (حرفيًا كما هو مطلوب)
  groomName: 'محمد',
  brideName: 'نورهان',
  title: 'محمد & نورهان',
  monogram: {
    groomInitial: 'M',
    brideInitial: 'N',
    groomLatin: 'Mohamed',
    brideLatin: 'Norhan',
  },

  // ٢) [تعديل الساعة]: متغير الساعة في أعلى الكود
  weddingTime: '٨:٠٠ مساءً',

  // ٣) [تعديل التاريخ والتوقيت للعداد التنازلي]: بتوقيت القاهرة (UTC+2)
  weddingDateIsoCairo: '2026-11-24T20:00:00+02:00',
  weddingDateDisplay: 'الثلاثاء 24 نوفمبر 2026',

  // ٤) [تعديل رابط الموقع على الخريطة]: ضع رابط Google Maps الخاص بالقاعة هنا
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=%D9%86%D8%A7%D8%AF%D9%8A+%D8%A7%D9%84%D8%AA%D8%AC%D9%86%D9%8A%D8%AF+%D9%84%D8%B6%D8%A8%D8%A7%D8%B7+%D8%A7%D9%84%D8%B4%D8%B1%D8%B7%D8%A9+%D8%A7%D9%84%D9%82%D8%A7%D8%B9%D8%A9+%D8%A7%D9%84%D9%85%D8%A7%D8%B3%D9%8A%D8%A9+%D8%A7%D9%84%D9%85%D8%B4%D8%A7%D9%8A%D8%A9+%D8%A7%D9%84%D8%B3%D9%81%D9%84%D9%8A%D8%A9',

  // ٥) [تعديل رقم الواتساب]: بصيغة دولية بدون علامة +
  whatsappNumber: '201000000000',
  whatsappDefaultMessage:
    'بارك الله لكما وبارك عليكما وجمع بينكما في خير ✨ أتشرف بتأكيد حضوري لحفل زفاف محمد & نورهان يوم الثلاثاء 24 نوفمبر 2026.',

  // ٦) [تعديل رابط الموسيقى]: ضع رابط ملف MP3 خارجي هنا (أو اتركه فارغًا لاستخدام المعزوفة الملكية الهادئة المدمجة تلقائيًا)
  musicUrl: '',

  // ٧) [تعديل الألوان الملكية]: تدرجات الخلفية النبيتي والأحمر الملكي مع السكرول واللمسات الذهبية
  colors: {
    midnightNavy: '#2B050D',   // نبيتي ملكي داكن
    deepEmerald: '#460916',    // نبيتي مخملي دافئ
    warmRoyalGold: '#560C1B',  // أحمر ياقوتي متدرج
    champagneGold: '#D4AF37',
    ivory: '#F7F3E8',
  },

  // ٨) الآية الكريمة والجملة الافتتاحية الرومانسية (عربي + إنجليزي)
  openingVerse: {
    bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    quranVerse:
      '﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾',
    lines: [
      'حينَ تلتقي الأرواحُ على ميثاقِ المودّةِ والنور،',
      'تُزهرُ اللحظاتُ وتكتملُ الحكايةُ بأجملِ فصولِها.',
    ],
    englishLines: [
      'When souls unite upon a sacred covenant of love and light,',
      'every moment blossoms and our story begins its finest chapter.',
    ],
  },

  // ٩) تفاصيل القاعة الرئيسية
  mainVenue: {
    hallName: 'القاعة الماسية',
    clubName: 'نادي التجنيد لضباط الشرطة',
    address: 'المشاية السفلية',
    fullDescription: 'نادي التجنيد لضباط الشرطة، القاعة الماسية، المشاية السفلية',
  },

  // ١٠) الجدول الزمني للاحتفالات
  celebrations: [
    {
      id: 'bride-henna',
      title: 'حنة العروسة',
      dayAndDate: 'السبت 21 نوفمبر 2026',
      location: 'أمام منزل والد العروسة',
      iconType: 'henna',
    },
    {
      id: 'groom-henna',
      title: 'حنة العريس',
      dayAndDate: 'الأحد 22 نوفمبر 2026',
      location: 'أمام منزل والد العريس',
      iconType: 'heart',
    },
    {
      id: 'wedding',
      title: 'حفل الزفاف',
      subtitle: 'الليلةُ الملكيةُ',
      dayAndDate: 'الثلاثاء 24 نوفمبر 2026',
      location: 'نادي التجنيد لضباط الشرطة، القاعة الماسية، المشاية السفلية',
      isMainWedding: true,
      iconType: 'crown',
    },
  ] as CelebrationItem[],

  // ١١) رسالة الختام
  closingMessage: {
    heading: 'بحضوركم تكتملُ فرحتُنا وتحلى ليلتُنا',
    subtext: 'دامت ديارُكم عامرةً بالأفراح والمسرّات، وشكرًا لكلِّ قلبٍ شاركَنا الدعاءَ والبهجة.',
  },
};
