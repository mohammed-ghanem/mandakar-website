import type { CategoryItem, CategoryTopic } from "@/components/categorySections/types";

const SHEIKH_IMAGE = "/assets/images/1.jpg";

const ordinals = [
  "الأول",
  "الثاني",
  "الثالث",
  "الرابع",
  "الخامس",
  "السادس",
  "السابع",
  "الثامن",
  "التاسع",
  "العاشر",
  "الحادي عشر",
  "الثاني عشر",
  "الثالث عشر",
  "الرابع عشر",
  "الخامس عشر",
];

const lessons = (
  baseHref: string,
  count: number,
  idPrefix: string,
): CategoryTopic[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${idPrefix}-l${index + 1}`,
    title: `الدرس ${ordinals[index] ?? index + 1}`,
    href: `${baseHref}/lesson-${index + 1}`,
  }));

/**
 * Static test data covering every listing case:
 * - العقيدة: main with topics only → topics grid
 * - الحديث: main with sub-boxes + independent topics → tabs
 * - الفقه: subs, nested sub-subs, and independent topics → tabs + nested pages
 * - القرآن: subs only (no independent topics) → boxes without tabs
 * - السيرة: subs with topics only
 * - اللغة: leaf content (no topics / children on one child)
 */
export const scholarlyCategories: CategoryItem[] = [
  {
    id: 1,
    title: "القرآن الكريم وعلومه",
    href: "/scholarly/quran",
    image: SHEIKH_IMAGE,
    children: [
      {
        id: "1-1",
        title: "شرح مقدمة أصول التفسير لابن تيمية",
        href: "/scholarly/quran/usul-tafsir",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/quran/usul-tafsir", 8, "1-1"),
      },
      {
        id: "1-2",
        title: "تفسير آيات الأحكام",
        href: "/scholarly/quran/ayat-ahkam",
        image: SHEIKH_IMAGE,
        children: [
          {
            id: "1-2-1",
            title: "سورة البقرة",
            href: "/scholarly/quran/ayat-ahkam/baqarah",
            image: SHEIKH_IMAGE,
            topics: lessons("/scholarly/quran/ayat-ahkam/baqarah", 12, "1-2-1"),
          },
          {
            id: "1-2-2",
            title: "سورة آل عمران",
            href: "/scholarly/quran/ayat-ahkam/imran",
            image: SHEIKH_IMAGE,
            topics: lessons("/scholarly/quran/ayat-ahkam/imran", 6, "1-2-2"),
          },
          {
            id: "1-2-3",
            title: "سورة النساء",
            href: "/scholarly/quran/ayat-ahkam/nisa",
            image: SHEIKH_IMAGE,
            topics: lessons("/scholarly/quran/ayat-ahkam/nisa", 5, "1-2-3"),
          },
        ],
      },
      {
        id: "1-3",
        title: "علوم القرآن",
        href: "/scholarly/quran/ulum",
      },
    ],
  },
  {
    id: 2,
    title: "الحديث وعلومه",
    href: "/scholarly/hadith",
    image: SHEIKH_IMAGE,
    topics: [
      {
        id: "2-t1",
        title: "الرد على شبهة الموازنات والتقريب بين الأحاديث",
        href: "/scholarly/hadith/shubha-muwazanat",
      },
      {
        id: "2-t2",
        title: "ضوابط العمل بالحديث الضعيف في فضائل الأعمال",
        href: "/scholarly/hadith/daif-fadael",
      },
      {
        id: "2-t3",
        title: "منهج المحدثين في نقد المتون",
        href: "/scholarly/hadith/matn-naqd",
      },
      {
        id: "2-t4",
        title: "أحاديث الفتن والملاحم بين الفهم والتطبيق",
        href: "/scholarly/hadith/fitan",
      },
    ],
    children: [
      {
        id: "2-1",
        title: "شرح الأربعين النووية",
        href: "/scholarly/hadith/arbaeen",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/hadith/arbaeen", 14, "2-1"),
      },
      {
        id: "2-2",
        title: "شرح عمدة الأحكام",
        href: "/scholarly/hadith/umdah",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/hadith/umdah", 10, "2-2"),
      },
      {
        id: "2-3",
        title: "شرح كتاب التوحيد",
        href: "/scholarly/hadith/tawhid",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/hadith/tawhid", 8, "2-3"),
      },
      {
        id: "2-4",
        title: "شرح صحيح البخاري",
        href: "/scholarly/hadith/bukhari",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/hadith/bukhari", 12, "2-4"),
      },
      {
        id: "2-5",
        title: "شرح صحيح مسلم",
        href: "/scholarly/hadith/muslim",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/hadith/muslim", 9, "2-5"),
      },
      {
        id: "2-6",
        title: "مصطلح الحديث",
        href: "/scholarly/hadith/mustalah",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/hadith/mustalah", 7, "2-6"),
      },
    ],
  },
  {
    id: 3,
    title: "السيرة والتاريخ",
    href: "/scholarly/seerah",
    image: SHEIKH_IMAGE,
    children: [
      {
        id: "3-1",
        title: "السيرة النبوية",
        href: "/scholarly/seerah/nabawiyyah",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/seerah/nabawiyyah", 11, "3-1"),
      },
      {
        id: "3-2",
        title: "الشمائل المحمدية",
        href: "/scholarly/seerah/shamael",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/seerah/shamael", 6, "3-2"),
      },
      {
        id: "3-3",
        title: "تاريخ الخلفاء الراشدين",
        href: "/scholarly/seerah/khulafa",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/seerah/khulafa", 5, "3-3"),
      },
      {
        id: "3-4",
        title: "قصص الأنبياء",
        href: "/scholarly/seerah/anbiya",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/seerah/anbiya", 8, "3-4"),
      },
    ],
  },
  {
    id: 4,
    title: "اللغة العربية وأصولها",
    href: "/scholarly/arabic",
    image: SHEIKH_IMAGE,
    children: [
      {
        id: "4-1",
        title: "شرح الآجرومية",
        href: "/scholarly/arabic/ajurumiyyah",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/arabic/ajurumiyyah", 9, "4-1"),
      },
      {
        id: "4-2",
        title: "شرح قطر الندى",
        href: "/scholarly/arabic/qatar",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/arabic/qatar", 7, "4-2"),
      },
      {
        id: "4-3",
        title: "أصول النحو",
        href: "/scholarly/arabic/nahw",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/arabic/nahw", 5, "4-3"),
      },
    ],
  },
  {
    id: 5,
    title: "الفقه وأصوله",
    href: "/scholarly/fiqh",
    image: SHEIKH_IMAGE,
    topics: [
      {
        id: "5-t1",
        title: "الرد على شبهة الموازنات والتقريب بين المذاهب",
        href: "/scholarly/fiqh/shubha-muwazanat",
      },
      {
        id: "5-t2",
        title: "ضوابط الاجتهاد والتقليد عند المتأخرين",
        href: "/scholarly/fiqh/ijtihad",
      },
      {
        id: "5-t3",
        title: "حكم العمل بالقول الضعيف في المذهب",
        href: "/scholarly/fiqh/daeef-madhhab",
      },
      {
        id: "5-t4",
        title: "مسائل معاصرة في فقه الأقليات",
        href: "/scholarly/fiqh/aqalliyyat",
      },
    ],
    children: [
      {
        id: "5-1",
        title: "أصول الفقه",
        href: "/scholarly/fiqh/usul",
        image: SHEIKH_IMAGE,
        topics: [
          {
            id: "5-1-t1",
            title: "مقدمة في أدلة الأحكام",
            href: "/scholarly/fiqh/usul/adillah",
          },
          {
            id: "5-1-t2",
            title: "الفرق بين الدليل والتعليل",
            href: "/scholarly/fiqh/usul/dalil-taalil",
          },
        ],
        children: [
          {
            id: "5-1-1",
            title: "الورقات",
            href: "/scholarly/fiqh/usul/waraqat",
            image: SHEIKH_IMAGE,
            topics: lessons("/scholarly/fiqh/usul/waraqat", 10, "5-1-1"),
          },
          {
            id: "5-1-2",
            title: "روضة الناظر",
            href: "/scholarly/fiqh/usul/rawdah",
            image: SHEIKH_IMAGE,
            topics: lessons("/scholarly/fiqh/usul/rawdah", 8, "5-1-2"),
          },
        ],
      },
      {
        id: "5-2",
        title: "فقه العبادات",
        href: "/scholarly/fiqh/ibadat",
        image: SHEIKH_IMAGE,
        children: [
          {
            id: "5-2-1",
            title: "كتاب الصلاة",
            href: "/scholarly/fiqh/ibadat/salah",
            image: SHEIKH_IMAGE,
            topics: lessons("/scholarly/fiqh/ibadat/salah", 14, "5-2-1"),
          },
          {
            id: "5-2-2",
            title: "كتاب الزكاة",
            href: "/scholarly/fiqh/ibadat/zakah",
            image: SHEIKH_IMAGE,
            topics: lessons("/scholarly/fiqh/ibadat/zakah", 8, "5-2-2"),
          },
          {
            id: "5-2-3",
            title: "كتاب الصيام",
            href: "/scholarly/fiqh/ibadat/siyam",
            image: SHEIKH_IMAGE,
            topics: lessons("/scholarly/fiqh/ibadat/siyam", 6, "5-2-3"),
          },
          {
            id: "5-2-4",
            title: "كتاب الحج",
            href: "/scholarly/fiqh/ibadat/hajj",
            image: SHEIKH_IMAGE,
            topics: lessons("/scholarly/fiqh/ibadat/hajj", 7, "5-2-4"),
          },
        ],
      },
      {
        id: "5-3",
        title: "فقه المعاملات",
        href: "/scholarly/fiqh/muamalat",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/fiqh/muamalat", 9, "5-3"),
      },
      {
        id: "5-4",
        title: "القواعد الفقهية",
        href: "/scholarly/fiqh/qawaid",
        image: SHEIKH_IMAGE,
        topics: lessons("/scholarly/fiqh/qawaid", 11, "5-4"),
      },
    ],
  },
  {
    id: 6,
    title: "العقيدة",
    href: "/scholarly/aqeedah",
    image: SHEIKH_IMAGE,
    topics: [
      {
        id: "6-t1",
        title: "الرد على شبهة الموازنات والتقريب بين الأديان",
        href: "/scholarly/aqeedah/muwazanat",
      },
      {
        id: "6-t2",
        title: "شرح التدمرية لشيخ الإسلام ابن تيمية",
        href: "/scholarly/aqeedah/tadmuriyyah",
      },
      {
        id: "6-t3",
        title: "قواعد في صفات الله تعالى عند أهل السنة",
        href: "/scholarly/aqeedah/sifat",
      },
      {
        id: "6-t4",
        title: "نواقض الإسلام وأحكامها",
        href: "/scholarly/aqeedah/nawaqid",
      },
      {
        id: "6-t5",
        title: "الولاء والبراء ضوابطه ونواقضه",
        href: "/scholarly/aqeedah/wala-bara",
      },
      {
        id: "6-t6",
        title: "الإيمان بالقدر خيره وشره",
        href: "/scholarly/aqeedah/qadar",
      },
      {
        id: "6-t7",
        title: "توحيد الألوهية وأدلة العبادة",
        href: "/scholarly/aqeedah/uluhiyyah",
      },
      {
        id: "6-t8",
        title: "الأسماء الحسنى منهج أهل السنة في إثباتها",
        href: "/scholarly/aqeedah/asma",
      },
    ],
  },
];
