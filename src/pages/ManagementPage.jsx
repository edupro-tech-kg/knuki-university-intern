import UniversityStructureChart from "../components/UniversityStructureChart";
import { getAdministrationList } from "../api/administrationService";
import { useRef, useEffect, useState } from "react";
import ManagementCard from "../components/ManagementCard";
import ManagementModal from "../components/ManagementModal";


function ManagementPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);



  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const handleOpenModal = (person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPerson(null), 300);
  };


  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await getAdministrationList();
        setList(data);
        console.log("data:", data);
      } catch (e) {
        console.error("Ошибка загрузки администрации:", e);
        setList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchList(); 
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || window.innerWidth >= 768) return;

    const startAutoScroll = () => {
      if (scrollIntervalRef.current) return;

      scrollIntervalRef.current = setInterval(() => {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          container.scrollBy({
            left: 280,
            behavior: "smooth",
          });
        }
      }, 3000);
    };

    const stopAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    container.addEventListener("mouseenter", stopAutoScroll);
    container.addEventListener("touchstart", stopAutoScroll);
    container.addEventListener("mouseleave", startAutoScroll);
    container.addEventListener("touchend", startAutoScroll);

    startAutoScroll();

    return () => {
      stopAutoScroll();
      container.removeEventListener("mouseenter", stopAutoScroll);
      container.removeEventListener("touchstart", stopAutoScroll);
      container.removeEventListener("mouseleave", startAutoScroll);
      container.removeEventListener("touchend", startAutoScroll);
    };
  }, []);


  return (
    <>
      <section className="w-full mt-5 sm:mt-16 lg:mt-12 px-3 sm:px-4 lg:px-8">
        {}

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-3 lg:gap-4 overflow-x-auto md:overflow-x-visible snap-x hide-scrollbar"
          >
            {loading && <p className="text-center py-10">Загрузка...</p>}
            {list.map((item, index) => {
              const hasAdditionalInfo =
                item.additionalInfo && Object.keys(item.additionalInfo).length > 0;

              return (
                <div
                  key={`management-${index}`}
                  className="flex-shrink-0 w-[70%] sm:w-[60%] md:w-full snap-start"
                >
                  <ManagementCard
                    name={item.full_name}
                    post={item.position}
                    image={item.photo}
                    showButton={hasAdditionalInfo}
                    onOpenModal={hasAdditionalInfo ? () => handleOpenModal(item) : undefined}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <style jsx>{`
          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </section>

      <UniversityStructureChart />

      <ManagementModal isOpen={isModalOpen} onClose={handleCloseModal} person={selectedPerson} />
    </>
  );
}

export default ManagementPage;
