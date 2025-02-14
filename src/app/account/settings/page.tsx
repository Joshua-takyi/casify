"use client";
import Wrapper from "@/components/wrapper";
import { ProfileTabs } from "../components/tabs";
import { Camera, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};
	return (
		<main className="min-h-screen bg-gray-50 py-10">
			<Wrapper>
				<div className="mb-8 flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-8 md:space-y-0">
					{/* Avatar Section */}
					<div className="relative">
						<div className="h-32 w-32 overflow-hidden rounded-full bg-gray-200">
							{avatarPreview ? (
								<Image
									width={300}
									height={300}
									src={avatarPreview}
									alt="Profile"
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full items-center justify-center text-2xl font-semibold text-gray-400">
									JD
								</div>
							)}
						</div>
						<label
							htmlFor="avatar-upload"
							className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-white p-2 shadow-sm transition-colors hover:bg-gray-50"
						>
							<Camera className="h-5 w-5 text-gray-600" />
							<input
								type="file"
								id="avatar-upload"
								className="hidden"
								accept="image/*"
								onChange={handleAvatarChange}
							/>
						</label>
					</div>

					{/* Name and Location */}
					<div className="text-center md:text-left">
						<h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
						<div className="mt-2 flex items-center justify-center space-x-2 md:justify-start">
							<MapPin className="h-4 w-4 text-gray-500" />
							<span className="text-sm text-gray-600">New York, USA</span>
						</div>
						<div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
							<Badge variant="secondary">Premium Member</Badge>
							<Badge variant="secondary">Since 2023</Badge>
						</div>
					</div>
				</div>
				<ProfileTabs />
			</Wrapper>
		</main>
	);
}
