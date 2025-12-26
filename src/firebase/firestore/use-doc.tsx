"use client";

import { useState, useEffect } from "react";
import { onSnapshot, doc, type DocumentReference } from "firebase/firestore";
import { useFirestore } from "../provider";
import { errorEmitter } from "../error-emitter";
import { FirestorePermissionError } from "../errors";

interface UseDocOptions {
  listen?: boolean;
}

export function useDoc<T>(
  path: string | null | undefined,
  options?: UseDocOptions
): { data: T | null; isLoading: boolean };
export function useDoc<T>(
  ref: DocumentReference<T> | null | undefined,
  options?: UseDocOptions
): { data: T | null; isLoading: boolean };

export function useDoc<T>(
  pathOrRef: string | DocumentReference<T> | null | undefined,
  options: UseDocOptions = { listen: true }
): { data: T | null; isLoading: boolean } {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathOrRef === null || pathOrRef === undefined) {
      setData(null);
      setIsLoading(false);
      return;
    }

    let unsubscribe: () => void;
    try {
        const docRef = typeof pathOrRef === "string"
            ? doc(firestore, pathOrRef) as DocumentReference<T>
            : pathOrRef;

        if (options.listen) {
            unsubscribe = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setData({ ...doc.data(), id: doc.id } as T);
                } else {
                    setData(null);
                }
                setIsLoading(false);
            }, (error) => {
                console.error("Error in useDoc listener:", error);
                const permissionError = new FirestorePermissionError({
                    path: docRef.path,
                    operation: 'get',
                });
                errorEmitter.emit('permission-error', permissionError);
                setIsLoading(false);
                setData(null);
            });
        } else {
            // Not implemented: one-time fetch
            setIsLoading(false);
        }
    } catch(error) {
        console.error("Error setting up useDoc:", error);
        setIsLoading(false);
        setData(null);
    }

    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
  }, [pathOrRef, options.listen]);

  return { data, isLoading };
}
