import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAccounting } from "../api/accounting";

function AccountingTable({ tKey, courseCount = 6, marginTop = "my-4" }) {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getAccounting()
      .then(data => setRows(Array.isArray(data?.tuition_fees) ? data.tuition_fees : []))
      .catch(err => console.error("Failed to load Accounting", err));
  }, []);

  return (
    <div className={`container-edge ${marginTop} overflow-x-auto mb-16`}>
      <table className="w-full border border-black text-sm text-center">
        <thead>
          <tr>
            <th rowSpan="2" className="border">№</th>
            <th rowSpan="2" className="border">{t(`${tKey}.specialty`)}</th>
            <th rowSpan="2" className="border">{t(`${tKey}.code`)}</th>
            <th colSpan={courseCount} className="border">{t(`${tKey}.price`)} (сом)</th>
          </tr>
          <tr>
            {Array.from({ length: courseCount }).map((_, i) => (
              <th key={i} className="border">{i + 1} {t("course")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="border">{row.id}</td>
              <td className="border text-left">{row.specialty_name}</td>
              <td className="border">{row.code}</td>
              {Array.from({ length: courseCount }).map((_, idx) => (
                <td key={idx} className="border">{row.year_prices_list?.[idx]?.price || "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AccountingTable;