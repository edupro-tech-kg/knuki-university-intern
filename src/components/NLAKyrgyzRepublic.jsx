import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import DocumentTable from "./UI/DocumentTable";
import { getDocuments } from "../api/documents";
export default function NLAKyrgyzRepublic() {
  const { t, i18n } = useTranslation();
  const [krDocuments, setKrDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const firstCategory = krDocuments[0]; 

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDocuments();
        setKrDocuments(data);
      } catch (error) {
        console.error("Error loading documents:", error);
        setError(error.message || "Failed to load documents");
      } finally {
        setLoading(false);
      }
    }
    loadDocuments();
  }, [i18n.language]);

 const tableData = (firstCategory?.documents || []).map((item, index) => ({
    id: item.id || index + 1,
    text: item.description,
    link: item.document_url,
    index: index + 1,
}));

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-20 py-3">
      <h1 className="font-serif text-primary text-2xl sm:text-3xl md:text-4xl text-center py-6 md:py-9 uppercase italic">
        {t("documentNLA.title")}
      </h1>
      {loading && <div className="text-center py-4">{t("documentNLA.loading")}</div>}
      {error && <div className="text-center py-4 text-red-500">{t("documentNLA.error")}: {error}</div>}
      {!loading && !error && tableData.length === 0 ? (
      <div className="text-center py-10 border border-dashed border-gray-400 rounded-lg">
        <p className="text-gray-500 text-lg">{t("documentNLA.empty")}</p>
      </div>
    ) : (
      krDocuments && <DocumentTable
        data={tableData}
        config={{
          hasIndexColumn: true,
          hasActionColumn: true,
          actionType: "external",
          indexColumnWidth: "w-16",
          actionColumnWidth: "w-48",
          textColumnClass: "px-4 py-3 text-base text-gray-700",
          borderClass: "border border-black border-collapse",
          rowBorderClass: "border-b border-black last:border-b-0",
          hoverEffect: true,
          itemTextKey: "text",
          itemLinkKey: "link",
          buttonVariant: "secondary",
          buttonClassName: "px-6 py-2 text-sm",
          showButtonIfNoAction: false,
        }}
        buttonText={t("documentNLA.btnText") || "Открыть документ"}
        mobileView="cards"
      />)}
    </section>
  );
}
