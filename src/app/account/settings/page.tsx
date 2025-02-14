"use client";
import Wrapper from "@/components/wrapper";
import { ProfileTabs } from "../components/tabs";
import { Camera, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultProfile = {
	firstName: "John",
	lastName: "Doe",
	phone: "+233000000000",
	email: "john.doe@example.com",
	city: "Accra",
	streetAddress: "1234 Sample Street",
	region: "Greater Accra",
	ghanaPost: "GA-000-0000",
};

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

	const { data, isLoading } = useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			try {
				const res = await axios.get(`${API_URL}/profile/get-info`, {
					withCredentials: true,
				});
				if (res.status !== 200) {
					throw new Error("Failed to get data");
				}
				return res.data;
			} catch (error: unknown) {
				if (axios.isAxiosError(error)) {
					// You can return a uniform error object
					return {
						success: false,
						message:
							error.response?.data?.message ||
							"Failed to get data (Axios error)",
						data: null,
					};
				}
				// Non-Axios error fallback
				return {
					success: false,
					message: "Failed to get data",
					data: null,
				};
			}
		},
	});

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 py-10">
				<Wrapper>
					<div>Loading profile...</div>
				</Wrapper>
			</div>
		);
	}

	const profile = data?.data?.[0]?.userInfo || defaultProfile;

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
									{profile.firstName?.charAt(0) || "J"}
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

					{/* Name and Location Section */}
					<div className="text-center md:text-left">
						<h1 className="text-2xl font-bold text-gray-900">
							{profile.firstName} {profile.lastName}
						</h1>
						<div className="mt-2 flex items-center justify-center space-x-2 md:justify-start">
							<MapPin className="h-4 w-4 text-gray-500" />
							<span className="text-sm text-gray-600">
								{profile.city}, {profile.region}
							</span>
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
