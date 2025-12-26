"use client";

import { useState, useEffect } from "react";
import {
  onSnapshot,
  collection,
  query,
  where,
  type CollectionReference,
  type Query,
} from "firebase/firestore";
import { useFirestore } from "../provider";
import { errorEmitter } from "../error-emitter";
import { FirestorePermissionError } from "../errors";

interface UseCollectionOptions {
  listen?: boolean;
}

export function useCollection<T>(
  path: string | null | undefined,
  options?: UseCollectionOptions
): { data: T[] | null; isLoading: boolean };
export function useCollection<T>(
  query: Query<T> | null | undefined,
  options?: UseCollectionOptions
): { data: T[] | null; isLoading: boolean };
export function useCollection<T>(
  ref: CollectionReference<T> | null | undefined,
  options?: UseCollectionOptions
): { data: T[] | null; isLoading: boolean };

export function useCollection<T>(
  pathOrQueryOrRef: string | Query<T> | CollectionReference<T> | null | undefined,
  options: UseCollectionOptions = { listen: true }
): { data: T[] | null; isLoading: boolean } {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathOrQueryOrRef === null || pathOrQueryOrRef === undefined) {
      setData([]);
      setIsLoading(false);
      return;
    }
    
    let unsubscribe: () => void;

    try {
      let queryToWatch: Query<T> | CollectionReference<T>;

      if (typeof pathOrQueryOrRef === "string") {
        queryToWatch = collection(firestore, pathOrQueryOrRef) as CollectionReference<T>;
      } else {
        queryToWatch = pathOrQueryOrRef;
      }

      if (options.listen) {
        unsubscribe = onSnapshot(
          queryToWatch,
          (snapshot) => {
            const data = snapshot.docs.map(
              (doc) => ({ ...doc.data(), id: doc.id } as T)
            );
            setData(data);
            setIsLoading(false);
          },
          (error) => {
            console.error("Error in useCollection listener:", error);
            const permissionError = new FirestorePermissionError({
                path: 'path' in queryToWatch ? queryToWatch.path : 'unknown',
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setIsLoading(false);
            setData(null);
          }
        );
      } else {
        // Not implemented: one-time fetch
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error setting up useCollection:", error);
      setIsLoading(false);
      setData(null);
    }
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [pathOrQueryOrRef, options.listen]);

  return { data, isLoading };
}
