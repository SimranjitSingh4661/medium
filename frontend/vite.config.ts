import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // plugins: [
  //   react({
  //     babel: {
  //       plugins: [
  //         // other Babel plugins
  //         [
  //           "@locator/babel-jsx/dist",
  //           {
  //             env: "development",
  //           },
  //         ],
  //       ],
  //     },
  //   }),
  // ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
