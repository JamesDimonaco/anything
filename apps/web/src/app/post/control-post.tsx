import { CreatePost } from "./create-post";
import { api } from "../../trpc/server";
import Block from "../_components/general-block";
import TextHeaderGeneral from "../_components/general-text-header";
import ClientPostSocket from "./client-post-socket";
import type {
  Post as PurePost,
  User,
  Channel as PureChannel,
} from "@prisma/client";

interface Post extends PurePost {
  createdBy: User;
}
export interface Channel extends PureChannel {
  posts: Post[];
}

interface PostControlProps {
  channelId: number;
}

async function PostControl({ channelId }: PostControlProps) {
  const currentChannel = (await api.channel.getOne.query({
    id: channelId,
  })) as Channel;

  if (!currentChannel) {
    throw new Error("Current channel is null");
  }

  return (
    <Block className="w-full">
      <TextHeaderGeneral text="Posts" />
      <ClientPostSocket channel={currentChannel} />
      <CreatePost />
    </Block>
  );
}

export default PostControl;
