const Joi = require("joi");

const userSchema = Joi.object({
  firstName: Joi.string().min(2).required().messages({
    "string.base": "First name must be a string",
    "string.min": "First name must be at least 2 characters long",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().min(2).required().messages({
    "string.base": "Last name must be a string",
    "string.min": "Last name must be at least 2 characters long",
    "any.required": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "any.required": "Email is required",
  }),
  phoneNumber: Joi.string().pattern(/^\d+$/).required().messages({
    "string.pattern.base": "Phone number must contain only digits",
    "any.required": "Phone number is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.any().equal(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "any.required": "Confirm password is required",
  }),
  termsAccepted: Joi.boolean().valid(true).required().messages({
    "any.only": "You must accept the terms and conditions",
    "any.required": "Terms acceptance is required",
  }),
});

const newPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.any().equal(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "any.required": "Confirm password is required",
  }),
});

const recoveryEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "any.required": "Email is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

const ContactSchema = Joi.object({
  fullName: Joi.string().min(2).required().messages({
    "string.base": "First name must be a string",
    "string.min": "First name must be at least 2 characters long",
    "any.required": "First name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "any.required": "Email is required",
  }),
  message: Joi.string().max(2000).required().messages({
    "string.base": "Message must be a string.",
    "string.empty": "Message is required.",
    "string.max": "Message can be at most 2000 characters long.",
    "any.required": "Message is required.",
  }),
  phoneNumber: Joi.string().pattern(/^\d+$/).required().messages({
    "string.pattern.base": "Phone number must contain only digits",
    "any.required": "Phone number is required",
  }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    "string.base": "Product name must be a string.",
    "string.empty": "Product name is required.",
    "string.min": "Product name should have a minimum length of 3.",
    "string.max": "Product name should have a maximum length of 255.",
    "any.required": "Product name is required.",
  }),

  id: Joi.string().required().messages({
    "string.base": "id must be a string.",
    "string.empty": "id is required.",
    "any.required": "id is required.",
  }),

  description: Joi.string().max(2000).required().messages({
    "string.base": "Description must be a string.",
    "string.empty": "Description is required.",
    "string.max": "Description can be at most 2000 characters long.",
    "any.required": "Description is required.",
  }),

  stock: Joi.alternatives()
    .try(
      Joi.string()
        .pattern(/^\d+(\.\d{1,2})?$/, "Stock must be a valid number")
        .messages({
          "string.base": "Stock must be a string.",
          "string.pattern.base":
            "Stock must be a positive number and can have up to two decimal places.",
        }),
      Joi.number().positive().precision(2).messages({
        "number.base": "Stock must be a valid number.",
        "number.positive": "Stock must be a positive number.",
        "number.precision": "Stock can have up to two decimal places.",
      })
    )
    .required()
    .messages({
      "any.required": "Stock is required.",
    }),

  price: Joi.alternatives()
    .try(
      Joi.number().positive().precision(2).messages({
        "number.base": "Price must be a number.",
        "number.positive": "Price must be a positive number.",
        "number.precision": "Price can have up to two decimal places.",
        "any.required": "Price is required.",
      }),
      Joi.string()
        .pattern(/^\d+(\.\d{1,2})?$/, "Price must be a valid number")
        .messages({
          "string.base": "Price must be a string.",
          "string.pattern.base":
            "Price must be a positive number and can have up to two decimal places.",
        })
    )
    .required()
    .messages({
      "any.required": "Price is required.",
    }),

  imageUrl: Joi.string().uri().required().messages({
    "string.base": "Image URL must be a valid URI.",
    "string.empty": "Image URL is required.",
    "any.required": "Image URL is required.",
  }),

  category: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      "array.base": "Category must be an array.",
      "array.min": "At least one category is required.",
      "string.base": "Each category must be a string.",
      "any.required": "Category is required.",
    }),

  tag: Joi.array().items(Joi.string().required()).min(1).required().messages({
    "array.base": "Tag must be an array.",
    "array.min": "At least on tag is required.",
    "string.base": "Each Tag must be a string",
    "any.required": "Tag is required",
  }),

  ratings: Joi.object({
    averageRating: Joi.string()
      .pattern(/^[0-5]$/, "Rating must be a number between 0 and 5")
      .default("0"),
  }).messages({
    "object.base": "Ratings must be an object.",
    "string.pattern.base": "Rating must be a number between 0 and 5",
  }),
});

const deleteProductSchema = Joi.object({
  deleteProductId: Joi.string().required().messages({
    "string.base": "id must be a string.",
    "string.empty": "id is required.",
    "any.required": "id is required.",
  }),
});

