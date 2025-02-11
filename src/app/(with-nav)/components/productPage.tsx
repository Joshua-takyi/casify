"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CatchAllSlug } from "@/server/action";
import React, { useState, useMemo, useEffect } from "react";
import Wrapper from "@/components/wrapper";
import ImageCarousel from "@/components/productImageCarousel";
import ProductDetails from "@/components/productDetails";
import HeaderComponent from "@/components/header";
import { AddQuantity } from "@/components/quantity";
import ProductColorSelector from "@/components/productColorSelect";
import SelectPhoneModel from "@/components/productModelSelect";

export default function Product() {
    const [quantity, setQuantity] = useState<number>(1); // State for quantity
    const [selectedColor, setSelectedColor] = useState<string>(''); // State for selected color
    const [selectedModel, setSelectedModel] = useState<string>(''); // State for selected color
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug?.join('/') || "";
    const color = searchParams.get('color') || '';
    const model = searchParams.get('model') || '';

    // Memoized fetch function
    const memoizedFetch = useMemo(() => async () => {
        if (!slug) {
            throw new Error("Missing slug.");
        }
        const result = await CatchAllSlug({ slug, color, model });
        if (result && result.success) {
            // Return the first product if it's an array
            return Array.isArray(result.data) ? result.data[0] : result.data;
        } else {
            throw new Error(result?.message || "Failed to fetch data");
        }
    }, [slug, color, model]);

    // Fetch product data
    const { data: productData, isLoading, isError, error } = useQuery({
        queryKey: ['product', slug, color, model], // React Query key
        queryFn: memoizedFetch,
        enabled: !!slug, // Only enable the query if the slug is available
        staleTime: 1000 * 60 * 10, // Cache data for 10 minutes
        cacheTime: 1000 * 60 * 30, // Keep cached data for 30 minutes
    });

    // Handle quantity change
    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity); // Update the quantity state
    };

    // Set default selected color when productData changes
    useEffect(() => {
        if (productData?.colors?.length > 0) {
            setSelectedColor(productData.colors[0]); // Set the first color as default
        }
    }, [productData]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error?.message}</div>;
    }

    if (!productData) {
        return <div>Product not found.</div>;
    }

    return (
        <main className={`py-8`}>
            <Wrapper>
                <section className={`grid md:grid-cols-10 grid-cols-1 gap-4`}>
                    {/* Product Image Carousel */}
                    <div className={`col-span-5 h-full`}>
                        <ImageCarousel images={productData.images} alt={`${productData.title}-${productData.slug}`} />
                    </div>

                    {/* Product Details */}
                    <div className={`col-span-5 h-full flex flex-col gap-5 md:py-10`}>
                        <HeaderComponent
                            title={productData.title}
                            stock={productData.stock}
                            discount={productData.discount}
                            price={productData.price}
                        />
                        {/*<div className={`flex `}>*/}
                            <div className="flex md:flex-row flex-col justify-between items-center gap-4">
                                <div className={`md:w-1/3 w-full`}>

                                <AddQuantity onQuantityChange={handleQuantityChange} />
                                </div>
                                <div className={`md:w-1/3 w-full`}>
                                <ProductColorSelector
                                    product={{ colors: productData.colors }}
                                    selectedColor={selectedColor}
                                    setSelectedColor={setSelectedColor}
                                />
                                </div>
                                <div className={`md:w-1/3 w-full`}>
                                <SelectPhoneModel
                                    itemModel={productData.models}
                                    value={selectedModel}
                                    onChange={setSelectedModel}
                                />
                                </div>
                            </div>
                        {/*</div>*/}
                        <ProductDetails
                            details={productData.details}
                            materials={productData.materials}
                            features={productData.features}
                        />
                    </div>
                </section>
            </Wrapper>
        </main>
    );
}