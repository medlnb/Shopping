import { model, models, Schema } from "mongoose";

const MemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  admin: {
    type: String,
    required: true,
    default: false,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: true,
  },
  cart: {
    type: [
      {
        _id: { type: String, required: true },
        varianceId: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    required: true,
    default: [],
  },
});

const Member = models.Member || model("Member", MemberSchema);

export default Member;
