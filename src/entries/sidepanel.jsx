import "../tailwind.css";
import "../extension-shell.css";
import "../fonts.css";
import "flowbite";
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ExtensionSidePanel from "../pages/Extension_sidepanel";

const el = document.getElementById("Oq465NRHaOKegSCssrnhCql2WEIDuYU0");
if (el) {
  createRoot(el).render(
    <StrictMode>
      <ExtensionSidePanel />
    </StrictMode>
  );
}
