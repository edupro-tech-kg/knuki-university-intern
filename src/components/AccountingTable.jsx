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
    <th rowSpan="3" className="border">№</th>
    <th rowSpan="3" className="border">Специальность</th>
    <th rowSpan="3" className="border">Шифр</th>
    <th colSpan={courseCount} className="border">
      Срок обучения 5 лет, дневная форма обучения
    </th>
  </tr>

  <tr>
    <th colSpan={courseCount} className="border">
      стоимость обучения в сомах
    </th>
  </tr>

  <tr>
    {Array.from({ length: courseCount }).map((_, i) => (
      <th key={i} className="border">
        {i + 1} курс
      </th>
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