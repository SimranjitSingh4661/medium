/**
 * v0 by Vercel.
 * @see https://v0.dev/t/3msaSxKKFdr
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRive } from "@rive-app/react-canvas";
import LOGO from "@/assets/images/writelogo.png";

export default function Component() {
  const navigate = useNavigate();

  const { RiveComponent } = useRive({
    autoplay: true,
    src: "bg_grid.riv",
    stateMachines: "State Machine 1",
  });

  const onGetStartedPress = () => {
    navigate("/signup");
  };

  const onExplorePress = () => {
    const token = localStorage.getItem("token");
    if (!!token) {
      navigate("/blogs");
    } else {
      navigate("/signup");
    }
    // toast.error("This didn't work.")
  };

  const onSignInPress = () => {
    navigate("/signin");
  };

  const onSignUpPress = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center py-4 px-28 border-b">
        {/* <div className="text-xl font-bold">{APP_NAME}</div> */}
        <img
          src={LOGO}
          alt="Image"
          className="w-fit h-12"
          style={{
            // aspectRatio: "1920/1080",
            objectFit: "contain",
          }}
        />
        <nav className="flex gap-8">
          <Button
            variant="default"
            className="text-sm bg-black"
            onClick={onGetStartedPress}
          >
            Get started
          </Button>
        </nav>
      </header>
      {/* <main className=" overflow-hidden flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-400 to-white text-center"> */}
      {/* <main className="relative overflow-hidden flex-1 flex flex-col items-center justify-center bg-[#000000] text-center">
        <h1 className="absolute text-6xl font-bold mb-4 text-white top-40 pointer-events-none">
          Build a better world, one thought at a time.
        </h1>
        <p className="text-4xl mb-2 absolute text-white top-72 pointer-events-none">
          Discover. Write. Impact.
        </p>
        <Button
          variant="outline"
          onClick={onExplorePress}
          className="text-lg absolute bottom-80 h-14 w-40"
        >
          Explore
        </Button>
        <RiveComponent className="h-full min-h-[90svh] w-full min-w-[100svw]" />
      </main> */}
      {/* above unresopnsive code remove later */}
      <main className="relative overflow-hidden flex-1 flex flex-col items-center justify-center bg-[#000000] text-center">
        <h1 className="absolute text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white top-20 md:top-32 lg:top-40 pointer-events-none">
          Build a better world, one thought at a time.
        </h1>
        <p className="absolute text-2xl md:text-3xl lg:text-4xl mb-2 text-white top-52 md:top-64 lg:top-72 pointer-events-none">
          Discover. Write. Impact.
        </p>
        <Button
          variant="outline"
          onClick={onExplorePress}
          className="text-base md:text-lg absolute bottom-40 md:bottom-60 lg:bottom-80 h-12 md:h-14 w-32 md:w-36 lg:w-40"
        >
          Explore
        </Button>
        <RiveComponent className="h-full min-h-[80vh] md:min-h-[90vh] w-full min-w-[100vw]" />
      </main>
      <footer className="py-4  absolute bottom-0 w-full">
        <div className="flex justify-center gap-4 text-sm ">
          <a
            onClick={onSignInPress}
            className="text-white hover:cursor-pointer"
          >
            Sign in
          </a>
          <a
            onClick={onSignUpPress}
            className="text-white hover:cursor-pointer"
          >
            Sign up
          </a>
        </div>
      </footer>
    </div>
  );
}
