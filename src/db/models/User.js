const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const EMAIL_PATTERN = /^([a-z]+)@([a-z]+)\.([a-z]+)$/;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator(value) {
          return EMAIL_PATTERN.test(value);
        },
        message: "Email must be valid and may contain only english letters",
      },
    },
    hashedPassword: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    collation: { locale: "en" },
  }
);

const User = model("USER", userSchema);

module.exports = User;
