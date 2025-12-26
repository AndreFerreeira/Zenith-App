
"use client";

import { useState, useEffect } from "react";
import {
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  type CollectionReference,
  type Query,
  type DocumentData,
} from "firebase/firestore";
import { firestore } from "@/firebase";
import { errorEmitter } from "../error-emitter";
import { FirestorePermissionError } from "../errors";

interface UseCollectionOptions {
  listen?: boolean;
}

export function useCollection<T extends DocumentData>(
  pathOrQueryOrRef: string | Query<T> | CollectionReference<T> | null | undefined,
  options: UseCollectionOptions = { listen: true }
): { data: (T & { id: string })[] | null; isLoading: boolean } {
  const [data, setData] = useState<(T & { id: string })[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!pathOrQueryOrRef) {
      setData([]);
      setIsLoading(false);
      return;
    }

    let q: Query<T> | CollectionReference<T>;

    if (typeof pathOrQueryOrRef === "string") {
      q = collection(firestore, pathOrQueryOrRef) as CollectionReference<T>;
    } else {
      q = pathOrQueryOrRef;
    }

    if (options.listen) {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(docs);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error listening to collection:", error);
          if (error.code === 'permission-denied') {
             errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: 'path' in q ? q.path : 'unknown', // Simplified path
                operation: 'list'
            }));
          }
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
       getDocs(q).then(snapshot => {
         const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(docs);
          setIsLoading(false);
       }).catch(error => {
          console.error("Error getting collection:", error);
           if (error.code === 'permission-denied') {
             errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: 'path' in q ? q.path : 'unknown',
                operation: 'list'
            }));
          }
          setIsLoading(false);
       });
    }
  }, [pathOrQueryOrRef, options.listen]);

  return { data, isLoading };
}
