

"use client";

import React, { useState } from "react";
import { db } from "../lib/firebase";
import { Trash2, Plus } from "lucide-react";
import { createInvoice } from "../lib/invoices";
import type { Invoice, Item } from "../types";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

type InvoiceSection = "billFrom" | "billTo";

type Props = {
  onClose: () => void;
  initialData?: Invoice;
  mode?: "create" | "edit";
};

type Errors = {
  clientName?: string;
  clientEmail?: string;
  items?: string;
  itemErrors?: Record<string, { name?: string; qty?: string; price?: string }>;
};

export default function NewInvoice({
  onClose,
  initialData,
  mode = "create",
}: Props){
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [invoice, setInvoice] = useState<Invoice>(
    initialData || {
    id: "",
    billFrom: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    billTo: {
      clientName: "",
      clientEmail: "",
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    invoiceDueDate: "",
    paymentTerms: "Net 30 Days",
    description: "",
    items: [],
    total: 0,
    status: "draft",
  });

  //validation
  const validate = (): boolean => {
    const newErrors: Errors = {};
    const itemErrors: Errors["itemErrors"] = {};

    // Client Name
    if (!invoice.billTo.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!invoice.billTo.clientEmail.trim()) {
      newErrors.clientEmail = "Email is required";
    } else if (!emailRegex.test(invoice.billTo.clientEmail)) {
      newErrors.clientEmail = "Invalid email format";
    }

    // Items
    if (invoice.items.length === 0) {
      newErrors.items = "At least one item is required";
    }

    invoice.items.forEach((item) => {
      const itemErr: { name?: string; qty?: string; price?: string } = {};

      if (!item.name.trim()) {
        itemErr.name = "Required";
      }

      if (item.qty <= 0) {
        itemErr.qty = "Must be > 0";
      }

      if (item.price <= 0) {
        itemErr.price = "Must be > 0";
      }

      if (Object.keys(itemErr).length > 0) {
        itemErrors![item.id] = itemErr;
      }
    });

    if (Object.keys(itemErrors!).length > 0) {
      newErrors.itemErrors = itemErrors;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /**
   * ================= ITEM LOGIC =================
   */
  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          name: "",
          qty: 1,
          price: 0,
          total: 0,
        },
      ],
    }));
  };

  const updateItem = (
    id: string,
    field: keyof Item,
    value: string | number,
  ) => {
    setInvoice((prev) => {
      const items = prev.items.map((item) => {
        if (item.id !== id) return item;

        const updated = {
          ...item,
          [field]: field === "qty" || field === "price" ? Number(value) : value,
        };

        updated.total = updated.qty * updated.price;

        return updated;
      });

      const total = items.reduce((sum, i) => sum + i.total, 0);

      return { ...prev, items, total };
    });
  };

  const removeItem = (id: string) => {
    setInvoice((prev) => {
      const items = prev.items.filter((i) => i.id !== id);
      const total = items.reduce((sum, i) => sum + i.total, 0);

      return { ...prev, items, total };
    });
  };

  /**
   * ================= FIELD UPDATE =================
   */
  const updateField = <S extends InvoiceSection, K extends keyof Invoice[S]>(
    section: S,
    field: K,
    value: Invoice[S][K],
  ) => {
    setInvoice((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  /**
   * ================= SAVE =================
   */
  // const saveInvoice = async (status: "draft" | "pending") => {
  //   try {
  //     setLoading(true);

  //     const payload: Invoice = {
  //       ...invoice,
  //       status,
  //     };

  //     console.log("Submitting:", payload);

  //     await createInvoice(payload);

  //     alert("✅ Invoice saved");
  //     onClose();
  //   } catch (err) {
  //     console.error(err);
  //     alert("❌ Failed to save invoice");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const saveInvoice = async (status: "draft" | "pending" | "paid") => {
    
     if (!validate()) {
    toast.error("Please fix the errors before submitting");
    return;
  }
    try {
      setLoading(true);

      const payload: Invoice = {
        ...invoice,
        status,
      };

      if (mode === "edit") {
        // ✅ UPDATE EXISTING
        const ref = doc(db, "invoices", invoice.id);

        await updateDoc(ref, {
          ...payload,
        });

        toast.success("✅ Invoice updated");
      } else {
        // ✅ CREATE NEW
        await createInvoice(payload);
        toast.success("✅ Invoice created");
      }

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("❌ Operation failed");
    } finally {
      setLoading(false);
    }
  };
  /**
   * ================= UI =================
   */
   const inputError = (hasError?: boolean) =>
    `w-full border rounded-md p-3 font-bold focus:outline-none ${
      hasError
        ? "border-red-500"
        : "border-[#DFE3FA] focus:border-[#7C5DFA]"
    }`;
  return (
    <div className="max-w-3xl bg-white p-10 rounded-xl overflow-y-auto max-h-screen">
      <h1 className="text-2xl font-bold mb-8">New Invoice</h1>

      {/* ================= BILL FROM ================= */}
      <section className="mb-10">
        <h2 className="text-[#7C5DFA]  font-bold mb-4">Bill From</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label className="block text-sm text-[#7E88C3] mb-2">
              Street Address
            </label>
            <input
              placeholder="Street Address"
              // className="border p-3 w-full mb-3"
              className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold focus:outline-none focus:border-[#7C5DFA]"
              value={invoice.billFrom.street}
              onChange={(e) =>
                updateField("billFrom", "street", e.target.value)
              }
            />
          </div>
          <div>
            <label className="block text-sm text-[#7E88C3] mb-2">City</label>
            <input
              placeholder="City"
              className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold focus:outline-none focus:border-[#7C5DFA]"
              value={invoice.billFrom.city}
              onChange={(e) => updateField("billFrom", "city", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[#7E88C3] mb-2">
              Post Code
            </label>
            <input
              placeholder="Post Code"
              className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold focus:outline-none focus:border-[#7C5DFA]"
              value={invoice.billFrom.postCode}
              onChange={(e) =>
                updateField("billFrom", "postCode", e.target.value)
              }
            />
          </div>
          <div>
            <label className="block text-sm text-[#7E88C3] mb-2">Country</label>
            <input
              placeholder="Country"
              className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold focus:outline-none focus:border-[#7C5DFA]"
              value={invoice.billFrom.country}
              onChange={(e) =>
                updateField("billFrom", "country", e.target.value)
              }
            />
          </div>
        </div>
      </section>

      {/* ================= BILL TO ================= */}
      <section className="mb-10">
        <h2 className="text-[#7C5DFA] font-bold text-sm mb-6">Bill To</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label className="block text-sm text-[#7E88C3] mb-2">
              Clients Name
            </label>
            <input
              placeholder="Client Name"
              className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold focus:outline-none focus:border-[#7C5DFA]"
              value={invoice.billTo.clientName}
              onChange={(e) =>
                updateField("billTo", "clientName", e.target.value)
              }
            />
            {errors.clientName && (
              <p className="text-red-500 text-sm">{errors.clientName}</p>
            )}
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm text-[#7E88C3] mb-2">
              Clients Email
            </label>
            <input
              placeholder="Client Email"
              className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold focus:outline-none focus:border-[#7C5DFA]"
              value={invoice.billTo.clientEmail}
              onChange={(e) =>
                updateField("billTo", "clientEmail", e.target.value)
              }
            />
            {errors.clientEmail && (
              <p className="text-red-500 text-sm">{errors.clientEmail}</p>
            )}
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm text-[#7E88C3] mb-2">
              Street Address
            </label>
            <input
              placeholder="Street Address"
              className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold focus:outline-none focus:border-[#7C5DFA]"
              value={invoice.billTo.street}
              onChange={(e) => updateField("billTo", "street", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[#7E88C3] mb-2">City</label>
            <input
              placeholder="City"
              className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold focus:outline-none focus:border-[#7C5DFA]"
              value={invoice.billTo.city}
              onChange={(e) => updateField("billTo", "city", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[#7E88C3] mb-2">
              Post Code
            </label>
            <input
              placeholder="Post Code"
              className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold focus:outline-none focus:border-[#7C5DFA]"
              value={invoice.billTo.postCode}
              onChange={(e) =>
                updateField("billTo", "postCode", e.target.value)
              }
            />
          </div>
          <div>
            <label className="block text-sm text-[#7E88C3] mb-2">Country</label>
            <input
              placeholder="Country"
              className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold focus:outline-none focus:border-[#7C5DFA]"
              value={invoice.billTo.country}
              onChange={(e) => updateField("billTo", "country", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ================= DETAILS ================= */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm text-[#7E88C3] mb-2">
              Invoice Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold focus:outline-none"
                value={invoice.invoiceDueDate}
                onChange={(e) =>
                  setInvoice((p) => ({
                    ...p,
                    invoiceDueDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#7E88C3] mb-2">
              Payment Terms
            </label>
            <div className="relative">
              <select
                className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold appearance-none focus:outline-none"
                value={invoice.paymentTerms}
                onChange={(e) =>
                  setInvoice((p) => ({
                    ...p,
                    paymentTerms: e.target.value,
                  }))
                }
              >
                <option>Net 30 Days</option>
                <option>Net 14 Days</option>
                <option>Net 7 Days</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-[#7E88C3] mb-2">
              Project Description
            </label>
            <input
              placeholder="Project Description"
              className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold focus:outline-none focus:border-[#7C5DFA]"
              value={invoice.description}
              onChange={(e) =>
                setInvoice((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </section>

      {/* ================= ITEMS ================= */}
      <section className="mb-10">
        <h3 className="text-xl font-bold text-[#777F98] mb-4">Item List</h3>

        <div className="space-y-4">
          <div className="hidden md:grid grid-cols-12 gap-4 text-sm text-[#7E88C3] mb-2">
            <div className="col-span-5">Item Name</div>
            <div className="col-span-2">Qty.</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-1"></div>
          </div>
        </div>

        {invoice.items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-4 mb-3 items-center"
          >
            <div className="col-span-12 md:col-span-5">
              <label className="md:hidden text-sm text-[#7E88C3] mb-1">
                Item Name
              </label>
              <input
                className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold"
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                placeholder="Item Name"
              />
              {errors.itemErrors?.[item.id]?.name && (
                <p className="text-red-500 text-sm">{errors.itemErrors[item.id].name}</p>
              )}
            </div>

            <div className="col-span-3 md:col-span-2">
              <label className="md:hidden text-sm text-[#7E88C3] mb-1">
                Qty.
              </label>
              <input
                className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold text-center"
                type="number"
                value={item.qty}
                onChange={(e) => updateItem(item.id, "qty", e.target.value)}
              />
              {errors.itemErrors?.[item.id]?.qty && (
                <p className="text-red-500 text-sm">{errors.itemErrors[item.id].qty}</p>
              )}
            </div>

            <div className="col-span-4 md:col-span-2">
              <label className="md:hidden text-sm text-[#7E88C3] mb-1">
                Price
              </label>
              <input
                className="w-full border border-[#DFE3FA] rounded-md p-3 font-bold"
                type="number"
                value={item.price}
                onChange={(e) => updateItem(item.id, "price", e.target.value)}
              />
              {errors.itemErrors?.[item.id]?.price && (
                <p className="text-red-500 text-sm">{errors.itemErrors[item.id].price}</p>
              )}
            </div>

            <div className="col-span-3 md:col-span-2 text-[#7E88C3] font-bold">
                <label className="md:hidden text-sm text-[#7E88C3] mb-1">
                  Total
                </label>
                <div className="col-span-2 flex items-center font-bold text-gray-500">
              {item.total.toFixed(2)}
            </div>
              </div>

            

            <button
              onClick={() => removeItem(item.id)}
              className="col-span-2 md:col-span-1 text-[#888EB0] hover:text-red-500 transition-colors mt-6 md:mt-0 flex justify-center"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <button
          onClick={addItem}
          className="w-full mt-6 bg-[#F9FAFE] hover:bg-[#DFE3FA] text-[#7E88C3] font-bold py-4 rounded-full flex items-center justify-center transition-colors"
        >
          <Plus size={14} /> Add New Item
        </button>
      </section>

      {/* ================= TOTAL ================= */}
      {/* <div className="text-right font-bold text-lg mb-8">
        Total: ₦{invoice.total.toFixed(2)}
      </div> */}

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-between items-center pt-8 border-t border-[#DFE3FA]">
        <button onClick={onClose} className="bg-[#F9FAFE] text-[#7E88C3] font-bold py-4 px-6 rounded-full hover:bg-[#DFE3FA] transition-colors">Discard</button>

        <div className="flex gap-3">
          {
            mode !== 'edit' && (
              <button
            disabled={loading}
            onClick={() => saveInvoice("draft")}
            className="bg-[#373B53] text-[#888EB0] font-bold py-4 px-6 rounded-full hover:bg-[#0C0E1E] transition-colors"
          >
            Save Draft
          </button>
            )
          }
          {
            mode !== 'edit' && (
              <button
            disabled={loading}
            onClick={() => saveInvoice("pending")}
            className="bg-[#7C5DFA] text-white font-bold py-4 px-6 rounded-full hover:bg-[#9277FF] transition-colors"
          >
            {loading ? "Saving..." : "Save & Send"}
          </button>
            )
          }
          
          {mode === "edit" && (
            <button
              onClick={() => saveInvoice(invoice.status)}
              className="bg-purple-600 text-white px-6 py-2 rounded"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          )}
          
        </div>
      </div>
    </div>
  );
}

