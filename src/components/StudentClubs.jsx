import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import getOrganizations from "../api/organizations";

function ClubGroup({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeClub = items[activeIndex] || items[0];

  return (
    <section className="w-full bg-[#751715] py-6 sm:py-8 md:py-10">
      <div className="max-w-[1200px] mx-auto px-4 space-y-6 md:space-y-8">
        {/* Tabs */}
        <div className="bg-[#A62623] p-2 rounded-xl border border-[#751715]">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 px-1 pb-1 sm:px-0 sm:pb-0">

            {items.map((club, idx) => (
              <button
                key={club.key || club.name}
                onClick={() => setActiveIndex(idx)}
                className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors border text-center
                ${idx === activeIndex
                    ? "bg-white text-[#751715] border-[#751715] shadow-sm"
                    : "bg-[#751715] text-white border-[#A62623] hover:bg-[#8c1f1f] hover:border-[#8c1f1f]"
                  }
              `}
              >
                <span className="line-clamp-2">{club.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Teacher Cards */}
        <div className="space-y-6">
          {activeClub && (
            <div className="bg-[#A62623] text-white border border-[#751715] rounded-lg shadow-md flex flex-col md:flex-row overflow-hidden">
              {/* Фото контейнер с горизонтальными прямоугольными пропорциями */}
              <div className="w-full md:w-2/5 lg:w-2/5 flex-shrink-0">
                <div className="p-4 sm:p-5 md:p-6 lg:p-7 h-full flex flex-col">
                  <div className="w-full aspect-[4/3] border-2 border-white rounded-md overflow-hidden">
                    <img
                      src={activeClub.image}
                      alt={activeClub.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <p className="mt-4 md:hidden text-lg sm:text-xl font-semibold leading-snug text-center md:text-left">
                    {activeClub.name}
                  </p>
                </div>
              </div>

              {/* Контент */}
              <div className="w-full md:w-3/5 lg:w-3/5 p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col">
                <div className="space-y-3 flex-1">
                  <p className="hidden md:block text-xl lg:text-2xl font-semibold leading-snug mb-2">
                    {activeClub.name}
                  </p>

                  {activeClub.position && (
                    <p className="text-sm sm:text-base font-medium text-white/90 mb-3">
                      {activeClub.position}
                    </p>
                  )}

                  {activeClub.description && (
                    <div className="flex-1 overflow-y-auto">
                      <p className="text-sm sm:text-base leading-relaxed text-white/90 whitespace-pre-line">
                        {activeClub.description}
                      </p>
                    </div>
                  )}
                </div>

                {activeClub.subtitle && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-sm sm:text-base font-medium text-gray-300">
                      {activeClub.subtitle}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function StudentClubs() {
  const { t } = useTranslation();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrganizations() {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (error) {
        console.error("Error loading organizations:", error);
        setError("Failed to load organizations. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadOrganizations();
  }, []);

  return (
    <section className="mt-6 sm:mt-10 lg:mt-12 space-y-6 sm:space-y-10 mb-10 sm:mb-14">
      <div className="mx-auto">
        {loading && (<div className="text-center text-gray-500 text-lg col-span-full">
          {t("studentOrganizations.loading")}
        </div>)}
         {!loading && !error && organizations.length === 0 && (<div className="text-center text-gray-500 text-xl">{t("studentOrganizations.empty")}</div> )}

        {error && (<div className="text-center text-red-400 text-lg col-span-full">{t("studentOrganizations.error")}</div>)}
        {!loading && !error && organizations.length > 0 && organizations.map((group, idx) => (
      
          <ClubGroup key={`club-${idx}`} items={group} />
        ))}
      </div>
    </section>
  );
}
