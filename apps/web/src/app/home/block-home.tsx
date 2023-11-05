import { getServerAuthSession } from "../../server/auth";
import Block from "../_components/general-block";
import TextHeaderGeneral from "../_components/general-text-header";
import PostBlock from "../post/block-post";
import { CreatePost } from "../post/create-post";
import type { OwnChannel } from "./control-home";
// extend post with the createdBy as users

interface HomeBlockProps {
  channel: OwnChannel;
}

const HomeBlock: React.FC<HomeBlockProps> = async ({ channel }) => {
  const session = await getServerAuthSession();
  return (
    <Block className="px-4 py-2 text-white/80">
      <TextHeaderGeneral text={"My Channel"} />
      {channel && channel.posts.length > 0 ? (
        <div className="flex h-96 overflow-y-auto flex-col items-center justify-between mb-4">
          <ul className="w-full">
            {channel.posts.map((post) => (
              <li key={post.id} className="mb-3">
                <PostBlock sessionUserId={session?.user.id ?? "420"} post={post} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="my-4 text-center">
          <p>You have no posts yet. Why not create one?</p>
        </div>
      )}
      <CreatePost />
    </Block>
  );
};

export default HomeBlock;
