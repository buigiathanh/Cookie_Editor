/*global chrome*/
import './index.css';
import './fonts.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import ContentScript from "./contents";
import ExtensionSidePanel from "./pages/Extension_sidepanel";

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

        default:
            //todo
            break;
    }
} else {
    const extensionBox = document.createElement("div");
    extensionBox.id = `${chrome.runtime.id}`;
    const body = document.getElementsByTagName("body")[0];
    body.append(extensionBox);
    const extensionCodeRoot = ReactDOM.createRoot(extensionBox);
    extensionCodeRoot.render(
        <React.StrictMode>
            <ContentScript />
        </React.StrictMode>
    );
}

reportWebVitals();
