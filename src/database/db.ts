export const ColorData = [
	// Primary & Secondary Colors (More UI Focused)
	{ id: 1, label: "Red", value: "#EF4444", category: "primary" }, // Tailwind Red-500 (slightly less harsh red)
	{ id: 2, label: "Blue", value: "#3B82F6", category: "primary" }, // Tailwind Blue-500
	{ id: 3, label: "Green", value: "#10B981", category: "primary" }, // Tailwind Green-500
	{ id: 4, label: "Yellow", value: "#F59E0B", category: "secondary" }, // Tailwind Yellow-500
	{ id: 5, label: "Orange", value: "#F97316", category: "secondary" }, // Tailwind Orange-500
	{ id: 6, label: "Purple", value: "#8B5CF6", category: "secondary" }, // Tailwind Purple-500

	// Neutral Grays (Scalable Shades)
	{ id: 7, label: "Gray-50", value: "#F9FAFB", category: "neutral" },
	{ id: 8, label: "Gray-100", value: "#F3F4F6", category: "neutral" },
	{ id: 9, label: "Gray-200", value: "#E5E7EB", category: "neutral" },
	{ id: 10, label: "Gray-300", value: "#D1D5DB", category: "neutral" },
	{ id: 11, label: "Gray-400", value: "#9CA3AF", category: "neutral" },
	{ id: 12, label: "Gray-500", value: "#6B7280", category: "neutral" }, // Default text color often
	{ id: 13, label: "Gray-600", value: "#4B5563", category: "neutral" },
	{ id: 14, label: "Gray-700", value: "#374151", category: "neutral" },
	{ id: 15, label: "Gray-800", value: "#1F2937", category: "neutral" },
	{ id: 16, label: "Gray-900", value: "#111827", category: "neutral" }, // Darkest gray

	// Accent Colors (For highlights, etc.)
	{ id: 17, label: "Teal", value: "#14B8A6", category: "accent" }, // Tailwind Teal-500
	{ id: 18, label: "Pink", value: "#EC4899", category: "accent" }, // Tailwind Pink-500
	{ id: 19, label: "Indigo", value: "#6366F1", category: "accent" }, // Tailwind Indigo-500

	// Semantic Colors (For specific UI meanings)
	{ id: 20, label: "Success", value: "#4ADE80", category: "semantic" }, // Tailwind Green-400 (for success messages)
	{ id: 21, label: "Info", value: "#3AB7BF", category: "semantic" }, // Example info color
	{ id: 22, label: "Warning", value: "#FACC15", category: "semantic" }, // Tailwind Yellow-400 (for warnings)
	{ id: 23, label: "Error", value: "#F87171", category: "semantic" }, // Tailwind Red-400 (for errors)

	// Basic Black and White (Essential)
	{ id: 24, label: "Black", value: "#000000", category: "basic" },
	{ id: 25, label: "White", value: "#FFFFFF", category: "basic" },
];


