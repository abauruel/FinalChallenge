import mongoose from 'mongoose';

const NotificationSchemas = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      reuired: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(NotificationSchemas);
