import StudentDetails from "./StudentDetails";
import { fetchUserData } from '../../../services/userServices';
import { useEffect, useState } from "react";
import { useToast } from '@chakra-ui/react';
import axios from "axios";


function StudentDetailsSection() {

    const toast = useToast();
    const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:5001";
    const apiKey = import.meta.env.VITE_API_KEY;
    const [userData, setUserData] = useState({});
    const [rollNo, setRollNo] = useState("");
    const [section, setSection] = useState("");


    useEffect(() => {
        fetchUserData().then((data) => {
            if (data) {
                setUserData(data);
            }
        });
    }, []);

    const handleRollNo = async () => {
        if (!rollNo.trim()) {
            toast({
                title: "Roll No. cannot be empty",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await axios.put(
                `${backendUrl}/api/users/${userData._id}`,
                {
                    rollNo: rollNo,
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            );
            if (response.status === 200) {
                toast({
                    title: "Roll No. updated successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                setUserData({ ...userData, rollNo: rollNo });
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    const handleSection = async () => {
        const uppercaseSection = section.trim().toUpperCase();
        if (!uppercaseSection) {
            toast({
                title: "Section cannot be empty",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await axios.put(
                `${backendUrl}/api/users/${userData._id}`,
                {
                    section: uppercaseSection,
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            );
            if (response.status === 200) {
                toast({
                    title: "Section updated successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                setUserData({ ...userData, section: uppercaseSection });
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    return (
        <div className="w-full px-3 py-4 flex flex-col justify-between space-y-3 mx-1">
            <h1 className="font-bold mb-4 text-3xl">Student Details</h1>
            <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
                <StudentDetails label="Username" value={userData.username} />
                <StudentDetails label="Email" value={userData.email} />
            </div>
            <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
                <StudentDetails label="Library ID" value={userData.libId} />
                <StudentDetails label="Branch" value={userData.branch} />
            </div>
            <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
                {
                    userData.rollNo ? (
                        <StudentDetails label="Roll No" value={userData.rollNo} />
                    ) : (
                        <div className="w-full flex flex-col justify-center">
                            <div className="w-full md:!w-[95%] relative flex items-center">
                                <svg
                                    type="button"
                                    onClick={handleRollNo}
                                    className="absolute ml-[90%] cursor-pointer "
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="white"
                                        d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"
                                    />
                                </svg>
                                <input
                                    className="w-1/2  mt-1 shadow appearance-none border border-gray-700 hover:border-gray-400 bg-neutral-900 text-white rounded leading-tight focus:outline-none focus:shadow-outline"
                                    name="text"
                                    autoComplete="off"
                                    type="text"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        border: "1px solid grey",
                                        width: "100%",
                                        padding: "10px",
                                    }}
                                    value={rollNo}
                                    placeholder="University Roll No."
                                    onChange={(e) => setRollNo(e.target.value)}
                                />
                            </div>
                        </div>

                    )
                }
                {
                    userData.section ? (

                        <StudentDetails label="Section" value={userData.section} />
                    ) : (
                        <div className="w-full flex flex-col justify-center">
                            <div className="w-full md:!w-[95%] relative flex items-center">
                                <svg
                                    type="button"
                                    onClick={handleSection}
                                    className="absolute ml-[90%] cursor-pointer "
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="white"
                                        d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"
                                    />
                                </svg>
                                <input
                                    className="w-1/2  mt-1 shadow appearance-none border border-gray-700 hover:border-gray-400 bg-neutral-900 text-white rounded leading-tight focus:outline-none focus:shadow-outline"
                                    name="text"
                                    autoComplete="off"
                                    type="text"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        border: "1px solid grey",
                                        width: "100%",
                                        padding: "10px",
                                    }}
                                    value={section}
                                    placeholder="Section"
                                    onChange={(e) => setSection(e.target.value)}
                                />
                            </div>
                        </div>

                    )
                }
            </div>
        </div>
    );
}

export default StudentDetailsSection;
