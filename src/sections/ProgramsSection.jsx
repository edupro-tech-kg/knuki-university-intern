import React, { useRef, useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ButtonPrimary from "../components/UI/Button";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { getFacultiesHomepage } from "../api";
import music from "../assets/svg/music.svg";
import mask from "../assets/svg/mask.svg";
import projector from "../assets/svg/projector.svg";
import ballerina from "../assets/svg/ballerina.svg";

// const directions = [
//   { icon: music, slug: "choreography" },
//   { icon: mask, slug: "folk-music" },
//   { icon: projector, slug: "estrada-music" },
//   { icon: ballerina, slug: "theater" },
//   { icon: music, slug: "kino-tele" },
//   { icon: mask, slug: "postgraduate" },
// ];

export default function ProgramsSection() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaculties() {
      try {
        const data = await getFacultiesHomepage();
        setFaculties(data);
      } catch (error) {
        console.error("Failed to load faculties:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFaculties();
  }, []);



  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);

      if (containerRef.current && desktop) {
        const container = containerRef.current;
        setShowControls(container.scrollWidth > container.clientWidth);
      }
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const getScrollAmount = () => {
    if (!containerRef.current) return { cardWidth: 320, gap: 24 };

    const container = containerRef.current;
    const firstCard = container.children[0];
    if (!firstCard) return { cardWidth: 320, gap: 24 };

    const cardWidth = firstCard.getBoundingClientRect().width;
    const containerStyle = window.getComputedStyle(container);
    const gap = parseFloat(containerStyle.gap) || 24;

    return { cardWidth, gap, scrollAmount: cardWidth + gap };
  };

  // const handleNext = () => {
  //   if (!containerRef.current || !isDesktop) return;

  //   const container = containerRef.current;
  //   const { scrollLeft, scrollWidth, clientWidth } = container;
  //   const { scrollAmount } = getScrollAmount();

  //   const newScrollLeft = scrollLeft + scrollAmount;

  //   if (newScrollLeft >= scrollWidth - clientWidth - 1) {
  //     const endScrollLeft = scrollWidth - clientWidth;
  //     container.scrollTo({ left: endScrollLeft, behavior: "smooth" });

  //     setTimeout(() => {
  //       container.scrollTo({ left: 0, behavior: "auto" });
  //       setTimeout(() => {
  //         container.scrollTo({ left: scrollAmount, behavior: "smooth" });
  //       }, 50);
  //     }, 300);
  //   } else {
  //     container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  //   }
  // };

  // const handlePrev = () => {
  //   if (!containerRef.current || !isDesktop) return;

  //   const container = containerRef.current;
  //   const { scrollLeft, scrollWidth, clientWidth } = container;
  //   const { scrollAmount } = getScrollAmount();

  //   const newScrollLeft = scrollLeft - scrollAmount;

  //   if (newScrollLeft < 0) {
  //     container.scrollTo({ left: 0, behavior: "smooth" });

  //     setTimeout(() => {
  //       const endScrollLeft = scrollWidth - clientWidth;
  //       container.scrollTo({ left: endScrollLeft, behavior: "auto" });
  //       setTimeout(() => {
  //         container.scrollTo({ left: endScrollLeft - scrollAmount, behavior: "smooth" });
  //       }, 50);
  //     }, 300);
  //   } else {
  //     container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  //   }
  // };

  const handleNextSimple = () => {
    if (!containerRef.current || !isDesktop) return;

    const container = containerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const { scrollAmount } = getScrollAmount();

    const newScrollLeft = scrollLeft + scrollAmount;
    const maxScroll = scrollWidth - clientWidth;

    if (newScrollLeft > maxScroll + 10) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };

  const handlePrevSimple = () => {
    if (!containerRef.current || !isDesktop) return;

    const container = containerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const { scrollAmount } = getScrollAmount();

    const newScrollLeft = scrollLeft - scrollAmount;
    if (newScrollLeft < -10) {
      container.scrollTo({
        left: scrollWidth - clientWidth,
        behavior: "smooth",
      });
    } else {
      container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };

  const facultiesTitles = useMemo(
    () => t("facultiesData.items", { returnObjects: true }) || {},
    [t]
  );
  const programList = useMemo(() => t("programs.list", { returnObjects: true }) || [], [t]);

  const getTitle = (slug, index) =>
    facultiesTitles?.[slug]?.title || programList?.[index]?.title || slug;

  return (
    <section
      id="programs"
      className="bg-background flex items-center justify-center mt-20 container mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full relative max-w-7xl">
        <h2 className="uppercase font-serif text-2xl md:text-4xl font-bold mb-4 text-text-primary text-center italic">
          {t("programs.eyebrow")}
        </h2>

        <div className="relative">
          <div
            ref={containerRef}
            className={`
              ${
                !isDesktop
                  ? "flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pl-4 pr-4 md:pl-0 md:pr-0"
                  : "md:flex md:overflow-x-auto md:gap-6 md:pb-4 md:scrollbar-hide md:px-1"
              }
              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:none]
              [scrollbar-width:none]
            `}
          >
            {faculties.map((faculty, index) => (
              <Link
                to={`/faculty/${faculty.id}`}
                key={faculty.id}
                className={`
                  group 
                  ${
                    !isDesktop
                      ? "flex-shrink-0 w-[calc(100vw-64px)] md:w-[calc(50vw-48px)] snap-start"
                      : "md:flex-shrink-0 md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
                  }
                  bg-text-primary transition-all duration-300 
                  hover:bg-primary flex flex-col
                   overflow-hidden
                  ${isDesktop ? "md:mx-0" : ""}
                `}
              >
                <div className="p-6 flex flex-col h-full">
                  <h3 className="font-sans text-xl font-medium text-white mb-4 mt-4">
                    {faculty.faculty_name}
                  </h3>

                  <div className="flex-grow"></div>

                  <div className="mb-4 flex justify-end mt-auto">
                    <div className="bg-primary p-4 transition-colors duration-300 group-hover:bg-text-primary">
                      <img src={faculty.icon} alt="" className="w-20 h-20" />
                    </div>
                  </div>

                  <div>
                    <ButtonPrimary variant="primaryIcon">{t("programs.buttonText")}</ButtonPrimary>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {isDesktop && showControls && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrevSimple}
              className="bg-white hover:bg-gray-100 text-gray-700 h-10 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-300 shadow-sm hover:shadow-md px-4 md:px-5 hover:scale-105 active:scale-95"
              aria-label="Previous"
            >
              <FaArrowLeftLong className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={handleNextSimple}
              className="bg-white hover:bg-gray-100 text-gray-700 h-10 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-300 shadow-sm hover:shadow-md px-4 md:px-5 hover:scale-105 active:scale-95"
              aria-label="Next"
            >
              <FaArrowRightLong className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
