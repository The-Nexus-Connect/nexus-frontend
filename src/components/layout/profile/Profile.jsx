import { useEffect, useState } from "react";
import { isUserAuthenticated } from "../../../services/auth";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Avatar,
} from "@chakra-ui/react";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { MdOutlineSettings } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { fetchUserData } from "../../../services/userServices";

const Profile = () => {
  const [userData, setUserData] = useState({});

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/signup";
  };

  useEffect(() => {
    fetchUserData().then((data) => {
      if (data) {
        setUserData(data);
      }
    });
  }, []);

  return (
    <div>
      <Menu>
        <MenuButton
          className="mx-2"
          as={Avatar}
          size="md"
          cursor="pointer"
          src={userData.userImage}
        />
        <MenuList sx={{ backgroundColor: "rgb(9, 9, 11)" }}>
          {!isUserAuthenticated() ? (
            <MenuGroup>
              <MenuItem
                sx={{
                  backgroundColor: "rgb(9, 9, 11)",
                  _hover: { textDecoration: "underline" },
                }}
                onClick={() => (window.location.href = "/signup")}
              >
                <AiOutlineLogin className="text-xl mx-2 text-green-500" />{" "}
                SignUp
              </MenuItem>
            </MenuGroup>
          ) : (
            <MenuGroup title={userData.username}>
              <Link to="/profile">
                <MenuItem
                  sx={{
                    backgroundColor: "rgb(9, 9, 11)",
                    _hover: { textDecoration: "underline" },
                  }}
                >
                  <BsFillPersonFill className="text-xl mx-2" /> Profile
                </MenuItem>
              </Link>
              {/* Uncomment if you want settings */}
              {/* <Link to="/settings">
                <MenuItem
                  sx={{
                    backgroundColor: "rgb(5 46 22)",
                    _hover: { textDecoration: "underline" },
                  }}
                >
                  <MdOutlineSettings className="text-xl mx-2" /> Settings
                </MenuItem>
              </Link> */}
              <MenuDivider />
              <MenuItem
                sx={{
                  backgroundColor: "rgb(9, 9, 11)",
                  _hover: { textDecoration: "underline" },
                }}
                onClick={handleSignOut}
              >
                <AiOutlineLogout className="text-xl mx-2 text-red-500" /> Sign
                Out
              </MenuItem>
            </MenuGroup>
          )}
        </MenuList>
      </Menu>
    </div>
  );
};

export default Profile;
