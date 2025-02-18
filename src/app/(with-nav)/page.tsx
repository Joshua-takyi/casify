import HeroSection from "@/app/(with-nav)/components/hero";
import Category from "@/app/(with-nav)/components/category";
import Promotion from "./components/newGoods";
import FeaturedProducts from "./components/featuredProducts";

export default function HomePage() {
	return (
		<main className="@container space-y-16">
			<HeroSection />
			<Category />
			<Promotion />
			<FeaturedProducts />
		</main>
	);
}
