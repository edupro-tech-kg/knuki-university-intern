import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import FacultyHero from "../components/faculty/FacultyHero";
import FacultyInfoBlocks from "../components/faculty/FacultyInfoBlocks";
import FacultyStats from "../components/faculty/FacultyStats";
import FacultyTeachersTabs from "../components/faculty/FacultyTeachersTabs";
import FacultyTextTabs from "../components/faculty/FacultyTextTabs";
import DocumentsSection from "../components/faculty/DocumentsSection";

import { getFacultyData } from "../data/faculties";
import { getPostgraduatePage } from "../api"; 

export default function FacultyPage() {
  const { slug, page_type } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!page_type) {
      setApiData(null);
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        const response = await getPostgraduatePage(page_type);
        setApiData(response);
      } catch (err) {
        console.error("Ошибка API:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page_type]);

  const currentLanguage = i18n.language.includes("ky") ? "kg" : i18n.language;

  const localizedFaculties = useMemo(() => {
    try {
      return t("facultiesData.items", { returnObjects: true }) || {};
    } catch (e) { return {}; }
  }, [t, i18n.language]);

  const faculty = useMemo(
    () => getFacultyData(slug, localizedFaculties, currentLanguage),
    [slug, localizedFaculties, currentLanguage]
  );

  useEffect(() => { setActiveTabIndex(0); }, [slug, page_type]);

  if (loading) return <div className="py-20 text-center">Загрузка...</div>;

  const content = page_type ? apiData : faculty;

  if (!content) return null;

  return (
    <div className="bg-light text-dark">
      <FacultyHero
        title={content.page_title || content.title}
        description={content.right_text || content.description}
        heroImage={content.main_image || content.heroImage}
        sliderImages={content.sliderImages}
      />

      {page_type && (
        <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          <div className="p-4 border shadow-sm">{content.block1_text}</div>
          <div className="p-4 border shadow-sm">{content.block2_text}</div>
          <div className="p-4 border shadow-sm">{content.block3_text}</div>
        </div>
      )}

      <FacultyTextTabs
        tabs={content.textTabs || []}
        activeIndex={activeTabIndex}
        onTabChange={setActiveTabIndex}
      />
      
      {content.stats && <FacultyStats stats={content.stats} />}
      <DocumentsSection documents={content.documents || []} />
    </div>
  );
}