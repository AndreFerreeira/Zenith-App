
"use client";

import { useState, useEffect } from "react";
import { onSnapshot, doc, type DocumentReference } from "firebase/firestore";
import { firestore } from "@/firebase";
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
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathOrRef === null || pathOrRef === undefined) {
      setData(null);
      setIsLoading(false);
      return;
    }

    // Since we removed authentication, we can't listen to user-specific documents.
    // This hook will now only work for public documents or not at all.
    // For now, we'll just return null.
    setData(null);
    setIsLoading(false);
    
  }, [pathOrRef, options.listen]);

  return { data, isLoading };
}
