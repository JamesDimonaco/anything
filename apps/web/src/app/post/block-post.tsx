import type { Post as PostWithUser, User } from "@prisma/client";
import { DeletePost } from "./delete-post";
import { timeSince } from "../channel/utilities-channel";

interface Post extends PostWithUser {
  createdBy: User;
}
interface PostBlockInterface {
  post: Post;
}

const PostBlock = ({ post }: PostBlockInterface) => {
  return (
    <div className="flex w-full justify-between">
      <p className="text-white/80 transition hover:text-white">
        {timeSince(post.createdAt)} {post.createdBy.name}: {post.name}{" "}
      </p>
      {/* delete button */}
      <DeletePost post={post} />
    </div>
  );
};

export default PostBlock;
