import { FaWhatsapp } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { BsClockFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import ApplicantsSwiper from "../components/ApplicantsSwiper.jsx";
import TwoGisMap from "../components/TwoGisMap.jsx";

function Applicants() {
  const { t } = useTranslation();
  const applicants = t("applicants", { returnObjects: true });

  return (
    <section className="w-full px-4 sm:px-6 lg:px-16 py-6 sm:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6 lg:gap-8">
        <h1 className="font-['Cormorant_Garamond'] font-bold italic text-2xl sm:text-3xl md:text-4xl lg:text-4xl leading-snug tracking-tight text-center uppercase text-text-accent">
          {applicants.title}
        </h1>

        <h2 className="font-['Inter'] font-bold text-base sm:text-lg md:text-xl lg:text-xl leading-snug tracking-wide text-center text-[#0D0D0D] mb-4 md:mb-6">
          {applicants.title2}
        </h2>
        <ApplicantsSwiper />

        <div className="space-y-6 md:space-y-8 lg:space-y-10 text-sm md:text-base lg:text-lg">
          {applicants.faculties?.map((i, id) => (
            <div key={id} className="mb-4 md:mb-6">
              <h3 className="font-['Inter'] font-semibold leading-relaxed tracking-wide mb-3 md:mb-4">
                {i.name}
              </h3>
              <ul className="list-disc pl-4 md:pl-5 space-y-2 md:space-y-3">
                {i.infos?.map((i, id) => (
                  <li
                    key={id}
                    className="font-['Inter'] font-normal leading-relaxed tracking-wide mb-2"
                  >
                    <span className="font-semibold">{i.span}</span>
                    {i.p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-sm md:text-base lg:text-lg font-['Inter'] font-normal leading-relaxed tracking-wide my-4 md:my-6 lg:my-8">
          <p className="mb-3 md:mb-4">{applicants.conditions?.first}</p>
          {applicants.conditions.all?.map((i, id) => (
            <p className="ml-4 md:ml-6 lg:ml-8 mb-2 md:mb-3" key={id}>
              {i}
            </p>
          ))}
        </div>

        <div className="text-sm md:text-base lg:text-lg font-['Inter'] font-normal leading-relaxed tracking-wide">
          <h3 className="font-semibold mb-3 md:mb-4">{applicants.documents?.name}</h3>
          <ul className="list-decimal pl-4 md:pl-5 space-y-2 md:space-y-3">
            {applicants.documents.all?.map((i, id) => (
              <li key={id} className="mb-2 md:mb-3">
                {i}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 md:mt-12 lg:mt-16 grid gap-4 md:gap-6 lg:gap-8 md:grid-cols-2">
          <div className="space-y-3 md:space-y-4 lg:space-y-5 grid content-end gap-3 md:gap-4">
            <div className="flex gap-2 md:gap-3 items-center">
              <FaWhatsapp className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              <div className="font-['Inter'] font-medium">
                <p className="leading-snug tracking-tight text-sm md:text-base">
                  {applicants.contacts.phoneLabel}
                </p>
                <p className="leading-none tracking-tight text-xs md:text-sm text-[#898989]">
                  {applicants.contacts.phone}
                </p>
              </div>
            </div>

            <div className="flex gap-2 md:gap-3 items-center">
              <MdEmail className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              <div className="font-['Inter'] font-medium">
                <p className="leading-snug tracking-tight text-sm md:text-base">
                  {applicants.contacts.emailLabel}
                </p>
                <p className="leading-none tracking-tight text-xs md:text-sm text-[#898989]">
                  {applicants.contacts.email}
                </p>
              </div>
            </div>

            <div className="flex gap-2 md:gap-3 items-center">
              <FaMapLocationDot className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              <div className="font-['Inter'] font-medium">
                <p className="leading-snug tracking-tight text-sm md:text-base">
                  {applicants.contacts.addressLabel}
                </p>
                <p className="leading-none tracking-tight text-xs md:text-sm text-[#898989]">
                  {applicants.contacts.address}
                </p>
              </div>
            </div>

            <div className="flex gap-2 md:gap-3 items-center">
              <BsClockFill className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              <div className="font-['Inter'] font-medium">
                <p className="leading-snug tracking-tight text-sm md:text-base">
                  {applicants.contacts.hoursLabel}
                </p>
                <p className="leading-none tracking-tight text-xs md:text-sm text-[#898989]">
                  {applicants.contacts.hours}
                </p>
              </div>
            </div>
          </div>

          <TwoGisMap />
        </div>
      </div>
    </section>
  );
}

export default Applicants;