export const SelectCategories = [
	{
		label: "Phone Cases & Covers",
		items: [
			{
				label: "Phone Cases",
				value: "phone-cases",
				subcategories: [
					{ label: "Silicone Cases", value: "silicone-cases" },
					{ label: "Leather Cases", value: "leather-cases" },
					{ label: "Clear Cases", value: "clear-cases" },
					{ label: "Rugged Cases", value: "rugged-cases" },
					{ label: "Wallet Cases", value: "wallet-cases" },
					{ label: "Bumper Cases", value: "bumper-cases" },
					{ label: "Designer Cases", value: "designer-cases" },
				],
			},
			{
				label: "Screen Protectors",
				value: "screen-protectors",
				subcategories: [
					{ label: "Tempered Glass", value: "tempered-glass" },
					{ label: "Plastic Film", value: "plastic-film" },
					{ label: "Privacy Screen Protectors", value: "privacy-protectors" },
					{ label: "Anti-Glare Protectors", value: "anti-glare-protectors" },
				],
			},
			{
				label: "Camera Lens Protectors",
				value: "camera-protectors",
				subcategories: [
					{ label: "Single Lens Protectors", value: "single-lens-protectors" },
					{ label: "Dual Lens Protectors", value: "dual-lens-protectors" },
					{ label: "Triple Lens Protectors", value: "triple-lens-protectors" },
				],
			},
			{
				label: "Back Films",
				value: "protective-films",
				subcategories: [
					{ label: "Matte Finish", value: "matte-finish" },
					{ label: "Glossy Finish", value: "glossy-finish" },
					{ label: "Carbon Fiber", value: "carbon-fiber" },
				],
			},
		],
	},
	{
		label: "Power & Charging",
		items: [
			{
				label: "Charging Cables",
				value: "charging-cables",
				subcategories: [
					{ label: "USB-C Cables", value: "usb-c-cables" },
					{ label: "Lightning Cables", value: "lightning-cables" },
					{ label: "Micro-USB Cables", value: "micro-usb-cables" },
					{ label: "Braided Cables", value: "braided-cables" },
				],
			},
			{
				label: "Wall Chargers",
				value: "wall-chargers",
				subcategories: [
					{ label: "Fast Chargers", value: "fast-chargers" },
					{ label: "Multi-Port Chargers", value: "multi-port-chargers" },
					{ label: "Compact Chargers", value: "compact-chargers" },
				],
			},
			{
				label: "Wireless Chargers",
				value: "wireless-chargers",
				subcategories: [
					{ label: "Stand Chargers", value: "stand-chargers" },
					{ label: "Pad Chargers", value: "pad-chargers" },
					{ label: "Fast Wireless Chargers", value: "fast-wireless-chargers" },
				],
			},
			{
				label: "Car Chargers",
				value: "car-chargers",
				subcategories: [
					{
						label: "Single Port Car Chargers",
						value: "single-port-car-chargers",
					},
					{ label: "Dual Port Car Chargers", value: "dual-port-car-chargers" },
					{ label: "Fast Car Chargers", value: "fast-car-chargers" },
				],
			},
			{
				label: "Power Banks",
				value: "power-banks",
				subcategories: [
					{ label: "Portable Power Banks", value: "portable-power-banks" },
					{ label: "Solar Power Banks", value: "solar-power-banks" },
					{
						label: "High-Capacity Power Banks",
						value: "high-capacity-power-banks",
					},
				],
			},
		],
	},
	{
		label: "Mounts & Holders",
		items: [
			{
				label: "Car Mounts",
				value: "car-mounts",
				subcategories: [
					{ label: "Magnetic Car Mounts", value: "magnetic-car-mounts" },
					{ label: "Vent Mounts", value: "vent-mounts" },
					{ label: "Dashboard Mounts", value: "dashboard-mounts" },
				],
			},
			{
				label: "Desk Stands",
				value: "desk-stands",
				subcategories: [
					{ label: "Adjustable Stands", value: "adjustable-stands" },
					{ label: "Charging Stands", value: "charging-stands" },
					{ label: "Foldable Stands", value: "foldable-stands" },
				],
			},
			{
				label: "Phone Grips & Rings",
				value: "phone-grips",
				subcategories: [
					{ label: "Pop Sockets", value: "pop-sockets" },
					{ label: "Ring Holders", value: "ring-holders" },
					{ label: "Adhesive Grips", value: "adhesive-grips" },
				],
			},
			{
				label: "Bike Mounts",
				value: "bike-mounts",
				subcategories: [
					{ label: "Handlebar Mounts", value: "handlebar-mounts" },
					{ label: "Stem Mounts", value: "stem-mounts" },
					{ label: "Waterproof Mounts", value: "waterproof-mounts" },
				],
			},
		],
	},
	{
		label: "Audio Accessories",
		items: [
			{
				label: "Airpod Cases",
				value: "airpod-cases",
				subcategories: [
					{ label: "Silicone Cases", value: "silicone-airpod-cases" },
					{ label: "Leather Cases", value: "leather-airpod-cases" },
					{ label: "Hard Shell Cases", value: "hard-shell-airpod-cases" },
				],
			},
			{
				label: "Bluetooth Earphones",
				value: "bluetooth-earphones",
				subcategories: [
					{ label: "In-Ear Earphones", value: "in-ear-earphones" },
					{ label: "Over-Ear Earphones", value: "over-ear-earphones" },
					{
						label: "Noise-Cancelling Earphones",
						value: "noise-cancelling-earphones",
					},
				],
			},
			{
				label: "Audio Adapters",
				value: "audio-adapters",
				subcategories: [
					{
						label: "USB-C to 3.5mm Adapters",
						value: "usb-c-to-3.5mm-adapters",
					},
					{
						label: "Lightning to 3.5mm Adapters",
						value: "lightning-to-3.5mm-adapters",
					},
					{ label: "Bluetooth Transmitters", value: "bluetooth-transmitters" },
				],
			},
			{
				label: "Earphone Cases",
				value: "earphone-cases",
				subcategories: [
					{ label: "Zipper Cases", value: "zipper-cases" },
					{ label: "Hard Cases", value: "hard-cases" },
					{ label: "Soft Pouch Cases", value: "soft-pouch-cases" },
				],
			},
		],
	},
	{
		label: "Camera Accessories",
		items: [
			{
				label: "Camera Lenses",
				value: "camera-lenses",
				subcategories: [
					{ label: "Wide-Angle Lenses", value: "wide-angle-lenses" },
					{ label: "Macro Lenses", value: "macro-lenses" },
					{ label: "Fisheye Lenses", value: "fisheye-lenses" },
				],
			},
			{
				label: "Selfie Sticks",
				value: "selfie-sticks",
				subcategories: [
					{
						label: "Bluetooth Selfie Sticks",
						value: "bluetooth-selfie-sticks",
					},
					{ label: "Wired Selfie Sticks", value: "wired-selfie-sticks" },
					{
						label: "Extendable Selfie Sticks",
						value: "extendable-selfie-sticks",
					},
				],
			},
			{
				label: "Camera Stabilizers",
				value: "camera-stabilizers",
				subcategories: [
					{ label: "Handheld Gimbals", value: "handheld-gimbals" },
					{ label: "Tripod Stabilizers", value: "tripod-stabilizers" },
					{ label: "Wearable Stabilizers", value: "wearable-stabilizers" },
				],
			},
			{
				label: "Phone Tripods",
				value: "tripods",
				subcategories: [
					{ label: "Mini Tripods", value: "mini-tripods" },
					{ label: "Flexible Tripods", value: "flexible-tripods" },
					{ label: "Tabletop Tripods", value: "tabletop-tripods" },
				],
			},
		],
	},
	{
		label: "Storage & Connectivity",
		items: [
			{
				label: "Memory Cards",
				value: "memory-cards",
				subcategories: [
					{ label: "MicroSD Cards", value: "microsd-cards" },
					{ label: "SD Cards", value: "sd-cards" },
					{
						label: "High-Speed Memory Cards",
						value: "high-speed-memory-cards",
					},
				],
			},
			{
				label: "OTG Adapters",
				value: "otg-adapters",
				subcategories: [
					{ label: "USB-C OTG Adapters", value: "usb-c-otg-adapters" },
					{ label: "Micro-USB OTG Adapters", value: "micro-usb-otg-adapters" },
					{
						label: "Multi-Port OTG Adapters",
						value: "multi-port-otg-adapters",
					},
				],
			},
			{
				label: "Card Readers",
				value: "card-readers",
				subcategories: [
					{ label: "USB-C Card Readers", value: "usb-c-card-readers" },
					{ label: "Micro-USB Card Readers", value: "micro-usb-card-readers" },
					{
						label: "Multi-Slot Card Readers",
						value: "multi-slot-card-readers",
					},
				],
			},
			{
				label: "USB Cables",
				value: "usb-cables",
				subcategories: [
					{ label: "USB-C to USB-C Cables", value: "usb-c-to-usb-c-cables" },
					{ label: "USB-C to USB-A Cables", value: "usb-c-to-usb-a-cables" },
					{
						label: "USB-C to Lightning Cables",
						value: "usb-c-to-lightning-cables",
					},
				],
			},
		],
	},
	{
		label: "Wearables",
		items: [
			{
				label: "Smart Watches",
				value: "smart-watches",
				subcategories: [
					{ label: "Fitness Trackers", value: "fitness-trackers" },
					{ label: "Luxury Smart Watches", value: "luxury-smart-watches" },
					{ label: "Rugged Smart Watches", value: "rugged-smart-watches" },
				],
			},
			{
				label: "Watch Straps",
				value: "watch-straps",
				subcategories: [
					{ label: "Silicone Straps", value: "silicone-straps" },
					{ label: "Leather Straps", value: "leather-straps" },
					{ label: "Metal Straps", value: "metal-straps" },
				],
			},
			{
				label: "Watch Chargers",
				value: "watch-chargers",
				subcategories: [
					{ label: "Magnetic Chargers", value: "magnetic-chargers" },
					{ label: "Wireless Chargers", value: "wireless-watch-chargers" },
					{ label: "Portable Chargers", value: "portable-watch-chargers" },
				],
			},
			{
				label: "Watch Screen Protectors",
				value: "watch-protectors",
				subcategories: [
					{
						label: "Tempered Glass Protectors",
						value: "tempered-glass-watch-protectors",
					},
					{
						label: "Plastic Film Protectors",
						value: "plastic-film-watch-protectors",
					},
					{
						label: "Anti-Scratch Protectors",
						value: "anti-scratch-watch-protectors",
					},
				],
			},
		],
	},
	{
		label: "Maintenance",
		items: [
			{
				label: "Cleaning Kits",
				value: "cleaning-kits",
				subcategories: [
					{ label: "Screen Cleaning Kits", value: "screen-cleaning-kits" },
					{ label: "Lens Cleaning Kits", value: "lens-cleaning-kits" },
					{ label: "Device Cleaning Kits", value: "device-cleaning-kits" },
				],
			},
			{
				label: "Repair Tools",
				value: "repair-tools",
				subcategories: [
					{ label: "Screwdriver Kits", value: "screwdriver-kits" },
					{ label: "Pry Tools", value: "pry-tools" },
					{ label: "Adhesive Strips", value: "adhesive-strips" },
				],
			},
			{
				label: "Replacement Parts",
				value: "replacement-parts",
				subcategories: [
					{ label: "Battery Replacements", value: "battery-replacements" },
					{ label: "Screen Replacements", value: "screen-replacements" },
					{
						label: "Charging Port Replacements",
						value: "charging-port-replacements",
					},
				],
			},
			{
				label: "Cleaning Solutions",
				value: "cleaning-solutions",
				subcategories: [
					{
						label: "Screen Cleaning Solutions",
						value: "screen-cleaning-solutions",
					},
					{
						label: "Lens Cleaning Solutions",
						value: "lens-cleaning-solutions",
					},
					{
						label: "Device Cleaning Solutions",
						value: "device-cleaning-solutions",
					},
				],
			},
		],
	},
];

