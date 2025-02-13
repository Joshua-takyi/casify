"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CatchAllSlug } from "@/server/action";
import React, { useState, useMemo, useEffect } from "react";
import Wrapper from "@/components/wrapper";
import ImageCarousel from "@/components/productImageCarousel";
import HeaderComponent from "@/components/header";
import { AddQuantity } from "@/components/quantity";
import ProductColorSelector from "@/components/productColorSelect";
import SelectPhoneModel from "@/components/productModelSelect";
import Loading from "@/app/loading";
import AddToCart from "@/components/addToCart";

export default function Product() {
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const params = useParams();
    const searchParams = useSearchParams();

    const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug || "";
    const color = searchParams.get('color') || '';
    const model = searchParams.get('model') || '';

    const memoizedFetch = useMemo(() => async () => {
        if (!slug) {
            throw new Error("Missing slug.");
        }
        const result = await CatchAllSlug({ slug, color, model });
        if (result && result.success) {
            return Array.isArray(result.data) ? result.data[0] : result.data;
        } else {
            throw new Error(result?.message || "Failed to fetch data");
        }
    }, [slug, color, model]);

    const { data: productData, isLoading, isError, error } = useQuery({
        queryKey: ['product', slug, color, model],
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
    if (isError) return <div className="p-8 text-center text-red-600">Error: {error?.message}</div>;
    if (!productData) return <div className="p-8 text-center">Product not found.</div>;

    return (
        <main className="py-8 ">
            <Wrapper>
                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Column - Image Carousel */}
                        <div className="w-full">
                            <div className="sticky top-24">
                                <ImageCarousel
                                    images={productData.images}
                                    alt={`${productData.title}-${productData.slug}`}
                                />
                            </div>
                        </div>

                        {/* Right Column - Product Details */}
                        <div className="flex flex-col gap-6">
                            {/* Header Section */}
                            <HeaderComponent
                                title={productData.title}
                                discount={productData.discount}
                                price={productData.price}
                            />

                            {/* Divider */}
                            <div className="border-t border-gray-100" />

                            {/* Options Section */}
                            <div className="space-y-6">
                                {/* Model Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Select Model
                                    </label>
                                    <SelectPhoneModel
                                        itemModel={productData.models}
                                        value={selectedModel}
                                        onChange={setSelectedModel}
                                    />
                                </div>

                                {/* Color and Quantity Row */}
                                <div className="flex flex-col sm:flex-row gap-6">
                                    {/* Color Selection */}
                                    <div className="flex flex-col gap-3 flex-1">
                                        <label className="text-sm font-medium text-gray-700">
                                            Choose Color
                                        </label>
                                        <ProductColorSelector
                                            product={{ colors: productData.colors }}
                                            selectedColor={selectedColor}
                                            setSelectedColor={setSelectedColor}
                                        />
                                    </div>

                                    {/* Quantity Selection */}
                                    <div className="flex flex-col gap-3 sm:w-40">
                                        <label className="text-sm font-medium text-gray-700">
                                            Quantity
                                        </label>
                                        <AddQuantity onQuantityChange={handleQuantityChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-100" />

                            {/* Add to Cart Section */}
                            <div className="mt-2">
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
            </Wrapper>
        </main>
    );
}