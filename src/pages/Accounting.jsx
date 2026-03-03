import React from "react";
import AccountingTable from "../components/AccountingTable.jsx";

function Accounting() {
  return (
    <div>
      <AccountingTable tKey="firstAccounting" />
      <AccountingTable tKey="secondAccounting" />
      <AccountingTable tKey="thirdAccounting" />
      <AccountingTable tKey="fourthAccounting" />
    </div>
  );
}

export default Accounting;