"use client";

import { HeroSection } from "./HeroSection";
import LastPublished from "./LastPublished";
import MoreWatched from "./MoreWatched";

const Home = () => {
  return (
    <div className="bkMainColor">
      <HeroSection />
      <LastPublished />
      <MoreWatched />
    </div>
  );
};

export default Home;
