import type { Metadata } from "next";
import PublicTermsAndConditions from "@/components/settings/terms-and-conditions/PublicTermsAndConditions";
import { buildPageMetadata } from "@/lib/contentMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "الشروط والأحكام",
  description:
    "الشروط والأحكام الخاصة بموقع التراث العلمى للشيخ فلاح مندكار.",
  path: "/terms-and-conditions",
});

export default function TermsAndConditionsPage() {
  return <PublicTermsAndConditions />;
}
