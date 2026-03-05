import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FacultyHero from "../components/faculty/FacultyHero";
import FacultyInfoBlocks from "../components/faculty/FacultyInfoBlocks";
import FacultyStats from "../components/faculty/FacultyStats";
import FacultyTeachersTabs from "../components/faculty/FacultyTeachersTabs";
import FacultyTextTabs from "../components/faculty/FacultyTextTabs";
import DocumentsSection from "../components/faculty/DocumentsSection";
import { getFaculty } from "../api/faculty";

export default function FacultyPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [faculties, setFaculties] = useState([]);
  const [ load, setLoad ] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentLanguageCode = () => {
    const lang = i18n.language;
    if (lang === "kg" || lang === "ky") return "kg";
    if (lang === "ru") return "ru";
    if (lang === "en") return "en";
    return "kg";
  };

  useEffect(() => {
    async function loadFaculty() {
      setLoad(true);
      setError(null);
      try {
        const data = await getFaculty();
        setFaculties(data);
        console.log(data);
        
      } catch (error) {
        console.error("Error fetching faculty:",error);
      } finally {
        setLoad(false)
      }
    }
    loadFaculty();
  }, [])

  const currentLanguage = getCurrentLanguageCode();

const faculty = useMemo(() => {
  return faculties.find((f) => f.slug === slug);
}, [faculties, slug]);

  useEffect(() => {
    setActiveTabIndex(0);
  }, [slug]);

  if (!faculty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <p className="text-xl font-semibold mb-4">{t("facultiesData.notFoundTitle")}</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded bg-[#751715] text-white hover:bg-[#5f1112]"
        >
          {t("facultiesData.notFoundBack")}
        </button>
      </div>
    );
  }

  const renderInfoBlocks = () => {
    const useSecondary = faculty.programBlocksSecondary && activeTabIndex === 1;
    const blocks = useSecondary ? faculty.programBlocksSecondary : faculty.programBlocks;
    const heading = useSecondary ? faculty.programHeadingSecondary : faculty.programHeading;

    if (!blocks?.length) return null;

    return (
      <FacultyInfoBlocks
        programBlocks={blocks}
        programHeading={heading}
        layout={faculty.infoLayout || "split"}
      />
    );
  };

  const textTabs = (
    <FacultyTextTabs
      tabs={faculty.textTabs}
      activeIndex={activeTabIndex}
      onTabChange={setActiveTabIndex}
    />
  );

  return (
    <div className="bg-light text-dark">
      <FacultyHero
        title={faculty.title}
        description={faculty.description}
        heroImage={faculty.heroImage}
        sliderImages={faculty.sliderImages}
        heroBackground={faculty.heroBackground}
        studyForms={faculty.studyForms}
        duration={faculty.duration}
      />

      {faculty.infoAfterText ? (
        <>
          {textTabs}
          {renderInfoBlocks()}
        </>
      ) : (
        <>
          {renderInfoBlocks()}
          {textTabs}
        </>
      )}

      <FacultyStats stats={faculty.stats} heading={faculty.teachersTitle} />
      <FacultyTeachersTabs groups={faculty.teacherGroups || []} resetKey={slug} />
      <DocumentsSection documents={faculty.documents} />
    </div>
  );
}
