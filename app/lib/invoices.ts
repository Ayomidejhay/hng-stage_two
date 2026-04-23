// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "./firebase";
// import type { Invoice } from "../types";

// export const invoicesRef = collection(db, "invoices");

// /**
//  * CREATE invoice
//  */
// // export const createInvoice = async (data: any) => {
// //   return await addDoc(invoicesRef, {
// //     ...data,
// //     createdAt: serverTimestamp(),
// //   });
// // };
// // export const createInvoice = async (data: Invoice) => {
// //   return await addDoc(invoicesRef, {
// //     ...data,
// //     createdAt: serverTimestamp(),
// //   });
// // };

// export const createInvoice = async (data: Invoice) => {
//   try {
//     const res = await addDoc(invoicesRef, {
//       ...data,
//       createdAt: serverTimestamp(),
//     });

//     console.log("Invoice created:", res.id);
//     return res;
//   } catch (err) {
//     console.error("Firestore createInvoice error:", err);
//     throw err;
//   }
// };

// /**
//  * GET all invoices
//  */
// export const getInvoices = async () => {
//   const snapshot = await getDocs(invoicesRef);

//   return snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// };

// /**
//  * DELETE invoice
//  */
// export const deleteInvoice = async (id: string) => {
//   await deleteDoc(doc(db, "invoices", id));
// };

// lib/invoices.ts

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Invoice } from "../types";

export const invoicesRef = collection(db, "invoices");

/**
 * CREATE invoice
 */
// export const createInvoice = async (data: Invoice) => {
//   try {
//     // 🔥 Remove undefined values (Firestore-safe)
//     const cleanData = JSON.parse(JSON.stringify(data));

//     const res = await addDoc(invoicesRef, {
//       ...cleanData,
//       createdAt: serverTimestamp(),
//     });

//     console.log("✅ Invoice created:", res.id);
//     return res;
//   } catch (err) {
//     console.error("❌ Firestore createInvoice error:", err);
//     throw err;
//   }
// };
export const createInvoice = async (data: Invoice) => {
  try {
    const { id, ...cleanData } = JSON.parse(JSON.stringify(data));

    const res = await addDoc(invoicesRef, {
      ...cleanData,
      createdAt: serverTimestamp(),
    });

    return res.id;
  } catch (err) {
    console.error("Firestore error:", err);
    throw err;
  }
};

/**
 * GET all invoices
 */
// export const getInvoices = async (): Promise<Invoice[]> => {
//   const snapshot = await getDocs(invoicesRef);

//   return snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as Invoice[];
// };
export const getInvoices = async (): Promise<Invoice[]> => {
  const snapshot = await getDocs(invoicesRef);

  return snapshot.docs.map((d) => {
    const data = d.data() as Omit<Invoice, "id">;

    return {
      id: d.id,
      ...data,
    };
  });
};

/**
 * DELETE invoice
 */
export const deleteInvoice = async (id: string) => {
  await deleteDoc(doc(db, "invoices", id));
};