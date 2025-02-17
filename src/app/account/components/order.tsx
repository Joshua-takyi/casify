"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Wrapper from "@/components/wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Smartphone, Package, MapPin } from "lucide-react";
import Loading from "@/app/loading";
import { Metadata } from "next";
import Head from "next/head";

// Define metadata for better SEO
export const metadata: Metadata = {
	title: "Your Orders | Custom Phone Cases and Accessories",
	description:
		"Track your orders for custom phone cases and accessories. View order details, shipping information, and delivery status.",
	keywords: "phone cases, custom cases, order tracking, shipping status",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Type definitions with improved documentation
type ShippingAddress = {
	street: string;
	city: string;
	region: string;
	country: string;
	ghanaPost: string;
};

type Product = {
	productId: string;
	name: string;
	color: string;
	model: string;
	image: string;
	quantity: number;
	price: number;
	totalPrice: number;
	createdAt?: string;
};

type OrderResponse = {
	message: string;
	totalAmount: number;
	products: Product[];
	shippingAddresses: ShippingAddress[];
};

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency: "GHS",
		minimumFractionDigits: 2,
	}).format(amount);
};

const ProductCard: React.FC<{
	product: Product;
	shippingAddress: ShippingAddress;
}> = ({ product, shippingAddress }) => (
	<article className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
		<Card>
			<CardContent className="p-4 md:p-6">
				<div className="flex flex-col gap-6 lg:flex-row">
					{/* Product Image with proper alt text */}
					<div className="relative w-full h-40 md:w-48 md:h-48 lg:flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
						<Image
							src={product.image}
							alt={`${product.name} for ${product.model} in ${product.color}`}
							fill
							className="object-contain"
							priority
						/>
					</div>

					{/* Product Details & Shipping */}
					<div className="flex flex-col w-full gap-6">
						{/* Product Information */}
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="flex items-center justify-between flex-wrap">
									<h2 className="font-medium text-gray-900">{product.name}</h2>
									<Badge
										variant="secondary"
										className="font-normal bg-blue-100 text-blue-700"
									>
										Quantity: {product.quantity}
									</Badge>
								</div>

								<dl className="space-y-2 text-sm text-gray-600">
									<div className="flex items-center gap-2">
										<dt className="flex items-center">
											<Smartphone
												className="h-4 w-4 text-blue-500"
												aria-hidden="true"
											/>
											<span className="sr-only">Device Model:</span>
										</dt>
										<dd>{product.model}</dd>
									</div>
									<div className="flex items-center gap-2">
										<dt className="flex items-center">
											<Package
												className="h-4 w-4 text-green-500"
												aria-hidden="true"
											/>
											<span className="sr-only">Unit Price:</span>
										</dt>
										<dd>{formatCurrency(product.price)} per item</dd>
									</div>
								</dl>
							</div>

							<div className="flex items-center justify-between pt-4">
								<div className="flex items-center gap-2">
									<div
										className="h-4 w-4 rounded-full border border-gray-200"
										style={{ backgroundColor: product.color }}
										aria-label={`Product color: ${product.color}`}
									/>
									<span className="text-sm text-gray-600">Color Selection</span>
								</div>
								<span className="font-medium text-gray-900">
									Total: {formatCurrency(product.totalPrice)}
								</span>
							</div>
						</div>

						{/* Shipping Address */}
						<section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-3">
							<header className="flex items-center gap-2 text-indigo-700">
								<MapPin className="h-5 w-5" aria-hidden="true" />
								<h3 className="font-medium">Delivery Information</h3>
							</header>
							<address className="space-y-1 text-sm text-gray-600 not-italic">
								<p className="font-medium text-gray-800">
									{shippingAddress.street}
								</p>
								<p>
									{shippingAddress.city}, {shippingAddress.region}
								</p>
								<p>{shippingAddress.country}</p>
								<div className="flex items-center gap-2 mt-2 flex-wrap">
									<Badge
										variant="outline"
										className="bg-white border-indigo-200 text-indigo-700"
									>
										Ghana Post GPS: {shippingAddress.ghanaPost}
									</Badge>
								</div>
							</address>
						</section>
					</div>
				</div>
			</CardContent>
		</Card>
	</article>
);

export default function OrderPage() {
	const { data, isLoading, error } = useQuery<OrderResponse>({
		queryKey: ["orderData"],
		queryFn: async () => {
			try {
				const res = await axios.get(`${API_URL}/get-order`);
				return res.data;
			} catch (error) {
				if (axios.isAxiosError(error)) {
					throw new Error(
						error.response?.data?.message || "Failed to retrieve orders"
					);
				}
				throw new Error("Unable to retrieve orders");
			}
		},
		retry: 3,
		staleTime: 5 * 60 * 1000,
	});

	if (isLoading) {
		return (
			<div className="min-h-screen bg-white py-10" aria-busy="true">
				<Wrapper>
					<div className="text-gray-600">
						<Loading />
					</div>
				</Wrapper>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-white py-10" role="alert">
				<Wrapper>
					<Card className="p-6 text-center border-none">
						<p className="text-red-600">Error: {error.message}</p>
					</Card>
				</Wrapper>
			</div>
		);
	}

	if (!data || !data.products || !data.shippingAddresses) {
		return (
			<div className="min-h-screen bg-white py-10">
				<Wrapper>
					<Card className="p-6 text-center border-none">
						<p className="text-gray-900">No orders have been placed yet.</p>
					</Card>
				</Wrapper>
			</div>
		);
	}

	return (
		<>
			<Head>
				<title>Your Orders | Custom Phone Cases and Accessories</title>
				<meta
					name="description"
					content="Track your orders for custom phone cases and accessories. View order details, shipping information, and delivery status."
				/>
			</Head>
			<main className="md:py-10 py-12">
				<Wrapper>
					{/* Header with improved content */}
					<section className="mb-8 bg-white p-6 rounded-lg">
						<h1 className="text-xl font-medium text-gray-900 mb-2">
							Order Details
						</h1>
						<p className="text-gray-600">
							Your orders are typically delivered within 1-2 business days after
							purchase. Track your deliveries and view order information below.
						</p>
					</section>

					{/* Products list */}
					<section className="space-y-6" aria-label="Order items">
						{data.products.map((product, index) => (
							<ProductCard
								key={`${product.productId}-${product.model}-${product.color}`}
								product={product}
								shippingAddress={
									data.shippingAddresses[index] || data.shippingAddresses[0]
								}
							/>
						))}
					</section>

					{/* Summary Footer */}
					<section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
						<h2 className="sr-only">Order Summary</h2>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Items</p>
								<p className="text-lg font-medium text-gray-900">
									{data.products.reduce(
										(sum, product) => sum + product.quantity,
										0
									)}{" "}
									items
								</p>
							</div>
							<div className="text-right">
								<p className="text-sm text-gray-600">Total Amount</p>
								<p className="text-xl font-medium text-indigo-600">
									{formatCurrency(data.totalAmount)}
								</p>
							</div>
						</div>
					</section>
				</Wrapper>
			</main>
		</>
	);
}
