"use client";

import PublicStaticPage from "@/components/staticPages/PublicStaticPage";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useGetStaticTermsAndConditionsQuery } from "@/store/staticPages/staticPagesApi";

const PublicTermsAndConditions = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const { data, isLoading, isError, refetch } =
    useGetStaticTermsAndConditionsQuery({
      lang: lang ?? "ar",
    });

  return (
    <PublicStaticPage
      page={translate?.pages?.termsAndConditionsPage}
      html={data?.html}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  );
};

export default PublicTermsAndConditions;
