import { useEffect, useState } from "react";
import ManagementCard from "./ManagementCard";
import ManagementModal from "./ManagementModal";

function ManagementSection() {


  const [isOpen, setIsOpen] = useState(false);
  const [personId, setPersonId] = useState(null);



  const openModal = (id) => {
    setPersonId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setPersonId(null);
  };

  return (
    <section className="w-full">
      {loading ? (
        <p className="text-center py-10">Загрузка...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {list.map((person) => (
            <ManagementCard
              key={person.id}
              id={person.id}
              name={person.full_name}
              post={person.position}
              image={makePhotoUrl(person.photo)}
              showButton={true}
              btnText="Подробнее"
              onOpenModal={openModal}
            />
          ))}
        </div>
      )}

      <ManagementModal isOpen={isOpen} onClose={closeModal} personId={personId} />
    </section>
  );
}

export default ManagementSection;

// console.log("API DATA:", list);