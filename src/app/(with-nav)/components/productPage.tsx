"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CatchAllSlug } from "@/server/action";
import React, { useState, useMemo, useEffect } from "react";
import Wrapper from "@/components/wrapper";
import ImageCarousel from "@/components/productImageCarousel";
import HeaderComponent from "@/components/header";
import ProductColorSelector from "@/components/productColorSelect";
import SelectPhoneModel from "@/components/productModelSelect";
import Loading from "@/app/loading";
import AddToCart from "@/components/addToCart";
import AddQuantity from "@/components/quantity";
import { BoltIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import Accordion from "@/components/accordion";

export default function Product() {
	const [quantity, setQuantity] = useState<number>(1);
	const [selectedColor, setSelectedColor] = useState<string>("");
	const [selectedModel, setSelectedModel] = useState<string>("");
	const params = useParams();
	const searchParams = useSearchParams();

	const slug = Array.isArray(params.slug)
		? params.slug.join("/")
		: params.slug ?? "";
	const color = searchParams.get("color") ?? "";
	const model = searchParams.get("model") ?? "";

	const memoizedFetch = useMemo(
		() => async () => {
			if (!slug) {
				throw new Error("Missing slug.");
			}
			const result = await CatchAllSlug({ slug, color, model });
			if (result?.success) {
				return Array.isArray(result.data) ? result.data[0] : result.data;
			} else {
				throw new Error(result?.message || "Failed to fetch data");
			}
		},
		[slug, color, model]
	);

	const {
		data: productData,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["product", slug, color, model],
		queryFn: memoizedFetch,
		enabled: !!slug,
		staleTime: 1000 * 60 * 10,
	});

	const handleQuantityChange = (newQuantity: number) => {
		setQuantity(newQuantity);
	};

	useEffect(() => {
		if (productData?.colors?.length > 0) {
			setSelectedColor(productData.colors[0]);
		}
	}, [productData]);

	if (isLoading) return <Loading />;
	if (isError)
		return (
			<div className="p-8 text-center text-red-600">
				Error: {error?.message}
			</div>
		);
	if (!productData)
		return <div className="p-8 text-center">Product not found.</div>;

	// Helper function to generate unique keys
	const generateUniqueKey = (
		prefix: string,
		content: string,
		index: number
	) => {
		return `${prefix}-${content.substring(0, 20)}-${index}`;
	};

	return (
		<main className="py-4 sm:py-6 md:py-8">
			<Wrapper>
				<div className="px-4 sm:px-6 md:px-8 lg:px-24">
					{/* Your existing grid layout */}
					<div className="grid grid-cols-1 md:grid-cols-10 gap-6 lg:gap-12">
						{/* Left Column - Image Carousel */}
						<div className="w-full col-span-1 md:col-span-6">
							<div className="md:sticky md:top-24">
								<ImageCarousel
									images={productData.images}
									alt={`${productData.title}-${productData.slug}`}
								/>
							</div>
						</div>

						{/* Right Column - Product Details */}
						<div className="col-span-1 md:col-span-4">
							{/* Your existing product details section */}
							<div className="flex flex-col gap-6">
								<HeaderComponent
									title={productData.title}
									discount={productData.discount}
									price={productData.price}
								/>

								<div className="border-t border-gray-200" />

								<div className="flex flex-col gap-6">
									<div className="flex flex-col gap-2">
										<span className="text-sm font-medium text-gray-700">
											Select Model
										</span>
										<SelectPhoneModel
											itemModel={productData.models}
											value={selectedModel}
											onChange={setSelectedModel}
										/>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										<div className="flex flex-col gap-2">
											<span className="text-sm font-medium text-gray-700">
												Choose Color
											</span>
											<ProductColorSelector
												product={{ colors: productData.colors }}
												selectedColor={selectedColor}
												setSelectedColor={setSelectedColor}
											/>
										</div>
										<div className="flex flex-col gap-2">
											<span className="text-sm font-medium text-gray-700">
												Quantity
											</span>
											<AddQuantity onQuantityChange={handleQuantityChange} />
										</div>
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
									<div className="flex items-start gap-3">
										<BoltIcon className="h-5 w-5 flex-shrink-0 mt-1" />
										<div className="flex flex-col">
											<p className="font-semibold">Delivery:</p>
											<span>In Stock</span>
											<button className="text-blue-600 hover:underline text-left">
												comes with a cost
											</button>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<ShoppingBagIcon className="h-5 w-5 flex-shrink-0 mt-1" />
										<div className="flex flex-col">
											<p className="font-semibold">Pickup:</p>
											<button className="text-blue-600 hover:underline text-left">
												Check availability
											</button>
										</div>
									</div>
								</div>

								<div className="mt-4">
									<AddToCart
										productId={productData._id}
										selectedColor={selectedColor}
										selectedModel={selectedModel}
										selectedQuantity={quantity}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<section className="md:py-20 py-8 flex flex-col md:gap-10 gap-5">
					<Accordion
						mainHeader="Product Information"
						items={[
							{
								title: "Description",
								content: (
									<div className="space-y-4">
										{Array.isArray(productData.description) ? (
											productData.description.map(
												(item: string, index: number) => (
													<p
														key={generateUniqueKey("desc", item, index)}
														className="text-gray-600"
													>
														{item}
													</p>
												)
											)
										) : (
											<p className="text-gray-600">{productData.description}</p>
										)}
									</div>
								),
							},
							{
								title: "Features",
								content: (
									<ul className="list-disc pl-4 space-y-2">
										{Array.isArray(productData.features) ? (
											productData.features.map(
												(feature: string, index: number) => (
													<li
														key={generateUniqueKey("feature", feature, index)}
														className="text-gray-600"
													>
														{feature}
													</li>
												)
											)
										) : (
											<li className="text-gray-600">{productData.features}</li>
										)}
									</ul>
								),
							},
							{
								title: "Reviews",
								content: (
									<div className="space-y-3">
										{Array.isArray(productData.materials) ? (
											productData.materials.map(
												(material: string, index: number) => (
													<p
														key={generateUniqueKey("material", material, index)}
														className="text-gray-600"
													>
														{material}
													</p>
												)
											)
										) : (
											<p className="text-gray-600">{productData.materials}</p>
										)}
									</div>
								),
							},
						]}
					/>
					<Accordion
						mainHeader="Compatibility"
						items={[
							{
								title: "Compatibility",
								content: (
									<ul className="list-disc pl-4 space-y-2">
										{Array.isArray(productData.models) ? (
											productData.models.map((model: string, index: number) => (
												<li
													key={generateUniqueKey("model", model, index)}
													className="text-gray-600"
												>
													{model}
												</li>
											))
										) : (
											<li className="text-gray-600">{productData.models}</li>
										)}
									</ul>
								),
							},
						]}
					/>
				</section>
			</Wrapper>
		</main>
	);
}
