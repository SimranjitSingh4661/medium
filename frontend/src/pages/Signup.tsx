import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import IMG from "@/assets/images/0_3.jpeg";
import LOGO from "@/assets/images/writelogo.png";
import { useRive, useStateMachineInput } from "rive-react";
import { useNavigate } from "react-router-dom";
import { userSignUpApi } from "@/api/postApi";
import toast from "react-hot-toast";

const STATE_MACHINE_NAME = "State Machine 1";

export default function Component() {
  const navigate = useNavigate();
  const { rive, RiveComponent } = useRive({
    src: "snowbear.riv",
    autoplay: true,
    stateMachines: STATE_MACHINE_NAME,
  });

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLook();
  }, [email]);

  const stateSuccess = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "success"
  );

  const stateFail = useStateMachineInput(rive, STATE_MACHINE_NAME, "fail");
  const stateHandUp = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "hands_up"
  );

  const stateCheck = useStateMachineInput(rive, STATE_MACHINE_NAME, "Check");
  const stateLook = useStateMachineInput(rive, STATE_MACHINE_NAME, "Look");

  const triggerSuccess = () => {
    stateSuccess && stateSuccess.fire();
  };
  const triggerFail = () => {
    stateFail && stateFail.fire();
  };

  const setHangUp = (hangUp: any) => {
    stateHandUp && (stateHandUp.value = hangUp);
  };

  const setLook = () => {
    if (!stateLook || !stateCheck || !setHangUp) {
      return;
    }
    setHangUp(false);
    setCheck(true);
    let nbChars = 0;
    if (email) {
      //@ts-ignore
      nbChars = parseFloat(email.split("").length);
    }
    //@ts-ignore
    let ratio = nbChars / parseFloat(41);
    console.log("ratio " + ratio);

    let lookToSet = ratio * 100 - 25;
    console.log("lookToSet " + Math.round(lookToSet));
    stateLook.value = Math.round(lookToSet);
  };
  const setCheck = (check: any) => {
    if (stateCheck) {
      stateCheck.value = check;
    }
  };

  if (rive) {
    // console.log("hi", rive.contents);
  }

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!email || !password || !userName) {
      toast.error("Please enter your email and password.");
      triggerFail();
      return;
    }
    setLoading(true);
    try {
      const res = await userSignUpApi({
        name: userName,
        email,
        password,
      });

      localStorage.setItem("token", res?.token);

      triggerSuccess();
      setEmail("");
      setPassword("");
      setUserName("");
      toast.success("Success");
      setLoading(false);
      navigate("/blogs");
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.errorMessage);
      navigate("/error");
    }
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onSignInPress = () => {
    navigate("/signin");
  };

  return (
    <div className="w-full lg:grid lg:grid-cols-2 h-full min-h-[100svh] bg-[#d6e2ea] ">
      <div className="h-full">
        <div className="flex justify-center pt-10">
          <img
            src={LOGO}
            alt="Image"
            className="w-fit h-12"
            style={{
              // aspectRatio: "1920/1080",
              objectFit: "contain",
            }}
          />
        </div>
        <div className="flex items-center justify-center place-content-center">
          <div className="mx-auto ">
            <div>
              <RiveComponent style={{ width: "400px", height: "300px" }} />
            </div>
            <div className="space-y-4 border-2 bg-white rounded-lg p-10">
              <div className="space-y-2">
                <Label htmlFor="Username">Username</Label>
                <Input
                  required
                  id="Username"
                  type="text"
                  maxLength={15}
                  value={userName}
                  placeholder="username"
                  onChange={handleUserNameChange}
                  onFocus={() => setHangUp(false)}
                  className="bg-[#d6e2ea] bg-opacity-50 "
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  required
                  id="email"
                  type="email"
                  value={email}
                  maxLength={30}
                  onChange={handleEmailChange}
                  placeholder="user@example.com"
                  onFocus={() => setHangUp(false)}
                  className="bg-[#d6e2ea] bg-opacity-50 "
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  required
                  id="password"
                  type="password"
                  value={password}
                  maxLength={10}
                  placeholder="••••••••••"
                  onChange={(event) => {
                    setHangUp(true);
                    handlePasswordChange(event);
                  }}
                  className="bg-[#d6e2ea] bg-opacity-50 "
                />
              </div>
              <Button
                onFocus={() => setHangUp(false)}
                onMouseOver={() => setHangUp(false)}
                onClick={handleSubmit}
                type="submit"
                className="w-full"
                isLoading={loading}
              >
                SignUp
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <p
                onClick={onSignInPress}
                className="font-bold text-[#272e3f] hover:cursor-pointer"
              >
                SignIn
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block h-full min-h-[100svh]">
        <img
          src={IMG}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
          style={{ aspectRatio: "1920/1080", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
