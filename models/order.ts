import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    costumer: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    variance: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stat: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model("Order", OrderSchema);

export default Order;
