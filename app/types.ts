// // export type InvoiceStatus = "draft" | "pending" | "paid";

// // export type InvoiceItem = {
// //   id: string;
// //   name: string;
// //   qty: number;
// //   price: number;
// //   total: number;
// // };

// // export type Address = {
// //   street: string;
// //   city: string;
// //   postCode: string;
// //   country: string;
// // };

// // export type Invoice = {
// //   id: string;

// //   createdAt: string;
// //   paymentDue: string;
// //   paymentTerms: "Net 14 Days" | "Net 30 Days";

// //   description: string;

// //   clientName: string;
// //   clientEmail: string;

// //   senderAddress: Address;
// //   clientAddress: Address;

// //   items: InvoiceItem[];

// //   subtotal: number;
// //   total: number;

// //   status: InvoiceStatus;
// // };

// export type Item = {
//   id: string;
//   name: string;
//   qty: number;
//   price: number;
//   total: number;
// };

// export type BillFrom = {
//   street: string;
//   city: string;
//   postCode: string;
//   country: string;
// };

// export type BillTo = {
//   clientName: string;
//   clientEmail: string;
//   street: string;
//   city: string;
//   postCode: string;
//   country: string;
// };

// export type Invoice = {
//     id?: string;
//   billFrom: BillFrom;
//   billTo: BillTo;
//   invoiceDate: string;
//   paymentTerms: string;
//   description: string;
//   items: Item[];
//   total: number;
//   status: "draft" | "pending"| "paid";
// };

// export type InvoiceSection = "billFrom" | "billTo";

// types/invoice.ts

export type InvoiceStatus = "draft" | "pending" | "paid";

export type Item = {
  id: string;
  name: string;
  qty: number;
  price: number;
  total: number;
};

export type Address = {
  street: string;
  city: string;
  postCode: string;
  country: string;
};

export type BillTo = Address & {
  clientName: string;
  clientEmail: string;
};

export type Invoice = {
  id: string;
  billFrom: Address;
  billTo: BillTo;
  invoiceDueDate: string;
  paymentTerms: string;
  description: string;
  items: Item[];
  total: number;
  status: InvoiceStatus;
  createdAt?: unknown; // Firestore timestamp
};