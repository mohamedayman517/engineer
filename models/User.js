const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "الاسم مطلوب"],
      trim: true,
      minlength: [2, "الاسم يجب أن يكون أكثر من حرفين"],
      maxlength: [50, "الاسم يجب أن يكون أقل من 50 حرف"],
    },
    email: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "يرجى إدخال بريد إلكتروني صحيح",
      ],
    },
    password: {
      type: String,
      required: [true, "كلمة المرور مطلوبة"],
      minlength: [6, "كلمة المرور يجب أن تكون أكثر من 6 أحرف"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "engineer"],
      default: "user",
    },
    specialization: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// تشفير كلمة المرور قبل الحفظ
userSchema.pre("save", async function (next) {
  // إذا لم تتغير كلمة المرور، لا نحتاج لتشفيرها مرة أخرى
  if (!this.isModified("password")) return next();

  try {
    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// دالة للتحقق من كلمة المرور
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// دالة للحصول على بيانات المستخدم بدون كلمة المرور
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
