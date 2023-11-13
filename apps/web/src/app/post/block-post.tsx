import type { Post as PostWithUser, User } from "@prisma/client";
import { PostActions } from "./actions-post";
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
    <div className={`flex rounded-xl bg-opacity-20 bg-gradient-to-tr from-black w-full ${isSessionUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`grid grid-cols-3 justify-between items-center w-full max-w-xl p-4 rounded-lg
        `}
      >
              {isSessionUser ? (
                <div>
                  <p className="text-white/80 text-sm">{timeSince(post.createdAt)}</p>
                            <span className={`${isSessionUser ? "bg-blue-700 ml-auto" : "bg-gray-800 mr-auto"} rounded-lg px-2 py-1 mr-4`}>{post.createdBy.name}:</span>
                  </div>
        ) : <div></div>
          }


        <p
          className={`text-white/80 transition hover:text-white ${
            isSessionUser ? "font-bold text-right" : "text-left"
          }`}
        >


        {post.name}
          
        </p>
        {isSessionUser ? (
                  <PostActions post={post} />
        ) : (
          <div>
          <p className="text-white/80 text-xs">{timeSince(post.createdAt)}</p>
                    <span className={`${isSessionUser ? "bg-blue-700 ml-auto" : "bg-gray-800 mr-auto"} rounded-lg px-2 py-1 mr-4`}>{post.createdBy.name}:</span>
                    </div>
        )
          }

      </div>
    </div>
  );
};

export default PostBlock;
