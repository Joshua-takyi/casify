
import HeroSection from "@/app/(with-nav)/components/hero";
import Category from "@/app/(with-nav)/components/category";



export default function HomePage() {
	return (
		<main  className={`@container`}>
			<HeroSection/>
			<Category/>
		</main>
	);
}
