# Coupon Management API: Simplify Discounts and Promotions

## Introduction

The Coupon Management API is a backend service designed to create, manage, and apply various types of discount coupons efficiently. It supports fixed and percentage discounts, allows defining usage conditions like cart value, customer type, and seasonal availability, and tracks coupon usage limits. This flexible system helps businesses run effective promotions while ensuring comprehensive validation and effortless coupon management to enhance customer experience and boost sales with ease.

## Installation

Clone the repository:

```
git clone git@github.com:paragbnsal/coupons-management.git
cd coupons-management
```

Install Dependencies

```
npm install
```

## Environment Setup

Create a .env file: In the root directory of the project, create a .env file to store your environment variables. At a minimum, you need to specify your MongoDB connection string and PORT. Sample .env file is added below

```
API_PORT=4001
MONGO_URI=mongodb://your-username:your-password@your-mongodb-host:your-mongodb-port/your-database-name
```

## Running the Application

To start the application, run the following command in the root directory:

```
npm start
```

This command will start the Node.js server and connect to the MongoDB instance using the connection string provided in the .env file.

## Postman Collection

[Publicly accessible link](https://documenter.getpostman.com/view/16494406/2sAXqzWxsJ) of a Postman Collection for testing the APIs.
## Assumption and Limitations

- The quantity of each product in the cart is assumed to be one.
- X% upto Rs. Y not supported for product-wise coupon.
- The time zone used is Indian Standard Time (IST). To support other time zones, epoch milliseconds (epoch_ms) can be utilized.
- Multiple currencies are not supported.
- All products are assumed to be in stock.
- The cart value is calculated after applying discounts on the MRP and includes applicable taxes.
- Combining multiple coupons is only partially implemented at this stage.

## Possible Use Cases for Coupon Management

### 1. Basic Discount Types

- **Percentage Discount**: A straightforward discount, like 10% off.
- **Fixed Amount Discount**: A coupon that gives a fixed amount off, e.g., Rs. 50 off any purchase.
- **Maximum Amount Discount**: A coupon that gives a maximum specified amount off, e.g., 20% off upto Rs. 100 on any purchase.
- **Free Shipping**: Eliminates the shipping cost for orders, usually with a minimum spend.

_**Note** - These discounts can be applicable either with or without a minimum cart value._

### 2. Usage Limits

- **Early Bird Offers**: The coupon can only be used a limited number of users (e.g., the first 100 users).
- **Single-Use Coupons**: Each user can use the coupon only once.
- **Per User Limit**: Each user can use the coupon up to a certain number of times (e.g., twice).

### 3. Purchase Constraints

- **Minimum Order Value**: Coupons that apply only if the user spends a minimum amount, e.g., Rs. 500 or more.
- **Bundle Discounts**: Discounts when certain products are bought together (e.g., a camera and a memory card).

### 4. Cart-Based Constraints

- **Category-Specific Discounts**: Coupons that apply to specific categories of products, e.g., electronics only.
- **Product-Specific Discounts**: Discounts valid for particular products only.
- **Buy X Get Y (BxGy)**: Offers like "Buy one, get one free" or "Buy two, get one at 50% off".
- **Spending Tiers**: The higher the cart value, the better the discount (e.g., 5% off for Rs. 500, 10% off for Rs. 1000).
- **Threshold-Based Discounts**: Spend more to save more, e.g., spend Rs. 500 and get Rs. 75 off.

### 5. Expiry Constraints

- **Fixed Expiry Date**: The coupon expires after a specific date.
- **Relative Expiry Date**: The coupon expires after a set time, like 7 days from the claimed date.
- **Coupons Valid for Certain Days**: E.g., "Weekend Only" or "Monday Happy Hour" discounts.
- **Seasonal/Festive Coupons**: Coupons valid only during certain events, like Holi, Diwali, or birthdays.

### 6. Customer-Based Constraints

- **All Users**: Coupons available for all customers.
- **New Users Only**: Coupons restricted to new customers only.
- **Email-Verified Users**: Coupons restricted to email-verified customers only.
- **Loyalty Coupons**: Available only for customers or users who belong to a specific loyalty program (Plus, Prime, Insider).
- **First Purchase Coupons**: Coupons only valid on a user's first order, or first order of a specific product category.
- **Age Discount**: Available for users above or below a specific age, like a student discount.
- **Gender Discount**: Available for users of a specific gender, like a female discount. (Extra 50 Rupees off for female customers.)
- **Geographic Coupons**: Coupons valid only for users from specific cities (Tier 1, Tier 2, etc).

### 7. Partner Brand Coupons

- **Partner Brand Discounts**: Discounts on products of partner brands or in collaboration with other companies.
- **Multi-Store Coupons**: Coupons that are valid in multiple stores or locations.

### 8. Referral Coupons

- **Refer a Friend**: Get a coupon if your referred friend makes a purchase.
- **Social Media Sharing**: Users get a discount for sharing a product or promotion on social media.

### 9. Combination Rules

- **Single Coupon Per Order**: Users can apply only one coupon per transaction.
- **Stackable Coupons**: Users can apply multiple coupons if allowed, e.g., a percentage discount plus a free shipping coupon.
- **Exclusivity**: Some coupons can't be clubbed with others, e.g., a "50% off" coupon may be exclusive.

### 10. Other Scenarios

- **Coupon Priority Rules**: If multiple coupons are applicable, determining which one should take priority.
- **Partial Discount with Balance Expiry**: Applying a coupon partially and expiring the balance after a certain time.
- **Multi-Currency Adjustments**: Coupons that adjust their discount value depending on the user's currency.
- **Minimum Quantity Restrictions**: A coupon only valid when buying more than a certain number of items (e.g., "10% off when you buy 3 or more").

### 11. Complex Rules

- **User Behavior-Based Coupons**: Triggered based on user actions, like abandoning a cart or repeated visits.
- **Added in Cart Discounts**: Discounts valid for products which are in cart for some days.
- **Personalized Coupons**: Based on user preferences or previous purchases (e.g., 10% off dog food for users who purchased pet products).
- **Coupon Code Exclusivity**: Unique codes sent to specific users, such as through email marketing.
