import Button from "../components/UI/Button";
import PrimaryForm from "../components/UI/forms/PrimaryForm";
import DropdownForm from "../components/UI/forms/DropdownForm";
import { useTranslation } from "react-i18next";
import TextAreaForm from "../components/UI/forms/TextAreaForm";
import { useMemo, useState } from "react";
import { sendContactMessage } from "../api";

export default function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    program: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const programOptions = useMemo(
    () => [
      { value: "program1", label: t("consultation.form.programs.program1") },
      { value: "program2", label: t("consultation.form.programs.program2") },
      { value: "program3", label: t("consultation.form.programs.program3") },
      { value: "program4", label: t("consultation.form.programs.program4") },
      { value: "program5", label: t("consultation.form.programs.program5") },
      { value: "program6", label: t("consultation.form.programs.program6") },
    ],
    [t]
  );

  const reset = () => {
    setForm({ fullName: "", phone: "", program: "", note: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    if (!form.fullName.trim() || !form.phone.trim() || !form.program) {
      setSubmitError(t("consultation.form.status.required"));
      return;
    }

    const facultyLabel = programOptions.find((o) => o.value === form.program)?.label ?? "";

    try {
      setSubmitting(true);
      await sendContactMessage({
        name: form.fullName.trim(),
        phone: form.phone.trim(),
        faculty: facultyLabel,
        message: form.note.trim(),
      });
      setSubmitSuccess(true);
      reset();
    } catch (err) {
      const isTimeout =
        err?.code === "ECONNABORTED" ||
        (typeof err?.message === "string" && err.message.toLowerCase().includes("timeout"));

      const apiMessage =
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        null;
      setSubmitError(
        (isTimeout ? t("consultation.form.status.timeout") : apiMessage) ||
          t("consultation.form.status.error")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className=" bg-white container mx-auto px-4 md:px-8 py-12 md:py-16 lg:py-20"
    >
      <div className="flex justify-between flex-wrap  lg:flex-nowrap gap-16 lg:gap-8 items-start">
        <div className="pt-6 max-w-[670px] w-full">
          <h2 className="uppercase font-serif text-2xl md:text-4xl font-bold mb-4 text-text-primary text-left italic">
            {t("consultation.title")}
          </h2>

          <p className="2xl:text-xl 2xl:font-light text-base md:text-lg lg:text-base font-sans max-w-[85%]">
            {t("consultation.description")}
          </p>
        </div>

        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <div className=" gap-4 md:gap-6  mb-[50px]">
              <div className="flex flex-wrap lg:gap-8 lg:flex-nowrap  ">
                <PrimaryForm
                  label={t("consultation.form.name")}
                  placeholder={t("consultation.form.namePlaceholder")}
                  className="w-full"
                  labelClassName="text-sm md:text-sm lg:text-base"
                  name="fullName"
                  value={form.fullName}
                  onChange={(fullName) => setForm((prev) => ({ ...prev, fullName }))}
                  required
                  disabled={submitting}
                  autoComplete="name"
                />
                <DropdownForm
                  labelClassName="text-sm md:text-sm lg:text-base"
                  fields={[
                    {
                      name: "program",
                      label: t("consultation.form.faculty"),
                      required: true,
                      disabled: submitting,
                      options: programOptions,
                    },
                  ]}
                  values={{ program: form.program }}
                  onChange={(_, value) => setForm((prev) => ({ ...prev, program: value }))}
                />
              </div>

              <PrimaryForm
                label={t("consultation.form.phone")}
                placeholder={t("consultation.form.phonePlaceholder")}
                className="w-full"
                labelClassName="text-sm md:text-sm lg:text-base"
                type="tel"
                inputMode="tel"
                name="phone"
                value={form.phone}
                onChange={(phone) => setForm((prev) => ({ ...prev, phone }))}
                required
                disabled={submitting}
                autoComplete="tel"
              />

              <TextAreaForm
                placeholder={t("consultation.form.note.placeholder")}
                label={t("consultation.form.note.label")}
                name="note"
                value={form.note}
                onChange={(note) => setForm((prev) => ({ ...prev, note }))}
                disabled={submitting}
              />

              {submitError && (
                <p className="mt-4 text-sm text-red-600" role="alert">
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="mt-4 text-sm text-green-700" role="status">
                  {t("consultation.form.status.success")}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="secondary"
              className="!w-full"
              disabled={submitting}
            >
              {submitting ? t("consultation.form.status.sending") : t("consultation.form.submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
