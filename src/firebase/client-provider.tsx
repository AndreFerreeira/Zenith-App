'use client';

import {useState, useEffect} from 'react';
import {FirebaseProvider, initializeFirebase, type FirebaseContextValue} from '.';

export function FirebaseClientProvider({children}: {children: React.ReactNode}) {
  const [firebase, setFirebase] = useState<FirebaseContextValue | null>(null);

  useEffect(() => {
    const instances = initializeFirebase();
    setFirebase(instances);
  }, []);

  if (!firebase) {
    return null; // Or a loading spinner
  }

  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}
