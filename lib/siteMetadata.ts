import { getSiteUrl } from "@/lib/siteUrl";

export const SITE_TITLE =
  "التراث العلمى للشيخ فلاح مندكار";

export const SITE_DESCRIPTION =
  "التراث العلمى للشيخ فلاح مندكار رحمة الله تعالى مكتبة علمية رقمية تضم الخطب والمحاضرات والدروس والمقالات والكتب والفتاوى، لتكون مرجعًا علميًا يسهل الوصول إليه والاستفادة منه.";

export const SITE_TITLE_EN =
  "The Scientific Heritage of Sheikh Falah Mandakar";

export const SITE_DESCRIPTION_EN =
  "The scientific heritage of Sheikh Falah Mandakar — a digital library of sermons, lectures, lessons, articles, books, and fatwas.";

export const SITE_KEYWORDS = [
  "التراث العلمى للشيخ فلاح مندكار",
  "الشيخ فلاح مندكار",
  "خطب",
  "محاضرات",
  "فتاوى",
  "مقالات",
  "كتب",
  "شروح علمية",
] as const;

export const getDefaultOgImage = () =>
  `${getSiteUrl()}/assets/images/meta.png`;
