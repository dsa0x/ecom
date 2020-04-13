import { Schema, Document, model, Types } from "mongoose";

const inventorySchema = new Schema({
  quantity: {
    type: Number,
  },
  reservations: [
    {
      id: { type: Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
      createdOn: { type: Date },
    },
  ],
});

const InventoryModel = model("Inventory", inventorySchema, "inventory");

export default InventoryModel;
