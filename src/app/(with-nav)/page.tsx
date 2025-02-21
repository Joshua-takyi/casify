import HeroSection from "@/app/(with-nav)/components/hero";
import Category from "@/app/(with-nav)/components/category";
import FeaturedProducts from "./components/featuredProducts";
// import Testimonials from "./components/testimonials";
import BudCases from "./components/airpodCases";
import PowerSection from "./components/power";
import { StrapsSection } from "./components/straps";
import IphoneCaseSection from "./components/iphoneCases";
import GalaxyCaseSection from "./components/galaxyCases";

export default function HomePage() {
	return (
		<main>
			<HeroSection />
			<Category />
			<FeaturedProducts />
			<IphoneCaseSection />
			<GalaxyCaseSection />
			<BudCases />
			<StrapsSection />
			<PowerSection />
			{/* <Testimonials /> */}
		</main>
	);
}
