import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PdfModal from "../components/UI/PdfModal";
import DocumentTable from "../components/UI/DocumentTable";
import { getDocuments } from "../api/documents";

export default function NLAkguki() {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState({
    isOpen: false,
    pdf: null,
    title: "",
  });

 const [kgukiDocuments, setKgukiDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const secondCategory = kgukiDocuments[1];

  useEffect (() => {
    const loadDocunments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDocuments();
        console.log(data);
        
        setKgukiDocuments(data);
      } catch (error) {
        setError(error.message || "Failed to load documents");
      } finally {
        setLoading(false);
      }
    }
      loadDocunments();
  }, []);

  const tableData = (secondCategory?.documents || []).map((item, index) => ({
    id: item.id || index + 1,
    text: item.description,
    pdf: item.document_url,
    index: index + 1,
  }));

  const openPdfModal = (item) => {
    if (item.pdf) {
      setModalState({
        isOpen: true,
        pdf: item.pdf,
        title: item.text,
      });
    }
  };

  const closePdfModal = () => {
    setModalState({ isOpen: false, pdf: null, title: "" });
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-20 py-4 sm:py-8">
      <h2 className="font-serif text-primary text-2xl sm:text-3xl md:text-4xl text-center py-6 sm:py-9 uppercase italic">
        {t("NLAknuki.title")}
      </h2>
      {loading && <div className="text-center py-4">{t("documentNLA.loading")}</div>}
      {error && <div className="text-center py-4 text-red-500">{t("documentNLA.error")}: {error}</div>}
      {!loading && !error && tableData.length === 0 ? ( 
      <div className="text-center py-10 border border-dashed border-gray-400 rounded-lg">
        <p className="text-gray-500 text-lg">{t("documentNLA.empty")}</p>
      </div>
    ) : (
      kgukiDocuments &&
      <DocumentTable
        data={tableData}
        config={{
          hasIndexColumn: true,
          hasActionColumn: true,
          actionType: "pdf",
          indexColumnWidth: "w-16",
          actionColumnWidth: "w-48",
          textColumnClass: "px-4 py-3 text-base text-gray-700",
          borderClass: "border border-black border-collapse",
          rowBorderClass: "border-b border-black last:border-b-0",
          hoverEffect: true,
          itemTextKey: "text",
          itemIdKey: "displayIndex",
          buttonVariant: "secondary",
          buttonClassName: "px-6 py-2 text-sm",
          showButtonIfNoAction: false,
        }}
        buttonText={t("NLAknuki.btnText") || "Открыть PDF"}
        onActionClick={openPdfModal}
        mobileView="cards"
      />)}

      {modalState.isOpen && (
        <PdfModal pdf={modalState.pdf} title={modalState.title} onClose={closePdfModal} />
    )}
      
    </section>
  );
}
