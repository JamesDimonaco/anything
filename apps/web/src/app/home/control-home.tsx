import { api } from "../../trpc/server";
import HomeBlock from "./block-home";

const HomeControl = async () => {
  const homeChannel = await api.channel.getOwn.query();

  return <HomeBlock channel={homeChannel} />;
};

export default HomeControl;
