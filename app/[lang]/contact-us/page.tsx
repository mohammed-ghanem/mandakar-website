import type { Metadata } from "next";
import ContactUs from "@/components/contactUs/ContactUs";
import { buildPageMetadata } from "@/lib/contentMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "تواصل معنا",
  description:
    "تواصل معنا عبر موقع التراث العلمى للشيخ فلاح مندكار للاستفسارات والملاحظات.",
  path: "/contact-us",
  keywords: ["تواصل معنا", "التراث العلمى للشيخ فلاح مندكار", "اتصل بنا"],
});

export default function Contact() {
  return <ContactUs />;
}
