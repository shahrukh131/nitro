import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './sections/Hero';
import { Products } from './sections/Products';
import { Story } from './sections/Story';

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[100] -translate-y-[200%] bg-accent px-4 py-2 font-medium text-ink focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Story />
        <Products />
      </main>
      <Footer />
    </>
  );
}
