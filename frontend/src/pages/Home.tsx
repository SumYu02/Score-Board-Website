import { Navbar } from "@/components/Navbar";

export function Home() {
  return (
    <div className="w-full min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col w-full p-8">
        <div className="bg-red-500 text-white p-4">Tailwind test</div>
      </div>
    </div>
  );
}
