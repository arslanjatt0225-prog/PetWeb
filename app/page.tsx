import { Navbar } from '@/PetWorld/FrontEnd/components/Navbar';
import { HeroSection } from '@/PetWorld/FrontEnd/components/HeroSection';
import { CategorySection } from '@/PetWorld/FrontEnd/components/CategorySection';
import { PromoBanner } from '@/PetWorld/FrontEnd/components/PromoBanner';
import { BestSellers } from '@/PetWorld/FrontEnd/components/BestSellers';
import { AboutAndNewsletter } from '@/PetWorld/FrontEnd/components/AboutAndNewsletter';
import { Testimonials } from '@/PetWorld/FrontEnd/components/Testimonials';
import { Footer } from '@/PetWorld/FrontEnd/components/Footer';
import { getProducts } from '@/PetWorld/Backend/controllers';

export default async function HomePage() {
  const products = await getProducts({ bestSeller: true });

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      {/* 1. Header & Navigation */}
      <Navbar />

      {/* Main Homepage Sections matching screenshot */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Shop by Category (7 categories) */}
        <CategorySection />

        {/* 4. Premium Care Promotional Banner */}
        <PromoBanner />

        {/* 5. Our Best Sellers / Popular Pet Products (6 items) */}
        <BestSellers products={products} />

        {/* 6. About PetWorld & Newsletter split cards */}
        <AboutAndNewsletter />

        {/* 7. Customer Testimonials */}
        <Testimonials />
      </main>

      {/* 8. Dark Forest Green Footer */}
      <Footer />
    </div>
  );
}
