import { useEffect, useState } from "react";
import ManagementCard from "./ManagementCard";
import { getAdministrationList } from "../api/administrationService";

function ManagementSection() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAdministrationList();
        setPeople(data);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      }
    }

    fetchData();
  }, []);

  const handleOpenModal = (id) => {
    console.log("Открыть модалку для", id);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {people.map((person) => (
        <ManagementCard
          key={person.id}
          id={person.id}
          name={person.full_name}
          post={person.position}
          image={person.photo}
          showButton={true}
          onOpenModal={handleOpenModal}
        />
      ))}
    </div>
  );
}

export default ManagementSection;