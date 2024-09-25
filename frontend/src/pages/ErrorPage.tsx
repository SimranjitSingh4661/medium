import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GhostIcon } from "lucide-react";

export default function Component() {
  const navigate = useNavigate();

  const onBackClick = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <GhostIcon className="w-24 h-24 mb-8 text-muted-foreground animate-bounce" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">
        Oops! Something went wrong
      </h2>
      <p className="text-lg text-center mb-8 max-w-md">
        {
          "We're sorry, there seems to be a problem with our system right now. Please try again later."
        }
      </p>
      <Button className="hover:cursor-pointer" asChild onClick={onBackClick}>
        <p>Go back home</p>
      </Button>
    </div>
  );
}
