const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    /* =====================
       BASIC INFO
    ===================== */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    /* =====================
       AUTH
    ===================== */
    password: {
      type: String,
      required: true,
      select: false, // never return password
    },

    role: {
      type: String,
      enum: ["admin", "broker", "client"],
      default: "client",
    },

    /* =====================
       STATUS FLAGS
    ===================== */
    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    /* =====================
       DATES
    ===================== */
    joinedAt: {
      type: Date,
      default: Date.now, // explicit joined date
    },
  },
  {
    timestamps: true, // createdAt, updatedAt (system timestamps)
  }
);

/* =========================
   PASSWORD HASHING
========================= */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* =========================
   PASSWORD COMPARISON
========================= */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
