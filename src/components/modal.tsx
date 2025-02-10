import { X } from "lucide-react";

interface ModalProps {
	children: React.ReactNode;
	onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-md">
				<div className="relative">
					<button
						onClick={onClose}
						className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-800"
					>
						<X size={20} />
					</button>
					{children}
				</div>
			</div>
		</div>
	);
};
export default Modal;
