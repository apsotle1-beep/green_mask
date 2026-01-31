import ImageSequence from "@/components/ImageSequence";
import Navbar from "@/components/Navbar";
import ScrollSections from "@/components/ScrollSections";

export default function Home() {
  return (
    <main className="relative bg-botanic-deep min-h-screen">
      <Navbar />

      {/* Sticky Container for Animation */}
      <div className="relative">
        {/* The ImageContainer is fixed background behind everything */}
        <ImageSequence />

        {/* The Content Overlay that scrolls */}
        <ScrollSections />
      </div>
    </main>
  );
}
