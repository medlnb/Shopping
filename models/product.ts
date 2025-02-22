import { model, models, Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    variances: [
      {
        price: {
          type: Number,
          required: true,
        },
        newPrice: {
          type: Number,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        isOutOfStock: {
          type: Boolean,
          default: false,
        },
        info: {
          type: String,
        },
      },
    ],
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: {
        aisle: { type: String, required: true },
        subcategories: { type: String, required: true },
        item: { type: String },
      },
      required: true,
    },
    ingedients: {
      type: [String],
    },
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    overallRating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || model("Product", productSchema);

export default Product;
