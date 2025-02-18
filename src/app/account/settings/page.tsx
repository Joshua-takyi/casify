"use client";
import Wrapper from "@/components/wrapper";
import { ProfileTabs } from "../components/tabs";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { GetUserInfo } from "@/server/action";

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

// Define the type for the API response
type ProfileResponse = {
	success: boolean;
	message: string;
	data: Array<{ userInfo: typeof defaultProfile }>;
};

export default function Profile() {
	const [avatarPreview] = useState<string | null>(null);

	const { data, isLoading } = useQuery<ProfileResponse>({
		queryKey: ["profile"],
		queryFn: async () => {
			const res = await GetUserInfo();
			// If res is undefined or its data is undefined, return a default structure:
			if (!res || !res.data) {
				return {
					success: false,
					message: "No data",
					data: [{ userInfo: defaultProfile }],
				};
			}
			return res.data;
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
									{profile.firstName?.slice(4, 1).toUpperCase() || "J"}
								</div>
							)}
						</div>
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
