import mongoose ,{Document} from "mongoose";
export interface CartProps extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    products: {
        productId: mongoose.Schema.Types.ObjectId;
        quantity: number;
        color: string;
        model: string;
        totalPrice: number;
    }[];
    updatedAt: Date;
}

