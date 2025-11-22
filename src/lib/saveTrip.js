"use client";

import { db, auth } from "@/firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function saveTripForm(form) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  // Path: users/{uid}/tripRequests/{autoId}
  const ref = collection(db, `users/${user.uid}/tripRequests`);

  const savedDoc = await addDoc(ref, {
    ...form,
    createdAt: serverTimestamp(),
  });

  return savedDoc.id;
}
