import { CreatePost } from "./create-post";
import { api } from "../../trpc/server";
import Block from "../_components/general-block";
import TextHeaderGeneral from "../_components/general-text-header";
import ClientPostSocket from "./client-post-socket";
import type { Post as PurePost, User } from "@prisma/client";

interface Post extends PurePost {
  createdBy: User;
}
interface Channel {
  posts: Post[];
  currentChannelId: number;
}

async function PostControl() {
  const currentChannelResponse = await api.user.getCurrentChannel.query();

  if (!currentChannelResponse) {
    throw new Error("Current channel is null");
  }

  const currentChannel: Channel = currentChannelResponse;

  return (
    <Block className="w-full">
      <TextHeaderGeneral text="Posts" />
      <ClientPostSocket channel={currentChannel} />
      <CreatePost />
    </Block>
  );
}

export default PostControl;
