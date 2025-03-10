import { Avatar, Image, Tag } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { GiPodiumSecond, GiPodiumWinner, GiPodiumThird } from "react-icons/gi";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { fetchUserData } from "../../../services/userServices";

const UserBio = () => {

    const toast = useToast();
    const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:5001";
    const apiKey = import.meta.env.VITE_API_KEY;
    const [userData, setUserData] = useState({});
    const [updatedBio, setUpdatedBio] = useState("");
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageUploadVisible, setIsImageUploadVisible] = useState(false);

    useEffect(() => {
        fetchUserData().then((data) => {
            if (data) {
                setUserData(data);
            }
        });
    }, []);

    const showToast = (status, description) => {
        toast({
            title: status,
            description: description,
            status,
            duration: 3000,
            isClosable: true,
        });
    };

    const handleUpdateBio = async () => {
        if (!updatedBio.trim()) {
            showToast("warning", "The Bio cannot be empty.");
            return;
        }
        try {
            const response = await axios.put(
                `${backendUrl}/api/users/${userData._id}`,
                {
                    bio: updatedBio,
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            );

            if (response.status === 200) {
                showToast("success", "Bio updated successfully");
                setIsEditingBio(false);
                setUserData({ ...userData, bio: updatedBio });
            }
        } catch (error) {
            console.error("Error updating Bio", error);
            showToast("error", "Error updating Bio");
        }
    };

    const handleImageUpload = async () => {
        if (!selectedImage) {
            showToast("warning", "Please select an image to upload.");
            return;
        }
        const formData = new FormData();
        formData.append("image", selectedImage);
    
        try {
            const response = await axios.put(
                `${backendUrl}/api/users/upload/${userData._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            if (response.status === 200) {
                showToast("success", "Image uploaded successfully");
                setUserData({ ...userData, userImage: response.data.userImage });
                setIsImageUploadVisible(false);
            }
        } catch (error) {
            console.error("Error uploading image", error);
            showToast("error", "Error uploading image");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="flex justify-center m-2 p-2">
                <Image
                    borderRadius="full"
                    boxSize="150px"
                    as={Avatar}
                    src={`${backendUrl}${userData.userImage}`} // Ensure the correct URL is used
                />
            </div>
            <div className="w-full flex flex-col items-center justify-center mx-1">
                <p className="w-fit mx-2 my-2 font-bold text-3xl"> User Bio </p>
                {isEditingBio ? (
                    <div className="w-full flex flex-col justify-center items-center">
                        <textarea
                            className="w-full p-2 px-3 h-24 mt-1 shadow appearance-none border border-gray-700 hover:border-gray-400 bg-neutral-900 text-white rounded leading-tight focus:outline-none focus:shadow-outline"
                            name="text"
                            type="text"
                            value={updatedBio}
                            onChange={(e) => setUpdatedBio(e.target.value)}
                        />
                        <div className="flex space-x-2 mt-2">
                            <button
                                className="p-1 bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={handleUpdateBio}
                            >
                                Upload
                            </button>
                            <button
                                className="p-1 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={() => {
                                    setIsEditingBio(false);
                                    setUpdatedBio(userData.bio);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center text-center items-center flex-col">
                        <Tag fontWeight="" colorScheme="" className="">
                            {userData.bio}.
                        </Tag>
                        <Tag
                            fontWeight="bold"
                            colorScheme="gray"
                            className="w-fit cursor-pointer mt-20"
                            onClick={() => setIsEditingBio(true)}
                        >
                            Edit Bio
                            <AiFillEdit className="w-4 h-4" />
                        </Tag>
                    </div>
                )}
            </div>
            {!isImageUploadVisible && (
                <button
                    className="mt-12 p-1 bg-white text-black text-sm font-bold rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => setIsImageUploadVisible(true)}
                >
                    Update PFP
                </button>
            )}
            {isImageUploadVisible && (
                <div className="flex flex-col items-center mt-4">
                    <input
                        type="file"
                        accept="image/*"
                        className="border border-gray-700 rounded cursor-pointer"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                    <div className="flex mt-2 space-x-2">
                        <button
                            className="px-1 py-1 bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={handleImageUpload}
                        >
                            Upload
                        </button>
                        <button
                            className="px-1 py-1 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => setIsImageUploadVisible(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserBio;