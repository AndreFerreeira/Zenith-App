
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
import { firestore } from "@/firebase";
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
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathOrQueryOrRef === null || pathOrQueryOrRef === undefined) {
      setData([]);
      setIsLoading(false);
      return;
    }
    
    // Since we removed authentication, we can't listen to user-specific collections.
    // This hook will now only work for public collections or not at all.
    // For now, we'll just return an empty array.
    setData([]);
    setIsLoading(false);
    
  }, [pathOrQueryOrRef, options.listen]);

  return { data, isLoading };
}
