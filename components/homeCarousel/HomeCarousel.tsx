/* eslint-disable @next/next/no-img-element */
import CarouselComponent from "../carousel/CarouselComponent";
import banner1 from "@/public/assets/images/1.jpg";
import banner2 from "@/public/assets/images/2.jpg";
import banner3 from "@/public/assets/images/3.png";
import banner4 from "@/public/assets/images/4.png";
import Image from "next/image";


const HomeCarousel = () => {
    const items = [
        { id: 1, img: banner1 },
        { id: 2, img: banner2 },
        { id: 3, img: banner3 },
        { id: 4, img: banner4 },
    ];

    const slider = items.map((item) => (
        <div key={item.id}>
            <Image src={item.img} alt={`Slide ${item.id}`} className="w-full h-full object-cover" />
        </div>
    ));

    return (
        <div className="container w-[80%] mx-auto mt-5">
            <div className="px-5 py-0.5 ">
                <CarouselComponent
                    items={slider}
                    height="h-[100%] md:h-96 lg:h-96"
                    autoplay={false}
                    interval={5000}
                    showArrows={false}
                    showDots={true}
                    itemsPerView={4} // Change to 2, 3, or 4 for different layouts
                />
            </div>
        </div>
    );
};

export default HomeCarousel;
