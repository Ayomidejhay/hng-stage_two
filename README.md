A modern invoice management system built with Next.js App Router, Firebase Firestore, and a clean modular UI.
It supports full CRUD operations, status tracking, filtering, and dynamic routing using Firestore document IDs.

Features
✅ Create invoices (draft or sent)
✏️ Edit existing invoices
🗑️ Delete invoices with confirmation
💰 Automatic item subtotal + invoice total calculation
📊 Filter invoices by status (draft, pending, paid)
🔗 Dynamic routing with Firestore document IDs
⚡ Fast UI with Framer Motion animations
📱 Fully responsive design

🧠 Tech Stack
Next.js (App Router)
React
TypeScript
Firebase Firestore
Tailwind CSS
Framer Motion
Lucide Icons

Architecture Overview
🔄 Data Flow
Create Invoice
  Form → createInvoice() → Firestore addDoc()
Read Invoices
    getInvoices() → Firestore → UI mapping
View Invoice
  /invoices/[id] → getDoc(doc(db, "invoices", id))
Edit Invoice
  NewInvoice (edit mode) → updateDoc()
Delete Invoice
  deleteDoc(doc(db, "invoices", id))
