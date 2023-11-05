import { getServerAuthSession } from "../../server/auth";
import { api } from "../../trpc/server";
import { createOwnChannel } from "./actions-channel";
import Channels from "./list-channel";

async function ChannelControl({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  const channelId = parseInt(params.id);

  let publicChannels;
  let ownChannel;

  try {
    publicChannels = await api.channel.getPublic.query();
    ownChannel = publicChannels.find(
      (channel) => channel.authorId === session?.user?.id,
    );

    if (!ownChannel) {
      ownChannel = await createOwnChannel();
    }
  } catch (error) {
    console.error("Failed to fetch channel data", error);
    return <p>Error loading channels.</p>;
  }

  return (
    <>
      <Channels currentChannelId={channelId} channels={publicChannels} />
    </>
  );
}

export default ChannelControl;
