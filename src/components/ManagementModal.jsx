import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

function ManagementModal({ isOpen, onClose, person }) {
  const { t } = useTranslation();
  const managementInfo = t("managementInfo", { returnObjects: true });
  const sectionTitles = managementInfo?.sectionTitles || {};

  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen || !person) return null;

  const splitName = (fullName) => {
    if (!fullName) return { firstLine: "", secondLine: "" };
    const words = fullName.trim().split(/\s+/);
    if (words.length <= 2) {
      return {
        firstLine: fullName,
        secondLine: "",
      };
    } else {
      const firstLine = words.slice(0, 2).join(" ");
      const secondLine = words.slice(2).join(" ");
      return { firstLine, secondLine };
    }
  };

  const { firstLine, secondLine } = splitName(person.name);

  // Проверяем наличие дополнительной информации
  const hasAdditionalInfo =
    person.additionalInfo &&
    Object.values(person.additionalInfo).some((value) => value && value.toString().trim() !== "");

  // Определенный порядок разделов
  const sectionOrder = [
    { key: "birthDatePlace", label: sectionTitles.birthDatePlace },
    { key: "residence", label: sectionTitles.residence },
    { key: "contact", label: sectionTitles.contact },
    { key: "email", label: sectionTitles.email },
    { key: "academicDegree", label: sectionTitles.academicDegree },
    { key: "academicTitle", label: sectionTitles.academicTitle },
    { key: "education", label: sectionTitles.education },
    { key: "workExperience", label: sectionTitles.workExperience },
    { key: "courses", label: sectionTitles.courses },
    { key: "publications", label: sectionTitles.publications },
    { key: "computerSkills", label: sectionTitles.computerSkills },
    { key: "professionalSkills", label: sectionTitles.professionalSkills },
    { key: "languages", label: sectionTitles.languages },
    { key: "personalQualities", label: sectionTitles.personalQualities },
    { key: "awards", label: sectionTitles.awards },
    { key: "maritalStatus", label: sectionTitles.maritalStatus },
  ];

  // Функция для рендеринга дополнительной информации
  const renderAdditionalInfo = () => {
    if (!hasAdditionalInfo) return null;

    return sectionOrder
      .filter(
        (section) =>
          person.additionalInfo?.[section.key] &&
          person.additionalInfo[section.key].toString().trim() !== ""
      )
      .map((section, index) => (
        <div
          key={section.key}
          className={`mb-4 ${index > 0 ? "pt-3 border-t border-gray-100" : ""}`}
        >
          <h5 className="font-bold text-base mb-1 text-gray-800">{section.label}:</h5>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {person.additionalInfo[section.key]}
          </p>
        </div>
      ));
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-4xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 w-8 h-8 z-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Close"
        >
          <span
          className="text-xl">×</span>
        </button>

        <div className="bg-white rounded-lg w-full max-h-[90vh] md:max-h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
          <div className="md:hidden w-full flex flex-col flex-1 min-h-0">
            <div className="w-full flex-shrink-0">
              <div className="w-1/3 mt-4 mx-auto aspect-[3/4] bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                <img src={person.image} alt={person.name} />
              </div>
              <div className="text-center px-4 mb-3">
                <h5 className="font-bold text-base leading-tight text-gray-800 mb-1">
                  {firstLine}
                  {secondLine && (
                    <>
                      <br />
                      {secondLine}
                    </>
                  )}
                </h5>
                <p className="text-gray-600 text-sm">{person.post}</p>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-shrink-0 p-4 pb-0 font-bold text-base text-gray-800">
                <h3>{managementInfo?.resume || "Резюме"}</h3>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="p-4">
                  <div className="text-gray-700 text-sm leading-relaxed mb-4">
                    <p className="whitespace-pre-line">{person.details}</p>
                  </div>

                  {hasAdditionalInfo && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="space-y-3">{renderAdditionalInfo()}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex w-full">
            <div className="w-2/5 lg:w-1/3 p-6 md:p-8">
              <div className="h-full flex flex-col">
                <div className="w-full aspect-[5/6] bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                  <img src={person.image} alt={person.name} />
                </div>

                <div className="text-center">
                  <h4 className="font-bold text-lg leading-tight text-gray-800">
                    {firstLine}
                    {secondLine && (
                      <>
                        <br />
                        {secondLine}
                      </>
                    )}
                  </h4>

                  <div className="mt-2">
                    <p className="text-gray-600 text-base">{person.post}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-3/5 lg:w-2/3 p-6 md:p-8 overflow-y-auto">
              <div className="h-full">
                <div className="pt-4">
                  <h4 className="font-bold text-xl mb-6 text-gray-800">
                    {managementInfo?.resume || "Резюме"}
                  </h4>

                  <div className="text-gray-700 text-base leading-relaxed">
                    {hasAdditionalInfo && (
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <div className="space-y-6">{renderAdditionalInfo()}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pb-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagementModal;