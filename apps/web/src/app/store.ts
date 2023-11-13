import type { User } from "@prisma/client";
import { create } from "zustand";

export const userStore = create<User>((set) => ({
  name: null,
  currentChannelId: 420,
  email: null,
  id: "",
  image: null,
  status: null,
  emailVerified: null,
  homeChannelId: 420,
}));
