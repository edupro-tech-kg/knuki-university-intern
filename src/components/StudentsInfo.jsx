import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getStudents } from "../api/students";

function StudentsInfo() {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  async function loadStudents() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to load students:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  loadStudents();
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    // если дошли до конца
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
      el.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mt-8 px-4 container-edge">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="
                    mx-auto max-w-7xl
                    flex gap-4 overflow-x-auto
                    md:grid md:grid-cols-2 lg:grid-cols-4
                    md:gap-6 md:overflow-visible
                    scrollbar-none
                "
      >
        <style jsx>{`
          .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
        `}</style>
  {isLoading && (<div className="w-full text-center py-10 text-gray-500">{t("students.loading")}</div>)}

  {error && (<div className="w-full text-center py-10 text-red-500">
    {t("students.error")}</div>)}

  {!isLoading && !error && students.length === 0 && (<div className="w-full text-center py-10 text-gray-500">
      {t("students.empty")}</div>)}
{!isLoading && !error && students.length > 0 && students.map((item, index) => (
          <div
            key={index}
            className="
                            flex-shrink-0
                            w-[85%] sm:w-[70%] md:w-auto
                            bg-white
                            rounded-xl md:rounded-none
                            border border-gray-200 md:border-none
                            shadow-sm md:shadow-none
                            p-4
                            flex flex-col items-center text-center
                        "
          >
            <div className="w-full aspect-[4/3] mb-4 overflow-hidden rounded-lg">
              <img
                src={item.image}
                alt={item.full_name}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>

            <h4 className="text-lg font-semibold mb-2">{item.full_name}</h4>

            <p className="text-gray-600 text-sm md:text-base">{item.position}</p>
         </div>
        ))}
      </div>
    </section>
  );
}

export default StudentsInfo;
