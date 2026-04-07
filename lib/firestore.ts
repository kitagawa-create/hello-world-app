"use client";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  limit,
  writeBatch,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// ===== Types =====
export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface Loan {
  id: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  loanDate: string;
  returnedProcessed: boolean;
  createdAt: unknown;
  updatedAt: unknown;
}

// ===== Books =====
export function subscribeBooks(callback: (books: Book[]) => void) {
  const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Book)));
  });
}

export async function addBook(data: { title: string; author: string; price: number; stock: number }) {
  await addDoc(collection(db, "books"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateBook(id: string, data: { title: string; author: string; price: number; stock: number }) {
  await updateDoc(doc(db, "books", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBook(id: string) {
  await deleteDoc(doc(db, "books", id));
}

// ===== Loans =====
export function subscribeLoans(callback: (loans: Loan[]) => void) {
  const q = query(collection(db, "loans"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Loan)));
  });
}

export function subscribeRecentLoans(count: number, callback: (loans: Loan[]) => void) {
  const q = query(collection(db, "loans"), orderBy("createdAt", "desc"), limit(count));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Loan)));
  });
}

export async function addLoan(data: { userName: string; bookId: string; bookTitle: string; loanDate: string }) {
  const bookRef = doc(db, "books", data.bookId);
  const bookSnap = await getDoc(bookRef);
  if (!bookSnap.exists()) throw new Error("書籍が見つかりません");
  const bookData = bookSnap.data();
  if ((bookData.stock ?? 0) <= 0) throw new Error("在庫がありません");

  const batch = writeBatch(db);
  const loanRef = doc(collection(db, "loans"));
  batch.set(loanRef, {
    ...data,
    returnedProcessed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.update(bookRef, {
    stock: (bookData.stock ?? 0) - 1,
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
}

export async function returnLoan(loanId: string) {
  const loanRef = doc(db, "loans", loanId);
  const loanSnap = await getDoc(loanRef);
  if (!loanSnap.exists()) return;
  const loanData = loanSnap.data() as Loan;
  if (loanData.returnedProcessed) return;

  const batch = writeBatch(db);
  batch.update(loanRef, {
    returnedProcessed: true,
    updatedAt: serverTimestamp(),
  });

  const bookRef = doc(db, "books", loanData.bookId);
  const bookSnap = await getDoc(bookRef);
  if (bookSnap.exists()) {
    batch.update(bookRef, {
      stock: (bookSnap.data().stock ?? 0) + 1,
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
}

export async function deleteLoan(loanId: string) {
  const loanRef = doc(db, "loans", loanId);
  const loanSnap = await getDoc(loanRef);
  if (!loanSnap.exists()) {
    await deleteDoc(loanRef);
    return;
  }
  const loanData = loanSnap.data() as Loan;

  // まだ返却されてない場合は在庫を戻す
  if (!loanData.returnedProcessed) {
    const bookRef = doc(db, "books", loanData.bookId);
    const bookSnap = await getDoc(bookRef);
    if (bookSnap.exists()) {
      const batch = writeBatch(db);
      batch.update(bookRef, {
        stock: (bookSnap.data().stock ?? 0) + 1,
        updatedAt: serverTimestamp(),
      });
      batch.delete(loanRef);
      await batch.commit();
      return;
    }
  }

  await deleteDoc(loanRef);
}
