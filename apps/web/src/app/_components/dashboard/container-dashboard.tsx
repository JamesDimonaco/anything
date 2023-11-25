"use client";
import { useSession } from 'next-auth/react';
import DefaultAvatar from '../avatar/dashboardAvatars';

interface DashboardContainerProps {
  children?: React.ReactNode;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => {
  const user = useSession().data?.user;

  return (
    <div className='text-white'>
      <div className="rounded-lg bg-black bg-opacity-20 p-5 backdrop-blur-md shadow-lg">
        {user?.name}
      </div>
      <DefaultAvatar />

      {children}
      <footer className="absolute bottom-0 bg-black bg-opacity-20 p-5 backdrop-blur-md w-screen shadow-lg ">
       color picker
       <div className="flex flex-row w-full justify-center gap-x-5">
        <div className="rounded-lg bg-red-500 w-9 h-9">
        </div>
        <div className="rounded-lg bg-green-500 w-9 h-9">
        </div>
        <div className="rounded-lg bg-blue-500 w-9 h-9">
        </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardContainer;
