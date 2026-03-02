import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAccounting } from "../api/accounting";

function AccountingThird() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);

useEffect(() => {
  async function loadAccounting() {
    try {
      const data = await getAccounting();
      console.log("API response:", data);

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
    <div className="container-edge my-4 overflow-x-auto mt-16">
      <table className="w-full border border-black text-sm text-center">
        <thead>
          <tr>
            <th rowSpan="3" className="border">№</th>
            <th rowSpan="3" className="border">{t("thirdAccounting.specialty")}</th>
            <th rowSpan="3" className="border">{t("thirdAccounting.code")}</th>
            <th colSpan="6" className="border">{t("thirdAccounting.title")}</th>
          </tr>
          <tr>
            <th colSpan="6" className="border">{t("thirdAccounting.price")}</th>
          </tr>
          <tr>
            {t("thirdAccounting.courses", { returnObjects: true }).map((c, i) => (
              <th key={i} className="border">{c}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* {rows.map((row, i) => (
            <tr key={i}>
              <td className="border">{row.id}</td>
              <td className="border text-left">{row.name}</td>
              <td className="border">{row.code}</td>
              {row.prices?.map((price, idx) => (
                <td key={idx} className="border">{price}</td>
              ))}
            </tr>
          ))} */}
       
  {Array.isArray(rows) && rows.map((row, i) => (
    <tr key={i}>
      <td className="border">{row.id}</td>
      <td className="border text-left">{row.specialty_name}</td>
      <td className="border">{row.code}</td>
      <td className="border">{row.price || "-"}</td>
    </tr>
  ))}

        </tbody>
      </table>
    </div>
  );
}

export default AccountingThird;