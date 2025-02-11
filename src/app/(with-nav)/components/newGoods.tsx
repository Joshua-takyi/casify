// "use client";
//
// import React, { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { ProductCardProps } from "@/types/products";
// import { GetProductByTabs } from "@/server/action";
// import Responsive from "@/components/carousel"; // Import the Responsive carousel component
// import Wrapper from "@/components/wrapper";
//
// interface TabProps {
//     bestSellerTabName: string;
//     newItemTabName: string;
// }
//
// const TabsComponent: React.FC<TabProps> = ({ bestSellerTabName, newItemTabName }) => {
//     const [activeTab, setActiveTab] = useState<string>(bestSellerTabName);
//
//     const {
//         data: bestSellerData,
//         isLoading: isBestSellerLoading,
//         error: bestSellerError,
//     } = useQuery<{ success: boolean; data?: ProductCardProps[]; error?: Error }, Error>({
//         queryKey: ["products", { tab: "bestSeller" }], // Unique key for best seller products
//         queryFn: async () => {
//             const response = await GetProductByTabs({
//                 category: "phone-cases",
//                 isBestSeller: true,
//                 isNewItem: false
//             });
//             // Debug log
//             console.log('Best Seller Response:', response);
//             return response;
//         },
//         select: (response) => {
//             // Debug log
//             console.log('Best Seller Data after select:', response?.data);
//             return response?.data;
//         },
//     });
//
//     const {
//         data: newProductsData,
//         isLoading: isNewItemLoading,
//         error: newError,
//     } = useQuery<{ success: boolean; data?: ProductCardProps[]; error?: Error }, Error>({
//         queryKey: ["products", { tab: "newItem" }], // Unique key for new products
//         queryFn: async () => {
//             const response = await GetProductByTabs({
//                 category: "phone-cases",
//                 isBestSeller: false,
//                 isNewItem: true
//             });
//             // Debug log
//             console.log('New Products Response:', response);
//             return response;
//         },
//         select: (response) => {
//             // Debug log
//             console.log('New Products Data after select:', response?.data);
//             return response?.data;
//         },
//     });
//
//     // Debug effect to monitor data
//     useEffect(() => {
//         if (bestSellerData) {
//             console.log('Current Best Seller Data:', bestSellerData);
//         }
//         if (newProductsData) {
//             console.log('Current New Products Data:', newProductsData);
//         }
//     }, [bestSellerData, newProductsData]);
//
//     const handleTabChange = (tabName: string) => {
//         setActiveTab(tabName);
//     };
//
//     return (
//         <div className="@container @md:py-10 @sm:py-5">
//             <Wrapper>
//                 <div className="flex border-b">
//                     <button
//                         className={`px-4 py-2 font-semibold ${
//                             activeTab === bestSellerTabName ? "border-b-2 border-[#e2780c] text-[#e2780c]" : "text-gray-500"
//                         }`}
//                         onClick={() => handleTabChange(bestSellerTabName)}
//                     >
//                         {bestSellerTabName}
//                     </button>
//                     <button
//                         className={`px-4 py-2 font-semibold ${
//                             activeTab === newItemTabName ? "border-b-2 border-[#e2780c] text-[#e2780c]" : "text-gray-500"
//                         }`}
//                         onClick={() => handleTabChange(newItemTabName)}
//                     >
//                         {newItemTabName}
//                     </button>
//                 </div>
//
//                 <div className="mt-4">
//                     {activeTab === bestSellerTabName && (
//                         <div>
//                             {isBestSellerLoading ? (
//                                 <p>Loading best seller products...</p>
//                             ) : bestSellerError ? (
//                                 <p>Error: {bestSellerError.message || "Failed to fetch best seller products"}</p>
//                             ) : bestSellerData ? (
//                                 <>
//                                     {/* Debug info */}
//                                     <div className="hidden">
//                                         {console.log('Rendering Best Seller Products:', bestSellerData)}
//                                     </div>
//                                     <Responsive products={bestSellerData} /> {/* Pass the data to Responsive */}
//                                 </>
//                             ) : (
//                                 <p>No best seller products found.</p>
//                             )}
//                         </div>
//                     )}
//
//                     {activeTab === newItemTabName && (
//                         <div>
//                             {isNewItemLoading ? (
//                                 <p>Loading new products...</p>
//                             ) : newError ? (
//                                 <p>Error: {newError.message || "Failed to fetch new products"}</p>
//                             ) : newProductsData ? (
//                                 <>
//                                     {/* Debug info */}
//                                     <div className="hidden">
//                                         {console.log('Rendering New Products:', newProductsData)}
//                                     </div>
//                                     <Responsive products={newProductsData} /> {/* Pass the data to Responsive */}
//                                 </>
//                             ) : (
//                                 <p>No new products found.</p>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </Wrapper>
//         </div>
//     );
// };
//
// export default TabsComponent;