const updatePaymentSchema = Joi.object({
  orderId: Joi.string().required().messages({
    "string.base": "id must be a string.",
    "string.empty": "id is required.",
    "any.required": "id is required.",
  }),
  paymentStatus: Joi.string().required().messages({
    "string.base": "paymentStatus must be a string.",
    "string.empty": "paymentStatus is required.",
    "any.required": "paymentStatus is required.",
  }),
});

const updateStatusSchema = Joi.object({
  orderId: Joi.string().required().messages({
    "string.base": "id must be a string.",
    "string.empty": "id is required.",
    "any.required": "id is required.",
  }),
  status: Joi.string().required().messages({
    "string.base": "paymentStatus must be a string.",
    "string.empty": "paymentStatus is required.",
    "any.required": "paymentStatus is required.",
  }),
});

const productSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    "string.base": "Product name must be a string.",
    "string.empty": "Product name is required.",
    "string.min": "Product name should have a minimum length of 3.",
    "string.max": "Product name should have a maximum length of 255.",
    "any.required": "Product name is required.",
  }),

  description: Joi.string().max(2000).required().messages({
    "string.base": "Description must be a string.",
    "string.empty": "Description is required.",
    "string.max": "Description can be at most 2000 characters long.",
    "any.required": "Description is required.",
  }),

  price: Joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/, "Price must be a valid number")
    .required()
    .messages({
      "string.base": "Price must be a string.",
      "string.pattern.base":
        "Price must be a positive number and can have up to two decimal places.",
      "any.required": "Price is required.",
    }),

  imageUrl: Joi.string().uri().required().messages({
    "string.base": "Image URL must be a valid URI.",
    "string.empty": "Image URL is required.",
    "any.required": "Image URL is required.",
  }),

  category: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      "array.base": "Category must be an array.",
      "array.min": "At least one category is required.",
      "string.base": "Each category must be a string.",
      "any.required": "Category is required.",
    }),

  tag: Joi.array().items(Joi.string().required()).min(1).required().messages({
    "array.base": "Tag must be an array.",
    "array.min": "At least on tag is required.",
    "string.base": "Each Tag must be a string",
    "any.required": "Tag is required",
  }),

  ratings: Joi.object({
    averageRating: Joi.string()
      .pattern(/^[0-5]$/, "Rating must be a number between 0 and 5")
      .default("0"),
  }).messages({
    "object.base": "Ratings must be an object.",
    "string.pattern.base": "Rating must be a number between 0 and 5",
  }),

  stock: Joi.string()
    .required()
    .pattern(/^\d+(\.\d{1,2})?$/, "Stock must be a valid number")
    .messages({
      "string.pattern.base": "Rating must be a number between 0 and 5",
      "any.required": "Stock is required.",
    }),
});

const categorySchema = Joi.object({
  category: Joi.string().min(1).max(255).required().messages({
    "string.base": "Category must be a string.",
    "string.empty": "Category is required.",
    "string.min": "Category should have a minimum length of 0.",
    "string.max": "Category should have a maximum length of 255.",
    "any.required": "Category is required.",
  }),
});

const updateCategorySchema = Joi.object({
  category: Joi.string().required().messages({
    "string.base": "category must be a valid string.",
    "any.required": "category is required.",
  }),
});

const updateTagSchema = Joi.object({
  tag: Joi.string().required().messages({
    "string.base": "tag must be a valid string.",
    "any.required": "tag is required.",
  }),
});

const deleteFromCartSchema = Joi.object({
  productId: Joi.string().required().messages({
    "string.base": "Product ID must be a valid string.",
    "any.required": "Product ID is required.",
  }),
});

const cartItemSchema = Joi.object({
  productId: Joi.string().required().messages({
    "string.base": "Product ID must be a valid string.",
    "any.required": "Product ID is required.",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number.",
    "number.integer": "Quantity must be an integer.",
    "number.min": "Quantity must be at least 1.",
    "any.required": "Quantity is required.",
  }),
});

const cartSchema = Joi.object({
  items: Joi.array().items(cartItemSchema).min(1).required().messages({
    "array.base": "Items must be an array.",
    "array.min": "Cart must contain at least one item.",
    "any.required": "Items are required.",
  }),
});

const cartValidation = (cart) => {
  return cartSchema.validate(cart, { abortEarly: false });
};

const billingInfoValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  address: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
});

const favoriteValidationSchema = Joi.object({
  productId: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  imageUrl: Joi.array().required(),
  stock: Joi.number().required(),
});

module.exports = {
  userSchema,
  loginSchema,
  productSchema,
  categorySchema,
  cartValidation,
  deleteFromCartSchema,
  cartItemSchema,
  billingInfoValidationSchema,
  favoriteValidationSchema,
  updateProductSchema,
  deleteProductSchema,
  updatePaymentSchema,
  ContactSchema,
  recoveryEmailSchema,
  newPasswordSchema,
  updateStatusSchema,
  updateCategorySchema,
  updateTagSchema,
};
