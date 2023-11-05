import { api } from "../../trpc/server";
import HomeBlock from "./block-home";
import type { Post as PurePost, Channel as PureChannel, User } from "@prisma/client";

interface Post extends PurePost {
  createdBy: User;
}

export interface OwnChannel extends PureChannel {
  posts: Post[];
  createdBy: User;
  createdById: string;
}

const HomeControl = async () => {
  const homeChannel= await api.channel.getOwn.query() as unknown as OwnChannel;

  return <HomeBlock channel={homeChannel} />;
};

export default HomeControl;
