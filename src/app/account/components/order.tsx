"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Wrapper from "@/components/wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Smartphone, Package, MapPin } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

// Product Card Component with shipping address
const ProductCard: React.FC<{
	product: Product;
	shippingAddress: ShippingAddress;
}> = ({ product, shippingAddress }) => (
	<Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
		<CardContent className="p-4 md:p-6">
			<div className="flex flex-col gap-6 lg:flex-row">
				{/* Product Image */}
				<div className="relative w-full h-40 md:w-48 md:h-48 lg:flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
					<Image
						src={product.image}
						alt={product.name}
						fill
						className="object-contain"
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
									{product.quantity}x
								</Badge>
							</div>

							<div className="space-y-2 text-sm text-gray-600">
								<div className="flex items-center gap-2">
									<Smartphone className="h-4 w-4 text-blue-500" />
									<span>{product.model}</span>
								</div>
								<div className="flex items-center gap-2">
									<Package className="h-4 w-4 text-green-500" />
									<span>{formatCurrency(product.price)} per item</span>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between pt-4">
							<div className="flex items-center gap-2">
								<div
									className="h-4 w-4 rounded-full border border-gray-200"
									style={{ backgroundColor: product.color }}
									title={`Color: ${product.color}`}
								/>
								<span className="text-sm text-gray-600">Selected Color</span>
							</div>
							<span className="font-medium text-gray-900">
								{formatCurrency(product.totalPrice)}
							</span>
						</div>
					</div>

					{/* Shipping Address */}
					<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-3">
						<div className="flex items-center gap-2 text-indigo-700">
							<MapPin className="h-5 w-5" />
							<h3 className="font-medium">Delivering To</h3>
						</div>
						<div className="space-y-1 text-sm text-gray-600">
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
						</div>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
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
						error.response?.data?.message || "Failed to get orders"
					);
				}
				throw new Error("Failed to get orders");
			}
		},
		retry: 3,
		staleTime: 5 * 60 * 1000,
	});

	if (isLoading) {
		return (
			<div className="min-h-screen bg-white py-10">
				<Wrapper>
					<div className="text-gray-600">Loading orders...</div>
				</Wrapper>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-white py-10">
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
						<p className="text-gray-900">No orders found</p>
					</Card>
				</Wrapper>
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-gray-50 py-10">
			<Wrapper>
				{/* Header */}
				<div className="mb-8 flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
					<h1 className="text-xl font-medium text-gray-900">Your Orders</h1>
					<div className="text-right">
						<p className="text-sm text-gray-600">Total Amount</p>
						<span className="text-lg font-medium text-indigo-600">
							{formatCurrency(data.totalAmount)}
						</span>
					</div>
				</div>

				{/* Products list */}
				<div className="space-y-6">
					{data.products.map((product, index) => (
						<ProductCard
							key={`${product.productId}-${product.model}-${product.color}`}
							product={product}
							shippingAddress={
								data.shippingAddresses[index] || data.shippingAddresses[0]
							}
						/>
					))}
				</div>

				{/* Summary Footer */}
				<div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
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
				</div>
			</Wrapper>
		</main>
	);
}
