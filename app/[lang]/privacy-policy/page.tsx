import type { Metadata } from "next";
import PublicPrivacyPolicy from "@/components/settings/privacy-policy/PublicPrivacyPolicy";
import { buildPageMetadata } from "@/lib/contentMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "سياسة الخصوصية",
  description:
    "سياسة الخصوصية الخاصة بموقع التراث العلمى للشيخ فلاح مندكار.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <PublicPrivacyPolicy />;
}
