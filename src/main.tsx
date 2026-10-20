import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ChannelProvider } from "./context/ChannelContext.tsx";

import "./index.css";

import "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ChannelProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ChannelProvider>
    </AuthProvider>
  </StrictMode>,
);
