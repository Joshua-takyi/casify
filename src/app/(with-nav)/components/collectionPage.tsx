"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Wrapper from "@/components/wrapper";
import Image from "next/image";
import ProductCard from "@/components/productCard";
import Loading from "@/app/loading";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Product {
    id: string;
    title: string;
    price: number;
    image: string[];
    slug: string;
    // other properties...
}

export default function CollectionPage() {
    const searchParams = useSearchParams();
    const category = searchParams.get("category");
    const limit = Number(searchParams.get("limit") || 20);
    const page = Number(searchParams.get("page") || 1);
    const [error, setError] = useState<string | null>(null);

    const { data: products, isLoading, isError } = useQuery<Product[], Error>({
        queryKey: ["data", category, limit, page],
        queryFn: async () => {
            const res = await axios.get(
                `${API_URL}/products/get-item?category=${category}&limit=${limit}&page=${page}`,
                { headers: { Accept: "application/json" } }
            );
            if (res.status === 200) {
                // Assume response shape is { data: Product[] }
                return res.data.data;
            }
            throw new Error("Failed to get data");
        },
        onError: (err) => {
            setError(err.message || "Failed to fetch data");
        },
        enabled: !!category,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <Loading />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-red-500">
                Error: {error}
            </div>
        );
    }

    if (!Array.isArray(products) || products.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <Image
                    src={`/images/empty-folder.png`}
                    alt={`empty folder`}
                    width={200}
                    height={200}
                    priority={true}
                />
                <h1 className="capitalize text-xl">No products found.</h1>
            </div>
        );
    }

    return (
        <main className="@container md:py-12 sm:py-8">
            <Wrapper>
                <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            title={product.title}
                            price={product.price}
                            images={product.images}
                            slug={product.slug}
                            colors={product.colors}
                            isNew={product.isNew}
                        />
                    ))}
                </div>
            </Wrapper>
        </main>
    );
}