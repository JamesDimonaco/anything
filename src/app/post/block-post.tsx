import type { Post } from "@prisma/client";
import Link from "next/link";

const PostBlock = ({ post }: { post: Post }) => {
  return (
    <div className="flex justify-between items-center bg-black/50 text-white/80 px-4 py-2">
      <p className="text-white/80 hover:text-white transition">{post.name}</p>
      <Link href={`/posts/${post.id}`}>
        <p className="text-white/80 hover:text-white transition">Delete</p>
      </Link>
    </div>
  );
}

export default PostBlock;