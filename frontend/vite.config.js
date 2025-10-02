import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Add the React plugin
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    react(), // Add the react plugin here
    tailwindcss(), // Your Tailwind CSS plugin
  ],
  server: {
    // port: 3000,
    // cors: {
    //   origin: "http://localhost:5000",
    //   credentials: true,
    // }
  }
});
