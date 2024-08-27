import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LOGO from "@/assets/images/writelogo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { decodeUserToken } from "@/utils/jwtHelper";
import { Button } from "@/components/ui/button";

type UserData = {
  id: string;
  name: string;
  email: string;
};

function Header({
  btnText = "",
  loading = false,
  btnDisabled = false,
  onBtnPress = () => {},
}) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    id: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!!token) {
      setUserData(decodeUserToken(token));
    }
  }, []);

  const onLogOutPress = () => {
    // localStorage.clear();
    // navigate("/");
  };

  return (
    <div>
      <div className="flex justify-between px-20 py-5">
        <a href="/">
          <img
            src={LOGO}
            alt="Image"
            className="w-fit h-10"
            style={{
              objectFit: "contain",
            }}
          />
        </a>
        <div className="flex flex-row">
          {!!btnText && (
            <div className="mr-10">
              <Button
                type="submit"
                className="w-full"
                variant={"default"}
                isLoading={loading}
                disabled={btnDisabled}
                onClick={onBtnPress}
              >
                {btnText}
              </Button>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger>
              {!!userData?.name && (
                <div className="hover:cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {userData?.name?.[0]?.toLocaleUpperCase() +
                      userData?.name?.[1]}
                  </span>
                </div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogOutPress}
                className="font-bold text-red-600"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  btnText: PropTypes.string,
  onBtnPress: PropTypes.func,
  btnDisabled: PropTypes.bool,
  loading: PropTypes.bool,
};

export default Header;
