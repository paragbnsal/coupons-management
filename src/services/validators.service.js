import { ApiError } from "../utils/ApiError.js";

// Validation function for required fields
// Most validations are already handled by MongoDB.
export function validateCouponFields(fields) {
  const { type, discountDetails, conditions, expiryDate } = fields;
  if (
    discountDetails.type === "percentage" &&
    (discountDetails.value < 0 || discountDetails.value > 100)
  ) {
    throw new ApiError(
      400,
      "Invalid input: discountDetails.value must be between 0 and 100 for percentage discounts"
    );
  }

  if (type === "cart-wise" && conditions.minCartValue == null) {
    throw new ApiError(
      400,
      "Invalid input: minCartValue is required for cart-wise coupons"
    );
  }

  if (
    type === "product-wise" &&
    !Array.isArray(conditions.applicableProducts)
  ) {
    throw new ApiError(
      400,
      "Invalid input: array of product ids is required for product-wise coupons"
    );
  }

  if (
    type === "product-wise" &&
    discountDetails.type === "percentage" &&
    discountDetails.maxValue
  ) {
    throw new ApiError(
      400,
      `Invalid input:${discountDetails.value}% upto Rs. ${discountDetails.maxValue} feature not supported for product-wise coupon`
    );
  }

  if (conditions.seasonal) {
    if (!conditions.startDate || !conditions.endDate)
      throw new ApiError(
        400,
        "For seasonal coupons, startDate and endDate are required"
      );

    if (new Date(conditions.startDate) > new Date(conditions.endDate))
      throw new ApiError(400, "startDate should be earlier than endDate");
  }
}

export function validateCoupon(coupon) {
  if (!coupon) throw new ApiError(404, "Coupon not found");
  if (new Date() > coupon.expiryDate) {
    throw new ApiError(400, "This coupon has expired");
  }
  if (
    coupon.conditions.seasonal &&
    (new Date() < coupon.conditions.startDate ||
      new Date() > coupon.conditions.endDate)
  ) {
    throw new ApiError(
      400,
      "This coupon is not valid during the current period"
    );
  }
}

export function validateCart(cartItems) {
  if (
    !cartItems ||
    !Array.isArray(cartItems) ||
    !cartItems.every((item) => item.price != null && item.productId != null)
  ) {
    throw new ApiError(
      400,
      "Invalid input: cartItems must be an array with price defined"
    );
  }
}
