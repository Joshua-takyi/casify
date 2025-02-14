"use client";
import React, { useState } from "react";

interface TabComponentProps {
	data: {
		description: string;
		details: string[];
		materials: string[];
		features: string[];
	};
}

const TabComponent = ({ data }: TabComponentProps) => {
	const [activeTab, setActiveTab] = useState("description");

	const tabs = [
		{ id: "description", label: "Description" },
		{ id: "details", label: "Details" },
		{ id: "materials", label: "Materials" },
		{ id: "features", label: "Features" },
	];

	return (
		<div className="max-w-5xl w-full px-3  ">
			<div className=" leading-6">
				{/* Tab Headers */}
				<div className="flex border-b border-gray-300 mb-4">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`
                                flex-1 
                                py-3 
                                text-sm 
                                font-medium 
                                transition-colors 
                                duration-200 
                                ${
																	activeTab === tab.id
																		? "text-black border-b-2 border-black"
																		: "text-gray-500 hover:text-gray-700"
																}
                            `}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Tab Content */}
				<div className="mt-6 animate-fade-in">
					{activeTab === "description" && (
						<p className="text-[0.8rem] leading-7  text-pretty  text-gray-700">
							{data.description || "No description available"}
						</p>
					)}

					{activeTab === "details" && (
						<ul className="list-disc pl-6 space-y-3">
							{data.details && data.details.length > 0 ? (
								data.details.map((detail, index) => (
									<li
										key={index}
										className="text-[0.8rem] leading-7  text-pretty text-gray-700 hover:text-gray-900 transition-colors"
									>
										{detail}
									</li>
								))
							) : (
								<li className="text-[0.8rem] leading-7  text-pretty text-gray-500">
									No details available
								</li>
							)}
						</ul>
					)}

					{activeTab === "materials" && (
						<ul className="list-disc pl-6 space-y-3">
							{data.materials && data.materials.length > 0 ? (
								data.materials.map((material, index) => (
									<li
										key={index}
										className="text-[0.8rem] leading-7  text-pretty text-gray-700 hover:text-gray-900 transition-colors"
									>
										{material}
									</li>
								))
							) : (
								<li className="text-[0.8rem] leading-7  text-pretty text-gray-500">
									No materials listed
								</li>
							)}
						</ul>
					)}

					{activeTab === "features" && (
						<ul className="list-disc pl-6 space-y-3">
							{data.features && data.features.length > 0 ? (
								data.features.map((feature, index) => (
									<li
										key={index}
										className="text-[0.8rem] leading-7  text-pretty text-gray-700 hover:text-gray-900 transition-colors"
									>
										{feature}
									</li>
								))
							) : (
								<li className="text-[0.8rem] leading-7  text-pretty text-gray-500">
									No features listed
								</li>
							)}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default TabComponent;
