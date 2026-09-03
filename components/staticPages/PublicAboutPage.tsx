"use client";

import PublicStaticPage from "@/components/staticPages/PublicStaticPage";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useGetStaticAboutQuery } from "@/store/staticPages/staticPagesApi";

const PublicAboutPage = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const { data, isLoading, isError, refetch } = useGetStaticAboutQuery({
    lang: lang ?? "ar",
  });

  return (
    <PublicStaticPage
      page={translate?.pages?.aboutPage}
      html={data?.html}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  );
};

export default PublicAboutPage;
