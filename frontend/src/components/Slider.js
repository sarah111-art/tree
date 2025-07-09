import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { backendUrl } from '../context/ShopContext';

export default function Slider() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/banners?position=homepage`);
        setSlides(res.data);
      } catch (err) {
        console.error('Lỗi khi load banner:', err);
      }
    };
    fetchBanners();
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto mt-4 mb-8 rounded-xl overflow-hidden shadow-lg">
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        autoplay={{ delay: 3500 }}
        loop={true}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-[400px] object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 bg-black/60 text-white p-4 rounded-xl shadow-xl max-w-[80%] text-lg font-medium">
                {slide.title}
              </div>
              {slide.link && (
                <a
                  href={slide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                ></a>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
