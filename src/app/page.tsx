import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ChatInterface from "@/components/ChatInterface";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ChatInterface />
      <HowItWorks />
      <Footer />
    </main>
  );
}
