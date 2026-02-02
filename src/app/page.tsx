import Image from 'next/image';
import SolarSystem from './components/SolarSystem';
import galaxy from '@/assets/galaxy.webp';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center gap-52 text-white px-40 py-28 pl-64">
      <SolarSystem />
      <div>
        <div className="flex items-center justify-center gap-8">
          <Image
            className="h-32 w-auto select-none"
            src={galaxy}
            alt="galaxy icon"
            width={512}
            height={512}
          />
          <h1 className="text-6xl leading-tight">
            Explore the Universe of Web Development
          </h1>
        </div>
        <p className="text-3xl mt-12">
          Start your journey through the cosmos of code — one planet at a time.
        </p>
        <p className="text-3xl mt-7">
          Learn the building blocks of the web — HTML, CSS, and JavaScript —
          through interactive planets, visual guides, and hands-on examples made
          for absolute beginners.
        </p>
      </div>
    </main>
  );
}
