"use client";

import { HeroSection } from "./HeroSection";
import LastPublished from "./LastPublished";
import MoreWatched from "./MoreWatched";
import Statistics from "./Statistics";

const Home = () => {
  return (
    <div className="bkMainColor">
      <HeroSection />
      <LastPublished />
      <MoreWatched />
      <Statistics />
    </div>
  );
};

export default Home;
