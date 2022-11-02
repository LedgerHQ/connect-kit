import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import { GlobalStyle } from "./components";

const appContainer = document.getElementById("root");
const root = createRoot(appContainer)
root.render(
  <StrictMode>
    <GlobalStyle />
    <App />
  </StrictMode>
);
