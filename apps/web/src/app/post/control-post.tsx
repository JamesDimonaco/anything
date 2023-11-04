import { CreatePost } from "./create-post";
import PostBlock from "./block-post";
import { api } from "../../trpc/server";
import Block from "../_components/general-block";
import TextHeaderGeneral from "../_components/general-text-header";
import ClientPostSocket from "./client-post-socket";

async function PostControl() {
  const currentChannel = await api.user.getCurrentChannel.query();
  return (
    <Block className="w-full">
      <TextHeaderGeneral text="Posts" />
      <ClientPostSocket channel={currentChannel} />
      <CreatePost />
    </Block>
  );
}

export default PostControl;
