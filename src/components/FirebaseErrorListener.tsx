'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In a development environment, we throw the error to make it visible
      // in the Next.js error overlay. This provides maximum visibility for debugging.
      if (process.env.NODE_ENV === 'development') {
        console.error("Caught Firestore Permission Error:", error.message);
        // We throw it so Next.js can catch it and display the overlay.
        // This is intentional for a better DX.
        throw error;
      } else {
        // In production, you might want to log this to a service like Sentry
        // or display a generic error message to the user.
        console.error(error);
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  // This component does not render anything itself.
  return null;
}
