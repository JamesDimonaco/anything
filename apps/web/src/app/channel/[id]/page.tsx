import Block from "../.././_components/general-block";
import PostControl from "../../post/control-post";
import NearbyControl from "../../user/nearby-control";
import TextHeaderGeneral from "../../_components/general-text-header";

export default function ChannelPage({ params }: { params: { id: string } }) {
  const channelId = parseInt(params.id);

  return (
    <>
      {/* Center Column for tablets and big screens only */}
      <div className="h-full flex-col md:flex">
        {/* Posts at the bottom middle */}
        <Block>
          <PostControl channelId={channelId} />
        </Block>
      </div>

      {/* Right Column for big screens only */}
      <div className="h-full flex-col lg:flex">
        <Block>
          <TextHeaderGeneral text="Friends" />
        </Block>
        <Block>
          <TextHeaderGeneral text="In this Channel" />
          <NearbyControl />
        </Block>

        <Block>
          <TextHeaderGeneral text="Notifications" />
          {/* Add the content of the Notifications block here */}
        </Block>
      </div>
    </>
  );
}
