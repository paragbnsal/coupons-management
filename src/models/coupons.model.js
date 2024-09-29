// models/CouponModel.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: {
    type: String,
    required: true,
    enum: ["cart-wise", "product-wise", "BxGy"],
  },
  discountDetails: {
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    maxValue: { type: Number, required: false, min: 0 },
  },
  conditions: {
    minCartValue: { type: Number, required: false, min: 0 },
    applicableProducts: [{ type: String }], // ideally a ref to products collection
    customerType: {
      type: String,
      enum: ["new", "existing", "all"],
      required: true,
      default: "all",
    },
    seasonal: { type: Boolean, required: true, default: false }, // Seasonal or promotional flag
    startDate: { type: Date, required: false }, // Start date for seasonal promotions
    endDate: { type: Date, required: false }, // End date for seasonal promotions
  },
  expiryDate: { type: Date, required: true },
});

const CouponModel = mongoose.model("Coupon", couponSchema);

export default CouponModel;
