import { model, models, Schema } from "mongoose";

const imageSchema = new Schema({
  image: {
    type: Buffer,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
});

const Image = models.Image || model("Image", imageSchema);

export default Image;
