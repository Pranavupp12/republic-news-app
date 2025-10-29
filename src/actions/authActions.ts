"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function handleSignUp(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, error: "All fields are required." };
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "User with this email already exists." };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { name, email, password: hashedPassword } });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Something went wrong." };
  }
}