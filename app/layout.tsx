import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'PetWorld – Premium Pet Supplies | Happy Pets. Healthy Life.',
  description: 'Premium quality pet supplies, nutritious food, interactive toys, orthopedic beds, and grooming essentials for dogs, cats, birds, fish, and small pets.',
  openGraph: {
    title: 'PetWorld – Premium Pet Supplies | Happy Pets. Healthy Life.',
    description: 'Premium quality pet supplies, nutritious food, interactive toys, orthopedic beds, and grooming essentials.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetWorld – Premium Pet Supplies',
    description: 'Premium quality pet products for your furry friends.',
  },
};

import { PetWorldProviders } from '@/PetWorld/FrontEnd/components/PetWorldProviders';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#fbf9f4] text-stone-900 antialiased selection:bg-[#277438] selection:text-white">
        <PetWorldProviders>{children}</PetWorldProviders>
      </body>
    </html>
  );
}
