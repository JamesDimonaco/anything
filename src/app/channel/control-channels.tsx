import { api } from "~/trpc/server";
import { createOwnChannel } from "./actions-channel";
import Channels from "./list-channel";

async function ChannelControl() {
  let publicChannels;
  let ownChannel;
  let currentChannelId: number;

  try {
    publicChannels = await api.channel.getPublic.query();
    ownChannel =
      (await api.channel.getOwn.query()) ?? (await createOwnChannel());

    const currentChannelData = await api.user.getCurrentChannel.query();
    if (!currentChannelData) {
      throw new Error("Current channel data is null");
    }
    currentChannelId = currentChannelData.currentChannelId;
  } catch (error) {
    console.error("Failed to fetch channel data", error);
    // You should decide how to handle this error case
    // Maybe set the variables to defaults or return a special error component
    return <p>Error loading channels.</p>;
  }

  return (
    <>
      <Channels currentChannelId={currentChannelId} channels={publicChannels} ownChannel={ownChannel} />
      
    </>
  );
}

export default ChannelControl;