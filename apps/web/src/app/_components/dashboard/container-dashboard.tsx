"use client";
import { useSession } from "next-auth/react";
import DefaultAvatar from "../avatar/dashboardAvatars";

interface DashboardContainerProps {
  children?: React.ReactNode;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  children,
}) => {
  const user = useSession().data?.user;

  return (
    <>
      <DefaultAvatar />
      {children}
    </>
  );
};

export default DashboardContainer;
