import Block from "../_components/general-block";
import TextHeaderGeneral from "../_components/general-text-header";
import { CreatePost } from "../post/create-post";
import ClientHomeSocket from "./client-home-socket";
import type { OwnChannel } from "./control-home";

interface HomeBlockProps {
  channel: OwnChannel;
}
//! Maybe we could consider getting the session here and passing it as props. might imporve preformance
const HomeBlock: React.FC<HomeBlockProps> = ({ channel }) => {
  return (
    <Block className="px-4 py-2 text-white/80">
      <TextHeaderGeneral text={"My Channel"} />
      <ClientHomeSocket channel={channel} />
      <CreatePost />
    </Block>
  );
};

export default HomeBlock;
