import type { Post } from "@prisma/client";
import Link from "next/link";

const PostBlock = ({ post }: { post: Post }) => {
  return (
    <div className="flex w-full justify-between items-center bg-white/5 text-white/80 px-4 py-2">
      <p className="text-white/80 hover:text-white transition mr-16">{post.name}</p>
      <div className="w-32">
      </div>
      <Link href={`/posts/${post.id}`}>
        <p className="text-white/80 hover:text-white transition">Delete</p>
      </Link>
    </div>
  );
}

export default PostBlock;