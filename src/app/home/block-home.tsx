import Block from "../_components/general-block";
import TextHeaderGeneral from "../_components/general-text-header";
import PostBlock from "../post/block-post";
import { CreatePost } from "../post/create-post";

interface HomeBlockProps {
  channel: {
    posts: {
      id: number;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      createdById: string;
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
      channelId: number | null;
    }[];
  } | null;
}

const HomeBlock: React.FC<HomeBlockProps> = ({ channel }) => {
  return (
    <Block className="px-4 py-2 text-white/80">
      <TextHeaderGeneral text={"My Channel"} />
      {channel && channel.posts.length > 0 ? (
        <div className="flex flex-col items-center justify-between mb-4">
          <ul className="w-full">
            {channel.posts.map((post) => (
              <li key={post.id} className="mb-3">
                <PostBlock post={post} />
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
