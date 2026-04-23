'use client'

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Page from "./invoices/page";

/* ================= TYPES ================= */

type InvoiceStatus = "draft" | "pending" | "paid";

type Invoice = {
  id: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  due: string;
};

/* ================= DATA ================= */

const invoicesMock: Invoice[] = [
  { id: "XM9141", client: "Alex Grim", amount: 556.0, status: "pending", due: "20 Sep 2021" },
  { id: "RT3080", client: "Jensen Huang", amount: 1800.9, status: "paid", due: "19 Aug 2021" },
  { id: "RG0314", client: "John Morrison", amount: 14002.33, status: "paid", due: "01 Oct 2021" },
  { id: "RT2080", client: "Alysa Werner", amount: 102.04, status: "pending", due: "12 Oct 2021" },
  { id: "AA1449", client: "Melissa Clarke", amount: 4032.33, status: "pending", due: "14 Oct 2021" },
  { id: "TY9141", client: "Thomas Wayne", amount: 6155.91, status: "pending", due: "31 Oct 2021" },
  { id: "FV2353", client: "Anita Wainwright", amount: 3102.04, status: "draft", due: "12 Nov 2021" },
];

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-green-100 text-green-600",
  pending: "bg-orange-100 text-orange-600",
  draft: "bg-gray-200 text-gray-600",
};

const statusOptions: InvoiceStatus[] = ["draft", "pending", "paid"];

/* ================= COMPONENT ================= */

export default function Home() {
  const [openFilter, setOpenFilter] = useState(false);

  const [filters, setFilters] = useState<Record<InvoiceStatus, boolean>>({
    draft: false,
    pending: true,
    paid: false,
  });

  /* ================= LOGIC ================= */

  const filteredInvoices = invoicesMock.filter((inv) => {
    if (!filters.draft && !filters.pending && !filters.paid) return true;
    return filters[inv.status];
  });

  const toggleFilter = (key: InvoiceStatus) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* ================= UI ================= */

  return (
    <div className="">
      <Page />
     
    </div>
  );
}