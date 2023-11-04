import { User } from "@prisma/client";

const UserBlock = ({ user }: { user: User }) => {
    return (
        <div className="flex w-full justify-between">
        <p className="text-white/80 transition hover:text-white">
            <span className="font-bold text-xl">{user.name}</span> 
        </p>
        </div>
    );
}

export default UserBlock;