export const SelectedTags = [
	{
		label: "Phone Cases",
		items: [
			{ label: "iPhone Cases", value: "iphone-cases" },
			{ label: "Galaxy Cases", value: "galaxy-cases" },
			{ label: "OnePlus Cases", value: "oneplus-cases" },
			{ label: "Pixel Cases", value: "pixel-cases" },
			{ label: "Clear Cases", value: "clear-cases" },
			{ label: "Leather Cases", value: "leather-cases" },
			{ label: "Rugged Cases", value: "rugged-cases" },
		],
	},
	{
		label: "Screen Protectors",
		items: [
			{ label: "Tempered Glass", value: "tempered-glass" },
			{
				label: "Privacy Screen Protectors",
				value: "privacy-screen-protectors",
			},
			{ label: "Anti-Glare Protectors", value: "anti-glare-protectors" },
			{ label: "Self-Healing Protectors", value: "self-healing-protectors" },
		],
	},
	{
		label: "Chargers & Cables",
		items: [
			{ label: "Fast Chargers", value: "fast-chargers" },
			{ label: "Wireless Chargers", value: "wireless-chargers" },
			{ label: "USB-C Cables", value: "usb-c-cables" },
			{ label: "Lightning Cables", value: "lightning-cables" },
			{ label: "Car Chargers", value: "car-chargers" },
			{ label: "Multi-Port Chargers", value: "multi-port-chargers" },
		],
	},
	{
		label: "Earphones & Headphones",
		items: [
			{ label: "AirPods", value: "airpods" },
			{ label: "Galaxy Buds", value: "galaxy-buds" },
			{ label: "Wireless Earbuds", value: "wireless-earbuds" },
			{
				label: "Noise-Cancelling Headphones",
				value: "noise-cancelling-headphones",
			},
			{ label: "Sports Earphones", value: "sports-earphones" },
		],
	},
	{
		label: "Power Banks",
		items: [
			{ label: "20,000mAh Power Banks", value: "20000mah-power-banks" },
			{ label: "10,000mAh Power Banks", value: "10000mah-power-banks" },
			{ label: "Slim Power Banks", value: "slim-power-banks" },
			{ label: "Solar Power Banks", value: "solar-power-banks" },
		],
	},
	{
		label: "Smartwatch Accessories",
		items: [
			{ label: "Apple Watch Bands", value: "apple-watch-bands" },
			{ label: "Galaxy Watch Bands", value: "galaxy-watch-bands" },
			{ label: "Charging Docks", value: "charging-docks" },
			{ label: "Screen Protectors", value: "smartwatch-screen-protectors" },
		],
	},
];
