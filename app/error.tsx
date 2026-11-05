'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-bold text-stone-900">Something went wrong!</h2>
      <p className="mt-2 text-stone-600">Please try again or return to the homepage.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-full bg-[#277438] px-6 py-2.5 font-semibold text-white shadow-md hover:bg-[#1e5c2b] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
