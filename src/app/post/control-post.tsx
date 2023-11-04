import { CreatePost } from "./create-post";
import PostBlock from "./block-post";
import { api } from "~/trpc/server";
import Block from "../_components/general-block";
import TextHeaderGeneral from "../_components/general-text-header";

async function PostControl() {
      const currentChannel = await api.user.getCurrentChannel.query();
  return (
    <Block className="w-full">
                <TextHeaderGeneral
            text="Posts"
            />
      {currentChannel && currentChannel.posts.length > 0 ? (
        <div className="flex flex-col gap-2">
          {currentChannel.posts.map((post) => (
            <PostBlock
            key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <CreatePost />
    </Block>
  );
}

export default PostControl;