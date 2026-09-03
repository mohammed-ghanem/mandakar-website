import { Metadata } from "next";
import PublicPrivacyPolicy from "@/components/settings/privacy-policy/PublicPrivacyPolicy";

export const metadata: Metadata = {
  title: "سياسة الخصوصية - التراث العلمى للشيخ فلاح مندكار",
  description:
    "سياسة الخصوصية الخاصة بموقع التراث العلمى للشيخ فلاح مندكار.",
  robots: "index, follow",
};

export default function PrivacyPolicyPage() {
  return <PublicPrivacyPolicy />;
}
