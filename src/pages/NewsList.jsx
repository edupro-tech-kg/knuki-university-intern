import { useMemo, useState, useEffect, } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getNews } from "../api/news";
import newsPlaceholder from "../assets/images/newsPlaceholder.jpg";

export default function NewsList() {
  const [newsItems, setNewsItems] = useState([]);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        setError(null);
        const data = await getNews();
        setNewsItems(data);
      } catch (error) {
        console.error("real error:", error);
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [i18n.language]);

  const cards = useMemo(
    () =>
      newsItems.map((item) => {
        let image = item?.image || newsPlaceholder;
        const realId = item?.id;
        return {
          id: realId,
          title: item?.title || t("news.title"),
          image: image,
          buttonText: item?.buttonText || t("news.readMore", { defaultValue: t("news.title") }),
        };
      }),
    [newsItems, t]
  );

  return (
    <section className="container-edge mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="uppercase font-serif text-xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-primary italic text-center">
            {t("news.pageHeading", { defaultValue: t("news.title") })}
          </h1>
        </div>
        {/* LOADING */}
        {loading && (<div className="text-center text-gray-500 text-xl">{t("news.loading")}</div>)}
        {/* ERROR */}
        {error && (<div className="text-center text-red-500 text-xl">{t("news.error")}</div>)}
        {/* EMPTY */}
        {!loading && !error && newsItems.length === 0 && (<div className="text-center text-gray-500 text-xl">{t("news.empty")}</div> )}

        {!loading && !error && newsItems.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <article
                key={card.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
                onClick={() => navigate(`/news/${card.id}`)}
              >
                <div className="relative w-full h-52 overflow-hidden bg-gray-100">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
                <div className="p-4 md:p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {card.title}
                  </h3>
                  <button
                    type="button"
                    className="mt-auto inline-flex items-center justify-start text-[#751715] font-semibold"
                  >
                    {card.buttonText || t("news.readMore", { defaultValue: t("news.title") })} →
                  </button>
                </div>
              </article>
            ))}
          </div>)}
      </div>
    </section>
  );
}
