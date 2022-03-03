import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {MaterialUIControllerProvider} from "context";

ReactDOM.render(
    <React.StrictMode>
        <MaterialUIControllerProvider>
            <App/>
        </MaterialUIControllerProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
