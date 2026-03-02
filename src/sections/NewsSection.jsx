import React, { useRef, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Virtual } from "swiper/modules";
import ButtonPrimary from "../components/UI/Button";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/virtual";

import { getNews } from "../api/news";

export default function NewsSectionInfinite() {
  const { t, i18n } = useTranslation();
  const newsTitle = t("news.title");
  const readMoreLabel = t("news.readMore", { defaultValue: newsTitle });

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  const [swiperInstance, setSwiperInstance] = useState(null);
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const fetchInitialNews = useCallback(async () => {
    try {
      const data = await getNews();
      console.log(data);

      if (!Array.isArray(data)) return;

      const initialSlides = data.map((item, index) => ({
        id: index + 1,
        slug: item.slug,
        image: item.image,
        title: item.title,
        buttonText: item.buttonText || readMoreLabel,
      }));

      setSlides(initialSlides);
      setActiveSlideIndex(Math.min(10, initialSlides.length - 1));
    } catch (error) {
      console.error("Ошибка при загрузке новостей:", error);
    }
  }, [readMoreLabel]);

  useEffect(() => {
    fetchInitialNews();
  }, [i18n.language, fetchInitialNews]);

  const loadMoreSlides = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const data = await getNews();
      if (!Array.isArray(data)) return;

      const currentLength = slides.length;
      const newArticles = data.slice(currentLength, currentLength + 10);

      if (newArticles.length === 0) {
        setHasMore(false);
      }

      const newSlides = newArticles.map((item, i) => ({
        id: currentLength + i + 1,
        slug: item.slug,
        image: item.image,
        title: item.title,
        buttonText: item.buttonText || readMoreLabel,
      }));

      setSlides((prev) => {
        const updated = [...prev, ...newSlides];
        setTimeout(() => {
          if (swiperInstance?.virtual) swiperInstance.virtual.update();
        }, 0);
        return updated;
      });
    } catch (error) {
      console.error("Ошибка при добавлении слайдов:", error);
    } finally {
      setIsLoading(false);
    }
  }, [slides, isLoading, hasMore, swiperInstance, readMoreLabel]);

  const handleSlideChange = useCallback(
    (swiper) => {
      setActiveSlideIndex(swiper.activeIndex);

      if (swiper.activeIndex >= slides.length - 6 && hasMore && !isLoading) {
        loadMoreSlides();
      }
    },
    [slides.length, hasMore, isLoading, loadMoreSlides]
  );

  useEffect(() => {
    if (!swiperInstance) return;

    const tryInitNav = () => {
      if (prevRef.current && nextRef.current) {
        swiperInstance.params.navigation.prevEl = prevRef.current;
        swiperInstance.params.navigation.nextEl = nextRef.current;
        swiperInstance.navigation.init();
        swiperInstance.navigation.update();
        swiperInstance.on("slideChange", handleSlideChange);
      } else {
        setTimeout(tryInitNav, 50);
      }
    };
    tryInitNav();

    return () => {
      if (swiperInstance) {
        swiperInstance.off("slideChange", handleSlideChange);
      }
    };
  }, [swiperInstance, handleSlideChange]);

  return (
    <section id="news">
      <div className="bg-background container mx-auto px-4">
        <h2 className="uppercase font-serif text-2xl md:text-4xl font-bold mb-4 text-text-primary text-center italic">
          {newsTitle}
        </h2>
        <div className="relative">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            spaceBetween={40}
            initialSlide={activeSlideIndex}
            onSwiper={setSwiperInstance}
            modules={[EffectCoverflow, Navigation, Virtual]}
            className="w-full pb-16"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            breakpoints={{
              320: { spaceBetween: 20 },
              768: { spaceBetween: 30 },
              1024: { spaceBetween: 40 },
            }}
            virtual={{
              enabled: true,
              addSlidesBefore: 2,
              addSlidesAfter: 2,
            }}
          >
            {slides.map((slide, index) => (
              <SwiperSlide
                key={slide.id}
                virtualIndex={index}
                className="!h-72 md:!w-72 md:!h-96 lg:!w-80 lg:!h-[28rem]"
              >
                <div
                  className={`relative w-full h-full rounded-xl overflow-hidden shadow-xl transition-transform duration-500 ease-out ${index === activeSlideIndex ? "scale-100" : "scale-95"
                    }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/news/${slide.slug}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/news/${slide.slug}`);
                    }
                  }}
                >
                  <img
                    src={slide.image || "https://knuki-university.s3.amazonaws.com/media/news/%D0%BA%D1%83%D0%BC%D0%B8%D1%83.jpg"}
                    alt={slide.title}
                    className={`w-full h-full object-cover transition-all duration-500 ${index === activeSlideIndex ? "filter-none" : "grayscale"
                      }`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
                  {index === activeSlideIndex && (
                    <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 text-white">
                      <div className="text-center mb-4">
                        <h4 className="text-lg md:text-xl font-bold mb-2 line-clamp-2 drop-shadow">
                          {slide.title}
                        </h4>
                      </div>
                      <div className="flex justify-center">
                        <ButtonPrimary
                          onClick={() => navigate(`/news/${slide.slug}`)}
                        >
                          {slide.buttonText}
                        </ButtonPrimary>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="hidden absolute py-3 left-1/2 transform -translate-x-1/2 md:flex items-center gap-4 z-10">
            <button
              ref={prevRef}
              className="bg-transparent hover:bg-white/20 text-gray-700 h-10 md:h-12 rounded-full flex items-center justify-center border border-gray-300 px-4"
            >
              <FaArrowLeftLong className="w-6 h-6 md:w-8" />
            </button>
            <button
              ref={nextRef}
              className="bg-transparent hover:bg-white/20 text-gray-700 h-10 md:h-12 rounded-full flex items-center justify-center border border-gray-300 px-4"
            >
              <FaArrowRightLong className="w-6 h-6 md:w-8" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}