import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import IMG from "@/assets/images/0_3.jpeg";
import LOGO from "@/assets/images/writelogo.png";
import { useRive, useStateMachineInput } from "rive-react";
import { useNavigate } from "react-router-dom";
import { userSignInApi } from "@/api/postApi";
import toast from "react-hot-toast";

const STATE_MACHINE_NAME = "State Machine 1";

export default function Component() {
  const navigate = useNavigate();
  const { rive, RiveComponent } = useRive({
    src: "snowbear.riv",
    autoplay: true,
    stateMachines: STATE_MACHINE_NAME,
  });

  const [email, setEmail] = useState("simran@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    console.log("hi", rive.contents);
  }

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      triggerFail();
      return;
    }

    setLoading(true);
    try {
      const res = await userSignInApi({ email, password });
      console.log("res", res);
      localStorage.setItem("token", res?.token);

      triggerSuccess();
      setEmail("");
      setPassword("");
      setLoading(false);
      navigate("/blogs");

      toast.success("Success");
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.errorMessage);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onSignupPress = () => {
    navigate("/signup");
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
              <RiveComponent style={{ width: "400px", height: "400px" }} />
            </div>
            <div className="space-y-4 border-2 bg-white rounded-lg p-10">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  required
                  id="email"
                  type="email"
                  value={email}
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
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <p
                onClick={onSignupPress}
                className="font-bold text-[#272e3f] hover:cursor-pointer"
              >
                SignUp
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
