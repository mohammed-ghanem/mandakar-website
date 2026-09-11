import Navbar from "./Navbar";
import TopHeader from "./TopHeader";

const Header = () => {
  return (
    <div>
      <TopHeader />
      <hr className="bg-[#E6D6C0] h-0.5 mt-2" />
      <Navbar />
    </div>
  );
};

export default Header;
