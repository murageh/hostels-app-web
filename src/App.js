import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import {ThemeProvider} from "@mui/material";
import {useMaterialUIController} from "context";
import theme from "./assets/theme";
import themeDark from "./assets/theme-dark";

function App() {
    const [controller, dispatch] = useMaterialUIController();
    const {
        miniSidenav,
        direction,
        layout,
        openConfigurator,
        sidenavColor,
        transparentSidenav,
        whiteSidenav,
        darkMode,
    } = controller;

    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path={"/dashboard"}
                        type="private"
                        element={
                            <Dashboard/>
                        }
                        key={"accounts/single"}
                    />
                    <Route path="*" element={<Navigate to="/dashboard"/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>

    );
}

export default App;
