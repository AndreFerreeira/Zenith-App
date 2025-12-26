
"use client";

import { useState, useEffect } from "react";
import { onSnapshot, doc, type DocumentReference, type DocumentData, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import { errorEmitter } from "../error-emitter";
import { FirestorePermissionError } from "../errors";

interface UseDocOptions {
  listen?: boolean;
}

export function useDoc<T extends DocumentData>(
  pathOrRef: string | DocumentReference<T> | null | undefined,
  options: UseDocOptions = { listen: true }
): { data: (T & { id: string }) | null; isLoading: boolean } {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!pathOrRef) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const docRef = typeof pathOrRef === 'string' ? doc(firestore, pathOrRef) as DocumentReference<T> : pathOrRef;

    if (options.listen) {
      const unsubscribe = onSnapshot(docRef, 
        (docSnap) => {
          if (docSnap.exists()) {
            setData({ id: docSnap.id, ...docSnap.data() });
          } else {
            setData(null);
          }
          setIsLoading(false);
        },
        (error) => {
          console.error(`Error listening to doc:`, error);
          if (error.code === 'permission-denied') {
             errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: docRef.path,
                operation: 'get'
            }));
          }
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setData(null);
        }
        setIsLoading(false);
      }).catch(error => {
        console.error(`Error getting doc:`, error);
        if (error.code === 'permission-denied') {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: docRef.path,
              operation: 'get'
          }));
        }
        setIsLoading(false);
      });
    }
  }, [pathOrRef, options.listen]);

  return { data, isLoading };
}
