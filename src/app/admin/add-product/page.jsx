import Wrapper from "../../../components/wrapper";
import AddItem from "../components/addItem";
export default function AddTaskPage() {
	return (
		<main>
			<Wrapper>
				<section className="text-center ">
					<AddItem />
				</section>
			</Wrapper>
		</main>
	);
}
