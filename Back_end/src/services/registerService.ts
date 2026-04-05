import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// ==========================
// 🧾 TYPES
// ==========================
type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "ORGANIZER" | undefined;
  referralCode?: string;
};

// ==========================
// 🔑 REF CODE GENERATOR
// ==========================
function generateRefCode(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

async function getUniqueRefCode(): Promise<string> {
  let code = generateRefCode();

  let existing = await prisma.user.findUnique({
    where: { refCode: code },
  });

  while (existing) {
    code = generateRefCode();

    existing = await prisma.user.findUnique({
      where: { refCode: code },
    });
  }

  return code;
}

// ==========================
// 🚀 REGISTER SERVICE
// ==========================
export async function registerService(data: RegisterInput) {
  const { name, email, password, role, referralCode } = data;

  // ==========================
  // 📧 CHECK EXISTING EMAIL
  // ==========================
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // ==========================
  // 🔐 HASH PASSWORD
  // ==========================
  const hashedPassword = await bcrypt.hash(password, 10);

  // ==========================
  // 🔎 CHECK REFERRAL
  // ==========================
  let referrer = null;

  if (referralCode) {
    referrer = await prisma.user.findUnique({
      where: { refCode: referralCode },
    });

    if (!referrer) {
      throw new Error("Invalid referral code");
    }
  }

  const DEFAULT_AVATAR = process.env.CLOUDINARY_DEFAULT_AVATAR!;

  // ==========================
  // 💥 DB TRANSACTION
  // ==========================
  const result = await prisma.$transaction(async (tx) => {
    // 👤 CREATE USER
    const createdUser = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role ?? "CUSTOMER",
        profilePic: DEFAULT_AVATAR,
        refCode: await getUniqueRefCode(),
        referredById: referrer ? referrer.id : null,
      },
    });

    // ==========================
    // 🎁 REFERRAL REWARD LOGIC
    // ==========================
    if (referrer) {
      const now = new Date();

      // 🎟 COUPON FOR NEW USER
      const couponExpiry = new Date(now);
      couponExpiry.setMonth(couponExpiry.getMonth() + 3);

      await tx.coupon.create({
        data: {
          userId: createdUser.id,
          discountAmount: 10000,
          expiresAt: couponExpiry,
        },
      });

      // 💰 POINTS FOR REFERRER
      const pointExpiry = new Date(now);
      pointExpiry.setMonth(pointExpiry.getMonth() + 3);

      await tx.point.create({
        data: {
          userId: referrer.id,
          amount: 10000,
          expiresAt: pointExpiry,
        },
      });
    }

    return createdUser;
  });

  return result;
}
