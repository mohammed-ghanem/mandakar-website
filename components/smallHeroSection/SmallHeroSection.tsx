import type { ReactNode } from "react";

type SmallHeroSectionProps = {
  title: ReactNode;
};

const SmallHeroSection = ({ title }: SmallHeroSectionProps) => {
  return (
    <section className="bkMainColor">
      <div className="container mx-auto w-[95%] max-w-6xl px-4 text-center">
        {title}
      </div>
    </section>
  );
};

export default SmallHeroSection;
