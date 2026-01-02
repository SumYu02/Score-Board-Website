import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { ThemeProvider } from "./components/theme-provider";
import { Home } from "./pages/Home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Home />
    </ThemeProvider>
  );
}

export default App;
