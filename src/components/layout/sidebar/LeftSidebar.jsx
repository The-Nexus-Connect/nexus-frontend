import { Link, useLocation } from 'react-router-dom';
import { AiFillFlag } from "react-icons/ai";
import { MdLeaderboard } from 'react-icons/md';
import { HiSpeakerphone } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { fetchUserData } from '../../../services/userServices';
import { Avatar, Box, Text } from '@chakra-ui/react';

const LeftSidebar = () => {
    const [userData, setUserData] = useState({});
    const location = useLocation();
    const backendUrl =
    import.meta.env.VITE_BACKEND_URI || "http://localhost:5001";

    useEffect(() => {
        fetchUserData().then(data => {
            if (data) {
                setUserData(data);
            }
        });
    }, []);

    const navLinks = [
        { to: '/challenges', name: 'Challenges', icon: <AiFillFlag className="w-5 h-5 mx-2" /> },
        { to: '/leaderboard', name: 'Leaderboard', icon: <MdLeaderboard className="w-5 h-5 mx-2" /> },
        { to: '/announcement', name: 'Announcement', icon: <HiSpeakerphone className="w-5 h-5 mx-2" /> },
    ];

    return (
        <div className="h-full w-1/4 flex flex-col justify-between sm:max-lg:w-1/6 min-[320px]:max-sm:hidden">
            <Box className="flex flex-col items-center my-11">
                <Avatar boxSize="150px" src={`${backendUrl}${userData.userImage}`} />
                <Text mt={2} fontSize="lg" fontWeight="bold">{userData.username}</Text>
            </Box>
            <div className="flex flex-col space-y-5 justify-between my-5">
                {navLinks.map((link) => {
                    const isActive = location.pathname.startsWith(link.to);
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center rounded ${isActive ? 'bg-zinc-700/50' : 'bg-zinc-900/25 hover:bg-zinc-800/40'
                                } font-bold py-2 px-4 mx-5`}
                        >
                            {link.icon}
                            <span className="sm:max-lg:hidden">{link.name}</span>
                        </Link>
                    );
                })}
            </div>
            <div className="flex flex-col justify-between mt-auto mx-5 mb-3 space-y-5">
            </div>
        </div>
    );
}

export default LeftSidebar;