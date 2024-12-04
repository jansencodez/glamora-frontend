import CountdownSection from "@/components/homepage/CountDownSection";
import FeaturedBrandsSection from "@/components/homepage/FeaturedBrandsSection";
import FeaturedProductsSection from "@/components/homepage/FeaturedProductsSection";
import HeroSection from "@/components/homepage/HeroSection";
import NewsletterSignupSection from "@/components/homepage/NewsletterSignUpSection";
import TestimonialCarousel from "@/components/homepage/TestimonialCarousel";
import WhyChooseUsSection from "@/components/homepage/WhyChooseUsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 main">
      <HeroSection />

      <FeaturedProductsSection />
      <WhyChooseUsSection />
      <NewsletterSignupSection />
      <FeaturedBrandsSection />
      <TestimonialCarousel />
      <CountdownSection />
    </div>
  );
}
