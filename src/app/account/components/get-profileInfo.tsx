import Wrapper from "@/components/wrapper";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	EnvelopeIcon,
	PhoneIcon,
	MapPinIcon,
	HomeIcon,
	TagIcon,
	ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UserInfo {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	city: string;
	streetAddress: string;
	region: string;
	ghanaPost: string;
}

interface ProfileData {
	userInfo: UserInfo;
	_id: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

interface ApiResponse {
	message: string;
	data: ProfileData[];
}

export const GetProfileInfo = () => {
	const { data, isLoading, isError, error } = useQuery<ApiResponse, Error>({
		queryKey: ["profile"],
		queryFn: async () => {
			try {
				const res = await axios.get<ApiResponse>(`${API_URL}/profile/get-info`);
				return res.data;
			} catch (error) {
				if (axios.isAxiosError(error)) {
					const axiosError = error as AxiosError<{ message?: string }>;
					throw new Error(
						axiosError.response?.data?.message ??
							"Failed to fetch user profile info"
					);
				}
				throw new Error("Failed to fetch user profile info");
			}
		},
	});

	if (isLoading) {
		return (
			<Wrapper>
				<div className="flex h-64 items-center justify-center">
					<div className="text-center">
						<div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
						<p className="mt-2 text-sm text-gray-600">
							Loading profile information...
						</p>
					</div>
				</div>
			</Wrapper>
		);
	}

	if (isError) {
		return (
			<Wrapper>
				<Alert variant="destructive">
					<ExclamationCircleIcon className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						{error?.message || "Failed to fetch profile information"}
					</AlertDescription>
				</Alert>
			</Wrapper>
		);
	}

	if (!data || data.data.length === 0) {
		return (
			<Wrapper>
				<Alert>
					<ExclamationCircleIcon className="h-4 w-4" />
					<AlertTitle>No Data</AlertTitle>
					<AlertDescription>No profile information found</AlertDescription>
				</Alert>
			</Wrapper>
		);
	}

	const userProfile = data.data[0];
	const { userInfo } = userProfile;

	return (
		// <Wrapper>
		<div className="space-y-6">
			{/* Profile Header */}
			<div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-md">
				<div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
					<div>
						<h1 className="text-3xl font-bold">{`${userInfo.firstName} ${userInfo.lastName}`}</h1>
						<p className="mt-1 text-blue-100">{userInfo.email}</p>
					</div>
					<div className="flex items-center space-x-2">
						<MapPinIcon className="h-5 w-5" />
						<span>{`${userInfo.city}, ${userInfo.region}`}</span>
					</div>
				</div>
			</div>

			{/* Contact Information */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="mb-4 text-xl font-semibold text-gray-900">
					Contact Information
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="flex items-center space-x-3">
						<div className="rounded-full bg-blue-100 p-2">
							<EnvelopeIcon className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Email</p>
							<p className="font-medium">{userInfo.email}</p>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<div className="rounded-full bg-green-100 p-2">
							<PhoneIcon className="h-5 w-5 text-green-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Phone</p>
							<p className="font-medium">{userInfo.phone}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Address Information */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="mb-4 text-xl font-semibold text-gray-900">
					Address Details
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="flex items-center space-x-3">
						<div className="rounded-full bg-purple-100 p-2">
							<HomeIcon className="h-5 w-5 text-purple-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Street Address</p>
							<p className="font-medium">{userInfo.streetAddress}</p>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<div className="rounded-full bg-orange-100 p-2">
							<TagIcon className="h-5 w-5 text-orange-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Ghana Post GPS</p>
							<p className="font-medium">{userInfo.ghanaPost}</p>
						</div>
					</div>
				</div>

				<div className="mt-6 rounded-lg bg-gray-50 p-4">
					<div className="flex items-center space-x-3">
						<MapPinIcon className="h-5 w-5 text-gray-600" />
						<div>
							<p className="text-sm text-gray-500">Location</p>
							<p className="font-medium">{`${userInfo.city}, ${userInfo.region}`}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Last Updated */}
			<p className="text-center text-sm text-gray-500">
				Last updated: {new Date(userProfile.updatedAt).toLocaleDateString()}
			</p>
		</div>
		// </Wrapper>
	);
};
