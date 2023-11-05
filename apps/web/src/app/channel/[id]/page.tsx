import Link from "next/link";
import { getServerAuthSession } from "../../../server/auth";
import Block from "../.././_components/general-block";
import Container from "../../_components/general-container";
import ChannelControl from "../../channel/control-channels";
import PostControl from "../../post/control-post";
import NearbyControl from "../../user/nearby-control";
import TextHeaderGeneral from "../../_components/general-text-header";
import HomeControl from "../../home/control-home";
import NavBar from "../../_components/general-navbar";

export default function ChannelPage({ params }: { params: { id: string } }) {
  const channelId = parseInt(params.id);

  return (
    <>
      {/* Center Column for tablets and big screens only */}
      <div className="h-full flex-col md:flex">
        <div className="flex-grow"></div>
        {/* Posts at the bottom middle */}
        <PostControl channelId={channelId} />
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

        <div className="flex-grow"></div>
        <Block>
          <TextHeaderGeneral text="Notifications" />
          {/* Add the content of the Notifications block here */}
        </Block>
      </div>
    </>
  );
}
