import { Metadata } from "next";
import PublicTermsAndConditions from "@/components/settings/terms-and-conditions/PublicTermsAndConditions";

export const metadata: Metadata = {
  title: "الشروط والأحكام - التراث العلمى للشيخ فلاح مندكار",
  description:
    "الشروط والأحكام الخاصة بموقع التراث العلمى للشيخ فلاح مندكار.",
  robots: "index, follow",
};

export default function TermsAndConditionsPage() {
  return <PublicTermsAndConditions />;
}
