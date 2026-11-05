import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-extrabold text-[#277438]">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-stone-900">Page Not Found</h2>
      <p className="mt-2 text-stone-600 max-w-md">
        Sorry, we couldn&apos;t find the pet supplies page you are looking for. Let&apos;s get you back to the pack!
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#277438] px-6 py-3 font-semibold text-white shadow-md hover:bg-[#1e5c2b] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
