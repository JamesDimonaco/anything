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
        <span className="font-bold"> {post.createdBy.name}</span>: <span className="">{post.name}</span>
      </p>
      <div className="flex">
              <span className="uppercase text-gray-300 text-sm p-1 rounded-xl">{timeSince(post.createdAt.toISOString())}</span> 
        
      {/* delete button */}
      <DeletePost post={post} />
      </div>
    </div>
  );
};

export default PostBlock;
