"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Wrapper from "@/components/wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Smartphone, Package, Clock, Truck } from "lucide-react";
import Loading from "@/app/loading";
import { motion } from "framer-motion";
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

const ProductCard = ({
	product,
	shippingAddress,
}: {
	product: Product;
	shippingAddress: ShippingAddress;
}) => (
	<motion.article
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.3 }}
		className="overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
	>
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
			{/* Product Image Section */}
			<div className="lg:col-span-3 aspect-square relative bg-gray-50">
				<Image
					src={product.image}
					alt={`${product.name} for ${product.model}`}
					fill
					className="object-contain p-4"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					priority
				/>
			</div>

			{/* Product Details Section */}
			<div className="lg:col-span-6 p-6 lg:p-8 space-y-6">
				<div className="space-y-4">
					<div className="flex items-start justify-between">
						<h2 className="text-xl font-semibold text-gray-900">
							{product.name}
						</h2>
						<Badge
							variant="secondary"
							className="bg-blue-50 text-blue-700 px-3 py-1"
						>
							{product.quantity} {product.quantity === 1 ? "item" : "items"}
						</Badge>
					</div>

					<div className="grid grid-cols-2 gap-4 text-sm">
						<div className="flex items-center gap-2">
							<Smartphone className="h-4 w-4 text-blue-500" />
							<span className="text-gray-600">{product.model}</span>
						</div>
						<div className="flex items-center gap-2">
							<Package className="h-4 w-4 text-green-500" />
							<span className="text-gray-600">
								{formatCurrency(product.price)}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div
								className="h-4 w-4 rounded-full border border-gray-200"
								style={{ backgroundColor: product.color }}
								aria-label={`Color: ${product.color}`}
							/>
							<span className="text-gray-600">Color Selection</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-orange-500" />
							<span className="text-gray-600">1-2 business days</span>
						</div>
					</div>

					<div className="pt-4 border-t">
						<div className="flex items-center justify-between">
							<span className="text-gray-600">Total Amount:</span>
							<span className="text-lg font-semibold text-gray-900">
								{formatCurrency(product.totalPrice)}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Shipping Details Section */}
			<div className="lg:col-span-3 bg-gradient-to-br from-gray-50 to-white p-6 lg:p-8 border-t lg:border-l lg:border-t-0">
				<div className="space-y-4">
					<div className="flex items-center gap-2 text-gray-900">
						<Truck className="h-5 w-5 text-blue-500" />
						<h3 className="font-semibold">Delivery Details</h3>
					</div>

					<address className="not-italic space-y-2 text-sm text-gray-600">
						<p className="font-medium text-gray-900">
							{shippingAddress.street}
						</p>
						<p>
							{shippingAddress.city}, {shippingAddress.region}
						</p>
						<p>{shippingAddress.country}</p>
					</address>

					<Badge variant="outline" className="w-full justify-center text-xs">
						GPS: {shippingAddress.ghanaPost}
					</Badge>
				</div>
			</div>
		</div>
	</motion.article>
);

export default function OrderPage() {
	const { data, isLoading, error } = useQuery<OrderResponse>({
		queryKey: ["orderData"],
		queryFn: async () => {
			try {
				const res = await axios.get(`${API_URL}/get-order`);
				return res.data.data;
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
