/*global chrome*/
import './index.css';
import './fonts.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import ExtensionSidePanel from "./pages/Extension_sidepanel";
import ExtensionImport from "./pages/Extension_import";

// console.log = () => {}
const root = document.getElementById(`Oq465NRHaOKegSCssrnhCql2WEIDuYU0`);
if (root) {
    const dataComponent = root.dataset.component;
    const renderPage = (component) => {
        return ReactDOM.createRoot(root).render(
            <React.StrictMode>{component}</React.StrictMode>
        );
    };

    switch (dataComponent) {
        case "sidepanel":
            renderPage(<ExtensionSidePanel />)
            break;

        case "import":
            renderPage(<ExtensionImport />)
            break;

        default:
            //todo
            break;
    }
}

reportWebVitals();
