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
    navigate("/blogs");
    // toast.error("This didn't work.")
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
      <main className="relative overflow-hidden flex-1 flex flex-col items-center justify-center bg-[#000000] text-center">
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
      </main>
      <footer className="py-4  absolute bottom-0 w-full">
        <div className="flex justify-center gap-4 text-sm">
          <a href="/signin" className="text-white">
            Sign in
          </a>
          <a href="/signup" className="text-white">
            Sign up
          </a>
        </div>
      </footer>
    </div>
  );
}
