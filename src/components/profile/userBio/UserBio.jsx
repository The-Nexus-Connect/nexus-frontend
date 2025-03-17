import { Avatar, Image, Tag, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { fetchUserData } from "../../../services/userServices";

const UserBio = () => {
  const toast = useToast();
  const backendUrl =
    import.meta.env.VITE_BACKEND_URI || "http://localhost:5001";
  const apiKey = import.meta.env.VITE_API_KEY;
  const [userData, setUserData] = useState({});
  const [updatedBio, setUpdatedBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageUploadVisible, setIsImageUploadVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/users/${userData._id}`,
        { bio: updatedBio },
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      showToast("warning", "Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    setIsLoading(true);
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
      console.error("Error uploading image:", error);
      showToast("error", "Error uploading image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full mt-3">
      <div className="flex justify-center">
        <Image
          borderRadius="full"
          boxSize="150px"
          as={Avatar}
          src={userData.userImage}
        />
      </div>
      <div className="w-full flex flex-col items-center justify-center mx-1">
        <p className="w-fit mx-2 my-1 font-bold text-3xl"> User Bio </p>
        {isEditingBio ? (
          <div className="w-full flex flex-col justify-center items-center">
            <textarea
              className="w-72 p-2 px-3 h-20 mt-1 shadow appearance-none border border-gray-700 hover:border-gray-400 bg-neutral-900 text-white rounded leading-tight focus:outline-none focus:shadow-outline resize-none"
              name="text"
              type="text"
              maxLength={100}
              value={updatedBio}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setUpdatedBio(e.target.value);
                }
              }}
            />
            <p className="text-sm text-gray-400 mt-1">
              {updatedBio.length}/100 characters
            </p>
            <div className="flex space-x-2 mt-2">
              <button
                className="p-1 bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleUpdateBio}
                disabled={isLoading}
              >
                {isLoading ? <Spinner size="sm" /> : "Upload"}
              </button>
              <button
                className="p-1 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setIsEditingBio(false);
                  setUpdatedBio(userData.bio);
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center flex-col">
            <Tag
              className="text-left mt-1 h-20 w-72 overflow-hidden text-ellipsis whitespace-pre-wrap border border-gray-700 p-2 rounded text-white"
              sx={{
                bg: "zinc.950",
                color: "white",
              }}
            >
              {userData.bio || "No bio available"}
            </Tag>

            <Tag
              fontWeight="bold"
              colorScheme="gray"
              className="w-fit cursor-pointer mt-8 text-white"
              sx={{
                bg: "teal.800",
                color: "white",
                cursor: "pointer",
                _hover: {
                  bg: "teal.700",
                },
              }}
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
          className="mt-20 p-1 bg-teal-800 hover:bg-teal-700 text-white text-sm font-bold rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => setIsImageUploadVisible(true)}
          disabled={isLoading}
        >
          Update Profile Picture
        </button>
      )}
      {isImageUploadVisible && (
        <div className="flex flex-col items-center mt-5 w-72">
          <input
            type="file"
            accept="image/*"
            className="border border-gray-700 rounded cursor-pointer"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                if (file.size > 1024 * 1024) {
                  // 1MB limit
                  showToast("error", "File size should be less than 1MB.");
                  return;
                }
                setSelectedImage(file);
              }
            }}
            disabled={isLoading}
          />
          <p className="text-sm text-gray-400 mt-1">Max file size: 1MB</p>
          <div className="flex mt-2 space-x-2">
            <button
              className="px-1 py-1 bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleImageUpload}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : "Upload"}
            </button>
            <button
              className="px-1 py-1 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => setIsImageUploadVisible(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBio;