import mongoose from "mongoose";
import logger from "@/utils/logger";
let isConnected = false;

export const ConnectDb = async (): Promise<void> => {
	if (isConnected) return;

	const mongoUri = process.env.MONGODB_URI;
	if (!mongoUri) {
		throw new Error("MONGODB_URI is not defined in environment variables.");
	}

	try {
		await mongoose.connect(mongoUri);
		isConnected = true;
		logger.info("mongodb connected successfully");
	} catch (error) {
		console.error("Error connecting to database:", error);
		throw error;
	}
};
