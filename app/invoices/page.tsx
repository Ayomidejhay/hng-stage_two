// "use client";

// import { useState, useEffect } from "react";
// import { Plus } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";
// import NewInvoice from "../components/NewInvoice";

// type InvoiceStatus = "draft" | "pending" | "paid";

// type Invoice = {
//   id: string;
//   client: string;
//   amount: number;
//   status: InvoiceStatus;
//   due: string;
// };

// const invoicesMock: Invoice[] = [
//   {
//     id: "XM9141",
//     client: "Alex Grim",
//     amount: 556.0,
//     status: "pending",
//     due: "20 Sep 2021",
//   },
//   {
//     id: "RT3080",
//     client: "Jensen Huang",
//     amount: 1800.9,
//     status: "paid",
//     due: "19 Aug 2021",
//   },
//   {
//     id: "RG0314",
//     client: "John Morrison",
//     amount: 14002.33,
//     status: "paid",
//     due: "01 Oct 2021",
//   },
//   {
//     id: "RT2080",
//     client: "Alysa Werner",
//     amount: 102.04,
//     status: "pending",
//     due: "12 Oct 2021",
//   },
//   {
//     id: "AA1449",
//     client: "Melissa Clarke",
//     amount: 4032.33,
//     status: "pending",
//     due: "14 Oct 2021",
//   },
//   {
//     id: "TY9141",
//     client: "Thomas Wayne",
//     amount: 6155.91,
//     status: "pending",
//     due: "31 Oct 2021",
//   },
//   {
//     id: "FV2353",
//     client: "Anita Wainwright",
//     amount: 3102.04,
//     status: "draft",
//     due: "12 Nov 2021",
//   },
// ];

// const statusStyles: Record<InvoiceStatus, string> = {
//   paid: "bg-green-100 text-green-600",
//   pending: "bg-orange-100 text-orange-600",
//   draft: "bg-gray-200 text-gray-600",
// };

// const statusOptions: InvoiceStatus[] = ["draft", "pending", "paid"];

// const Page = () => {
//   const [openFilter, setOpenFilter] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const [filters, setFilters] = useState<Record<InvoiceStatus, boolean>>({
//     draft: false,
//     pending: true,
//     paid: false,
//   });

//   /* ================= ESC KEY HANDLER ================= */
//   useEffect(() => {
//     if (!showModal) return;

//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         setShowModal(false);
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [showModal]);

//   /* ================= LOGIC ================= */

//   const filteredInvoices = invoicesMock.filter((inv) => {
//     if (!filters.draft && !filters.pending && !filters.paid) return true;
//     return filters[inv.status];
//   });

//   const toggleFilter = (key: InvoiceStatus) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   return (
//     <div>
//       <main className="p-10 max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold">Invoices</h1>
//             <p className="text-gray-400 text-sm">
//               There are {filteredInvoices.length} total invoices
//             </p>
//           </div>

//           <div className="flex items-center gap-6 relative">
//             {/* Filter */}
//             <div className="relative">
//               <button
//                 onClick={() => setOpenFilter((prev) => !prev)}
//                 className="text-sm font-medium flex items-center gap-2"
//               >
//                 Filter by status
//                 <span className="text-purple-500">▾</span>
//               </button>

//               <AnimatePresence>
//                 {openFilter && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className="absolute right-0 mt-3 bg-white shadow-lg rounded-xl p-4 w-40 z-10"
//                   >
//                     {statusOptions.map((status) => (
//                       <label
//                         key={status}
//                         className="flex items-center gap-2 mb-2"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={filters[status]}
//                           onChange={() => toggleFilter(status)}
//                         />
//                         <span className="capitalize">{status}</span>
//                       </label>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* New Invoice */}

//             <button
//               onClick={() => setShowModal(true)}
//               className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full"
//             >
//               <span className="bg-white text-purple-600 p-1 rounded-full">
//                 <Plus size={16} />
//               </span>
//               New Invoice
//             </button>
//           </div>
//         </div>

//         {/* List */}
//         <div className="space-y-4">
//           {filteredInvoices.map((inv) => (
//             <div
//               key={inv.id}
//               className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border hover:border-purple-500 transition"
//             >
//               <div className="flex items-center gap-6">
//                 <p className="font-bold text-sm">#{inv.id}</p>
//                 <p className="text-gray-400 text-sm">Due {inv.due}</p>
//                 <p className="text-gray-500 text-sm">{inv.client}</p>
//               </div>

