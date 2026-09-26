"use client";

import PublicStaticPage from "@/components/staticPages/PublicStaticPage";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useGetStaticPrivacyPolicyQuery } from "@/store/staticPages/staticPagesApi";

const PublicPrivacyPolicy = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const { data, isLoading, isError, refetch } = useGetStaticPrivacyPolicyQuery({
    lang: lang ?? "ar",
  });

  return (
    <PublicStaticPage
      page={translate?.pages?.privacyPolicyPage}
      html={data?.html}
      contentLang={data?.contentLang}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  );
};

export default PublicPrivacyPolicy;
