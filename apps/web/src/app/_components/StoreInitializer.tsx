"use client";

import { useRef } from "react";
import type { User } from "@prisma/client";
import { userStore } from "../store";

function StoreInitializer({ name, homeChannelId }: User) {
  const initialzied = useRef(false);
  if (!initialzied.current) {
    userStore.setState({ name, homeChannelId });
    initialzied.current = true;
  }
  return null;
}
export default StoreInitializer;
