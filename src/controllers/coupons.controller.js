import {
  validateCart,
  validateCoupon,
  validateCouponFields,
} from "../services/validators.service.js";
import CouponModel from "../models/coupons.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateCouponCode } from "../utils/utils.js";
import { isValidObjectId } from "mongoose";
import { getApplicableCouponsAggregation } from "../services/couponAggregation.service.js";

// Create a new coupon
export const createNewCoupon = asyncHandler(async (req, res) => {
  validateCouponFields(req.body);
  if (!req.body.code) req.body.code = generateCouponCode();
  const newCoupon = new CouponModel(req.body);
  await newCoupon.save();
  return res
    .status(201)
    .json(new ApiResponse(201, newCoupon, "Coupon created successfully"));
});

// Retrieve all coupons
export const getAllCoupons = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const coupons = await CouponModel.find({})
    .skip(limit * (page - 1))
    .limit(limit);
  return res
    .status(200)
    .json(new ApiResponse(200, coupons, "Coupons retrieved successfully"));
});

// Retrieve a specific coupon by its ID or Unique Code
export const getCouponById = asyncHandler(async (req, res) => {
  const { id: idOrCode } = req.params;

  const coupon = isValidObjectId(idOrCode)
    ? await CouponModel.findById(idOrCode)
    : await CouponModel.findOne({ code: idOrCode });
  if (!coupon) throw new ApiError(404, "Coupon not found");

  return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon retrieved successfully"));
});

// Update a specific coupon by its ID or Unique Code
export const updateCouponById = asyncHandler(async (req, res) => {
  validateCouponFields(req.body);

  const { id: idOrCode } = req.params;

  const coupon = isValidObjectId(idOrCode)
    ? await CouponModel.findByIdAndUpdate(idOrCode, req.body, { new: true })
    : await CouponModel.findOneAndUpdate({ code: idOrCode }, req.body, {
        new: true,
      });
  if (!coupon) throw new ApiError(404, "Coupon not found");

  return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon updated successfully"));
});

// Delete a specific coupon by its ID or Unique Code
export const deleteCouponById = asyncHandler(async (req, res) => {
  const { id: idOrCode } = req.params;

  const coupon = isValidObjectId(idOrCode)
    ? await CouponModel.findByIdAndDelete(id)
    : await CouponModel.findOneAndDelete({ code: idOrCode });
  if (!coupon) throw new ApiError(404, "Coupon not found");

  return res
    .status(204)
    .json(new ApiResponse(204, null, "Coupon deleted successfully"));
});

// Fetch all applicable coupons for a given cart
export const fetchApplicableCoupons = asyncHandler(async (req, res) => {
  const { cartValue, applicableProducts, customerType } = req.body;

  if (typeof cartValue !== "number" || !Array.isArray(applicableProducts)) {
    throw new ApiError(
      400,
      "Invalid input: cartValue must be a number and applicableProducts must be an array"
    );
  }

  const aggregationPipeline = getApplicableCouponsAggregation(
    cartValue,
    applicableProducts,
    customerType
  );
  const applicableCoupons = await CouponModel.aggregate(aggregationPipeline);

  const discounts = applicableCoupons.map((coupon) => ({
    couponId: coupon._id,
    couponCode: coupon.code,
    discountDetails: coupon.discountDetails,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        discounts,
        "Applicable coupons retrieved successfully"
      )
    );
});

// Apply a specific coupon to the cart
export const applyCoupon = asyncHandler(async (req, res) => {
  const { cartItems } = req.body; // Array of cart items
  validateCart(cartItems);

  const { id: idOrCode } = req.params;

  const coupon = isValidObjectId(idOrCode)
    ? await CouponModel.findById(idOrCode)
    : await CouponModel.findOne({ code: idOrCode });
  validateCoupon(coupon);

  let updatedCart;
  
  if (coupon.type === "cart-wise") {
    const cartValue = cartItems.reduce((acc, item) => {
      return (acc += item.price);
    }, 0);
    if (cartValue < coupon.conditions.minCartValue) {
      throw new ApiError(400, "Insufficient cart value");
    }
    const { type, value, maxValue } = coupon.discountDetails;

    let discount;
    if (type === "percentage") {
      discount = cartValue * (value / 100);
      if (maxValue) {
        discount = Math.min(discount, maxValue);
      }
    } else {
      discount = value;
    }
    const numItems = cartItems.length;
    updatedCart = cartItems.map((item) => {
      return {
        ...item,
        discountedPrice: item.price - discount / numItems,
      };
    });
  }

  if (coupon.type === "product-wise") {
    updatedCart = cartItems.map((item) => {
      if (!coupon.conditions.applicableProducts.includes(item.productId))
        return item;
      const discountAmount =
        coupon.discountDetails.type === "percentage"
          ? (item.price * coupon.discountDetails.value) / 100
          : coupon.discountDetails.value;
      return {
        ...item,
        discountedPrice: Math.max(0, item.price - discountAmount), // Ensure discounted price is not negative
      };
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCart, "Coupon applied successfully"));
});
