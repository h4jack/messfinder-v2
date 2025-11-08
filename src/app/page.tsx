import { Header } from "@/components/layout";
import FloatingSearch from "@/components/section/FloatingSearch";
import HomeSearch from "@/components/section/HomeSearch";

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-br from-teal-50 to-white min-h-screen">
        <Header />
        <HomeSearch />
      </div>
    </>
  );
}
