import { CreatePost } from "./create-post";
import PostBlock from "./block-post";

function PostControl({ channel }: { channel: {
    currentChannelId: number;
    posts: {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        channelId: number | null;
    }[];
} | null }) {
  return (
    <div className="w-full max-w-xs">
      {channel && channel.posts.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p>Your posts:</p>
          {channel?.posts.map((post) => (
            <PostBlock key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}

export default PostControl;