//               <div className="flex items-center gap-6">
//                 <p className="font-bold">£ {inv.amount.toLocaleString()}</p>

//                 <span
//                   className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[inv.status]}`}
//                 >
//                   {inv.status}
//                 </span>

//                 <span className="text-purple-500">›</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>

//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             {/* backdrop click */}
//             <div
//               className="absolute inset-0"
//               onClick={() => setShowModal(false)}
//             />

//             {/* modal panel */}
//             <motion.div
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ type: "tween" }}
//               className="relative z-50"
//             >
//               <NewInvoice onClose={() => setShowModal(false)} />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Page;


"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NewInvoice from "../components/NewInvoice";
import { getInvoices } from "../lib/invoices";
import Link from "next/link";
import { doc } from "firebase/firestore";

/**
 * ===========================
 * TYPES
 * ===========================
 */
type InvoiceStatus = "draft" | "pending" | "paid";

type Invoice = {
  id: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  due: string;
};

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-green-100 text-green-600",
  pending: "bg-orange-100 text-orange-600",
  draft: "bg-gray-200 text-gray-600",
};

const statusOptions: InvoiceStatus[] = ["draft", "pending", "paid"];

const Page = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [filters, setFilters] = useState<Record<InvoiceStatus, boolean>>({
    draft: true,
    pending: true,
    paid: true,
  });

  /**
   * ===========================
   * FETCH FROM FIREBASE
   * ===========================
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInvoices();

        // 🔄 transform Firestore → UI shape
        const mapped: Invoice[] = data.map((doc) => ({
          id: doc.id,
          client: doc.billTo?.clientName || "Unknown",
          amount: doc.total || 0,
          status: doc.status || "draft",
          due: doc.invoiceDueDate || "",
        }));

        setInvoices(mapped);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * ===========================
   * ESC KEY HANDLER
   * ===========================
   */
  useEffect(() => {
    if (!showModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  /**
   * ===========================
   * FILTER LOGIC
   * ===========================
   */
  const filteredInvoices = invoices.filter((inv) => {
    if (!filters.draft && !filters.pending && !filters.paid) return true;
    return filters[inv.status];
  });

  const toggleFilter = (key: InvoiceStatus) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  return (
    <div>
      <main className="p-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-gray-400 text-sm">
              {loading
                ? "Loading..."
                : `There are ${filteredInvoices.length} total invoices`}
            </p>
          </div>

          <div className="flex items-center gap-6 relative">
            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setOpenFilter((prev) => !prev)}
                className="text-sm font-medium flex items-center gap-2"
              >
                Filter by status
                <span className="text-purple-500">▾</span>
              </button>

              <AnimatePresence>
                {openFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 bg-white shadow-lg rounded-xl p-4 w-40 z-10"
                  >
                    {statusOptions.map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 mb-2"
                      >
                        <input
                          type="checkbox"
                          checked={filters[status]}
                          onChange={() => toggleFilter(status)}
                        />
                        <span className="capitalize">{status}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* New Invoice */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full"
            >
              <span className="bg-white text-purple-600 p-1 rounded-full">
                <Plus size={16} />
              </span>
              New Invoice
            </button>
          </div>
        </div>

        {/* ================= LIST ================= */}
        <div className="space-y-4">
          {loading && <p className="text-gray-400">Loading invoices...</p>}

          {!loading && filteredInvoices.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              No invoices found
            </p>
          )}

          {filteredInvoices.map((inv) => (
            <Link href={`/invoices/${inv.id}`}
              key={inv.id}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border hover:border-purple-500 transition"
            >
              <div className="flex items-center gap-6">
                <p className="font-bold text-sm uppercase">#{inv.id.slice(0, 5)}</p>
                <p className="text-gray-400 text-sm">
                  Due {formatDate(inv.due)}
                </p>
                <p className="text-gray-500 text-sm">{inv.client}</p>
              </div>

              <div className="flex items-center gap-6">
                <p className="font-bold">
                  £ {inv.amount.toLocaleString()}
                </p>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[inv.status]}`}
                >
                  {inv.status}
                </span>

                <span className="text-purple-500">›</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* backdrop */}
            <div
              className="absolute inset-0"
              onClick={() => setShowModal(false)}
            />

            {/* modal panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className="relative z-50"
            >
              <NewInvoice onClose={() => setShowModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;