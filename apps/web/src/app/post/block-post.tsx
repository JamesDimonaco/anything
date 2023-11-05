import type { Post as PostWithUser, User } from "@prisma/client";
import { DeletePost } from "./delete-post";
import { timeSince } from "../channel/utilities-channel";

interface Post extends PostWithUser {
  createdBy: User;
}
interface PostBlockInterface {
  post: Post;
  sessionUserId: string; // Assuming the ID is a string. Adjust if needed.
}

const PostBlock = ({ post, sessionUserId }: PostBlockInterface) => {
  const isSessionUser = post.createdBy.id === sessionUserId;
  return (
    <div className={`flex w-full justify-between ${isSessionUser ? 'bg-blue-700' : 'bg-gray-800'}`}> 
      <p className={`text-white/80 transition hover:text-white ${isSessionUser ? 'font-bold' : ''}`}>
        {timeSince(post.createdAt)} {post.createdBy.name}: {post.name}
      </p>
      <DeletePost post={post} />
    </div>
  );
};

export default PostBlock;
