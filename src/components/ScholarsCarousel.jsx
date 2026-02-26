import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function ScholarsCarousel({ variant = "national", showTitle = true }) {
  const { t } = useTranslation();
  const scholars = t("scholars", { returnObjects: true }) || {};

  const containerRef = useRef(null);
  const [showControls, setShowControls] = useState(false);

  const list =
    variant === "presidential"
      ? scholars.presidentialScholars || []
      : scholars.nationalScholars || [];

  const title = variant === "presidential" ? t("scholars.presidential") : t("scholars.national");

  useEffect(() => {
    const checkControls = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth } = containerRef.current;
        setShowControls(scrollWidth > clientWidth + 8);
      }
    };

    checkControls();
    window.addEventListener("resize", checkControls);
    return () => window.removeEventListener("resize", checkControls);
  }, [list]);

  const scrollByAmount = (dir) => {
    if (!containerRef.current) return;
    const firstCard = containerRef.current.querySelector(".chairman-card-item");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 260;
    const gap = 16;
    const amount = cardWidth + gap;
    containerRef.current.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="my-12">
      {showTitle && (
        <h3 className="text-2xl font-bold mb-6 text-center uppercase italic font-serif text-[#751715]">
          {title}
        </h3>
      )}

      <div className="relative md:px-6 px-4">
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide sm:px-10 lg:px-16 py-2 snap-x snap-mandatory"
        >
          {list.map((item, index) => (
            <div
              key={`${variant}-${index}`}
              className="chairman-card-item flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-[20px] shadow-sm bg-white w-[260px] sm:w-[280px] lg:w-[300px] flex-shrink-0 snap-start"
            >
              <span className="w-12 h-12 rounded-full flex justify-center items-center text-base font-semibold bg-[#BF211F] text-white">
                {index + 1}
              </span>

              <div className="text-center">
                <h4 className="text-lg font-semibold">{item.name}</h4>
                {variant === "national" && item.awardedBy && (
                  <p className="text-gray-600 mt-1 text-sm">{item.awardedBy}</p>
                )}
                {item.year && (
                  <p className="text-gray-700 mt-2 text-base leading-6 font-medium">{item.year}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {showControls && (
          <div className="hidden md:flex justify-center gap-3 mt-4">
            <button
              onClick={() => scrollByAmount(-1)}
              className="h-10 w-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="Previous"
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollByAmount(1)}
              className="h-10 w-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="Next"
            >
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScholarsCarousel;
