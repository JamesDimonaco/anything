import type { Post } from "@prisma/client";
import { DeletePost } from "./delete-post";
import { timeSince } from "../channel/utilities-channel";

const PostBlock = ({
  post,
}: {
  post: {
    createdAt: Date;
    name: string;
    id: number;
    createdBy: {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
      status: string | null;
      currentChannelId: number;
      homeChannelId: number;
    };
  };
}) => {
  return (
    <div className="flex w-full justify-between">
      <p className="text-white/80 transition hover:text-white">
        {timeSince(post.createdAt.toISOString())} {post.createdBy.name}: {post.name}
      </p>
      {/* delete button */}
      <DeletePost post={post} />
    </div>
  );
};

export default PostBlock;
