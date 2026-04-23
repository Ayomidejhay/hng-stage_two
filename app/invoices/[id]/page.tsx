"use client";

import React, { useEffect, useState, use } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

import type { Invoice, InvoiceStatus } from "../../types";
import NewInvoice from "@/app/components/NewInvoice";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Currency formatter
 */
const FormatCurrency = ({ value }: { value: number }) => {
  return (
    <span className="font-bold text-lg text-white">
      {new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(value)}
    </span>
  );
};

export default function InvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  /**
   * FETCH SINGLE INVOICE
   */
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const ref = doc(db, "invoices", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setInvoice({
            id: snap.id,
            ...(data as Omit<Invoice, "id">),
          });
        } else {
          setInvoice(null);
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  /**
   * STATUS UI
   */
  const getStatusClasses = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "bg-[#33D69F1A] text-[#33D69F]";
      case "pending":
        return "bg-[#FF8F001A] text-[#FF8F00]";
      case "draft":
        return "bg-[#373B531A] text-[#373B53]";
      default:
        return "bg-[#373B531A] text-[#373B53]";
    }
  };

  /**
   * DELETE INVOICE (confirmed)
   */
  const handleDelete = async () => {
    if (!invoice) return;

    await deleteDoc(doc(db, "invoices", invoice.id));

    setShowDeleteModal(false);
    window.location.href = "/";
  };

  /**
   * MARK AS PAID
   */
  const markAsPaid = async () => {
    if (!invoice) return;

    await updateDoc(doc(db, "invoices", invoice.id), {
      status: "paid",
    });

    setInvoice({ ...invoice, status: "paid" });
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-[#7E88C3]">Loading invoice...</div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-8 text-center text-[#7E88C3]">Invoice not found.</div>
    );
  }

  return (
    <div className="max-w-3xl lg:w-4xl mx-auto p-4 md:p-8 space-y-8 text-[13px] text-[#7E88C3]">
      {/* BACK */}
      <Link
        href="/"
        className="flex items-center gap-3 text-sm font-bold text-[#0C0E1E]"
      >
        <ChevronLeft className="w-5 h-5 text-[#7C5DFA]" />
        Go back
      </Link>

      {/* HEADER */}
      <header className="bg-white p-6 rounded-xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm">Status</span>
          <div
            className={`px-6 py-3 rounded-md text-xs uppercase font-bold ${getStatusClasses(invoice.status)}`}
          >
            {invoice.status}
          </div>
        </div>

        <div className="flex gap-2">
          {invoice.status !== "paid" && (
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold"
            >
              Edit
            </button>
          )}

          {/* DELETE BUTTON OPENS MODAL */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold"
          >
            Delete
          </button>

          {invoice.status !== "paid" && (
            <button
              onClick={markAsPaid}
              className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </header>

      {/* CONTENT */}
      <main className="bg-white p-10 rounded-xl space-y-10">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#0C0E1E] uppercase">
              #{invoice.id.slice(0, 6)}
            </h1>

            <p>{invoice.description}</p>
          </div>
          <div className="text-right">
            <p>{invoice.billFrom.street}</p>
            <p>{invoice.billFrom.city}</p>
            <p>{invoice.billFrom.postCode}</p>
            <p>{invoice.billFrom.country}</p>
          </div>
        </div>

        <div className="flex">
          <div className="flex-1">
            <div>
              <p className="pb-2">Invoice Date</p>
              <p className="text-[#0C0E1E] font-bold">
                {invoice.invoiceDueDate}
              </p>
            </div>
            <div className="mt-2">
              <p className="pb-2">Payment Due</p>
              <p className="text-[#0C0E1E] font-bold">
                {invoice.invoiceDueDate}
              </p>
            </div>
          </div>
          <div className="flex-1">
            <p>Bill To</p>
            <p className="text-[#0C0E1E] font-bold py-2">
              {invoice.billTo.clientName}
            </p>
            <p>{invoice.billTo.street}</p>
            <p>{invoice.billTo.city}</p>
            <p>{invoice.billTo.postCode}</p>
            <p>{invoice.billTo.country}</p>
          </div>
          <div className="flex-1">
            <p className="pb-2">Sent To</p>
            <p className="text-[#0C0E1E] font-bold">
              {invoice.billTo.clientEmail}
            </p>
          </div>
        </div>

        <div className="bg-[#F9FAFE] p-6 rounded-lg ">
          <div className="grid grid-cols-4 py-2 ">
            <p>Item Name</p>
            <p className="text-center">QTY.</p>
            <p className="text-center">Price</p>
            <p className="text-end">Total</p>
          </div>
          {invoice.items?.map((item) => (
            <div key={item.id} className="grid grid-cols-4 py-2">
              <p className="text-[#0C0E1E] font-bold">{item.name}</p>
              <p className="text-center">{item.qty}</p>
              <p className="text-center">£ {item.price}</p>
              <p className="font-bold text-end text-[#0C0E1E]">£ {item.total}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between bg-[#373B53] text-white p-6 rounded-b-lg">
          <p>Amount Due</p>
          <FormatCurrency value={invoice.total || 0} />
        </div>
      </main>

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Confirm Deletion
            </h2>

            <p className="text-gray-600 text-sm">
              Are you sure you want to delete invoice #{invoice.id.slice(0, 6)}?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-full bg-red-500 text-white font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {showEditModal && invoice && (
        <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
          {/* backdrop */}
          <div
            className="absolute inset-0"
            onClick={() => setShowEditModal(false)}
          />

          {/* modal panel */}
          <motion.div initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className="relative z-50">
            <NewInvoice
              mode="edit"
              initialData={invoice}
              onClose={() => setShowEditModal(false)}
            />
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
      
    </div>
  );
}
