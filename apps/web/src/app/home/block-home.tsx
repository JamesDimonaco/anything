import Block from "../_components/general-block";
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
    <Block className="flex flex-col items-center justify-between px-4 py-2 text-white/80">
      <p>My Channel</p>
      {channel && channel.posts.length > 0 ? (
        <div>
          <ul>
            {channel.posts.map((post) => (
              <PostBlock
                post={post}
                key={post.id}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <CreatePost />
    </Block>
  );
};

export default HomeBlock;
