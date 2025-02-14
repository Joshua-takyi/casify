"use client";

import Wrapper from "@/components/wrapper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

// Define the schema using Zod
const ProfileSchema = z.object({
	userInfo: z.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.string().email("Invalid email address"),
		phone: z.string().min(1, "Phone number is required"),
		city: z.string().min(1, "City is required"),
		region: z.string().min(1, "Region is required"),
		streetAddress: z.string().min(1, "Street address is required"),
		ghanaPost: z.string().min(1, "Ghana Post GPS is required"),
	}),
});

type UserProps = z.infer<typeof ProfileSchema>;

//Ghana Region data
const GHANA_REGIONS = [
	{ value: "greater-accra", label: "Greater Accra Region" },
	{ value: "ashanti", label: "Ashanti Region" },
	{ value: "eastern", label: "Eastern Region" },
	{ value: "western", label: "Western Region" },
	{ value: "central", label: "Central Region" },
	{ value: "volta", label: "Volta Region" },
	{ value: "northern", label: "Northern Region" },
	{ value: "upper-east", label: "Upper East Region" },
	{ value: "upper-west", label: "Upper West Region" },
	{ value: "bono", label: "Bono Region" },
	{ value: "savannah", label: "Savannah Region" },
	{ value: "north-east", label: "North East Region" },
	{ value: "oti", label: "Oti Region" },
	{ value: "ahafo", label: "Ahafo Region" },
	{ value: "bono-east", label: "Bono East Region" },
	{ value: "western-north", label: "Western North Region" },
];

const initialData: UserProps = {
	userInfo: {
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		city: "",
		region: "",
		streetAddress: "",
		ghanaPost: "",
	},
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
	// Initialize state for avatar preview

	//Use queryCLient
	const queryClient = useQueryClient();

	//React hook form functionality
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<UserProps>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: initialData,
	});

	//UseMutation hook to post data
	const { mutate, isPending, reset } = useMutation({
		mutationKey: ["ProfileData"],
		mutationFn: async (data: UserProps) => {
			try {
				const res = await axios.post(`${API_URL}/profile/user-info`, data);
				if (res.status !== 201) {
					throw new Error("failed to update user profile info");
				}
				return res.data;
			} catch (error) {
				if (axios.isAxiosError(error)) {
					const axiosError = error as AxiosError<{ message?: string }>;
					const errorMessage =
						axiosError.response?.data?.message ??
						"Failed to update user profile info";
					throw new Error(errorMessage);
				}
				throw new Error("Failed to update user profile info");
			}
		},
		onSuccess: () => {
			// Invalidate the query to refetch data
			queryClient.invalidateQueries({ queryKey: ["ProfileData"] });
			reset();
			toast.success("Profile updated successfully!");
		},
		onError: (error: Error) => {
			//Show error message
			toast.error(error.message || "An error occurred while updating profile.");
		},
	});

	//Function to handle file upload to update picture

	//Handles the submission of data
	const onSubmit = (data: UserProps) => {
		mutate(data);
	};

	return (
		<main className="min-h-screen bg-gray-50 py-10">
			<Wrapper>
				{/* Profile Header Section */}

				{/* Separator */}
				<div className="my-8 h-px bg-gray-200" />

				{/* Profile Form */}
				<div className="mx-auto w-full max-w-3xl">
					<h2 className="mb-6 text-xl font-semibold text-gray-900">
						Update Information
					</h2>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<FormInput
								type="text"
								label="First Name"
								register={register("userInfo.firstName")}
								error={errors.userInfo?.firstName?.message}
							/>
							<FormInput
								label="Last Name"
								type="text"
								register={register("userInfo.lastName")}
								error={errors.userInfo?.lastName?.message}
							/>
						</div>

						<FormInput
							label="Email"
							type="email"
							register={register("userInfo.email")}
							error={errors.userInfo?.email?.message}
						/>

						<FormInput
							label="Phone Number"
							register={register("userInfo.phone")}
							error={errors.userInfo?.phone?.message}
						/>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<FormInput
								label="City"
								register={register("userInfo.city")}
								error={errors.userInfo?.city?.message}
							/>

							<div className="flex flex-col space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Region
								</label>
								<select
									{...register("userInfo.region")}
									className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
								>
									<option value="">Select a region</option>
									{GHANA_REGIONS.map((region) => (
										<option key={region.value} value={region.value}>
											{region.label}
										</option>
									))}
								</select>
								{errors.userInfo?.region?.message && (
									<p className="text-sm text-red-500">
										{errors.userInfo.region.message}
									</p>
								)}
							</div>
						</div>

						<FormInput
							label="Street Address"
							register={register("userInfo.streetAddress")}
							error={errors.userInfo?.streetAddress?.message}
						/>

						<FormInput
							label="Ghana Post GPS"
							register={register("userInfo.ghanaPost")}
							error={errors.userInfo?.ghanaPost?.message}
						/>

						<div>
							<button
								type="submit"
								className="w-full rounded bg-blue-500 px-4 py-3 font-bold text-white hover:bg-blue-700 focus:outline-none focus:shadow-outline"
								disabled={isPending}
							>
								{isPending ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</form>
				</div>
			</Wrapper>
		</main>
	);
}
