import { api } from "~/trpc/server";

async function NearbyControl() {
  let members;

  try {
    const userData = await api.user.getCurrentChannel.query();
    const data = await api.channel.getMembers.query({
      channelId: userData?.currentChannelId ?? 420,
    });

    members = data ? data.members : null;
  } catch (error) {
    console.error("Failed to fetch members", error);
    members = null;
  }

  if (!members) {
    return <p>No members found or an error occurred.</p>;
  }

  return (
    <div>
      {members.map((member) => (
        <div key={member.id}>
          <p>{member.name}</p>
        </div>
      ))}
    </div>
  );
}

export default NearbyControl;