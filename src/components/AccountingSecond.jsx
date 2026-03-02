import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAccounting } from "../api/accounting";

const AccountingSecond = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);

useEffect(() => {
  async function loadAccounting() {
    try {
      const data = await getAccounting();
      console.log("API response:", data);

      // Если тебе нужны, например, только tuition_fees:
      const rowsArray = Array.isArray(data.tuition_fees) ? data.tuition_fees : [];
      console.log("Rows array:", rowsArray);
      setRows(rowsArray);

    } catch (error) {
      console.error("Failed to load Accounting", error)
    }
  }
  loadAccounting();
}, []);


  return (
    <div className="overflow-x-auto container-edge my-4">
      <table className="w-full border border-black text-sm">
        <thead>
          <tr className="text-center font-semibold">
            <th className="border">№</th>
            <th className="border">{t("accounting.service")}</th>
            <th className="border">{t("accounting.amount")}</th>
          </tr>
        </thead>

        <tbody>
            {Array.isArray(rows) && rows.map((row, i) => (
    <tr key={i}>
      <td className="border">{row.id}</td>
      <td className="border text-left">{row.specialty_name}</td>
      <td className="border">{row.code}</td>
      {/* Если есть prices */}
      <td className="border">{row.price || "-"}</td>
    </tr>
  ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountingSecond;