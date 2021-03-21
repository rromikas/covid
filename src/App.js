import { Switch, Route, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import Connection from "./connection_page/Connection";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import SideMenu from "components/SideMenu";
import Configurations from "components/Configurations";
import Drawer from "@material-ui/core/Drawer";
import Navbar from "components/Navbar";
import Configuration from "components/Configuration";
import { Flipper } from "react-flip-toolkit";
import NewConfiguration from "components/Configurations/NewConfiguration";
import { MuiThemeProvider as ThemeProvider } from "@material-ui/core/styles";
import CreateTheme from "@material-ui/core/styles/createMuiTheme";

const theme = CreateTheme({
  palette: {
    primary: {
      main: "#673de6",
    },
    secondary: {
      main: "#673de6",
    },
    error: {
      main: "#673de6",
    },
  },
  typography: { fontFamily: "Montserrat, sans-serif" },
});

const App = () => {
  const [menuOpened, setMenuOpened] = useState(false);

  const location = useLocation();
  const pageRef = useRef(null);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        <NotificationContainer />
        <Drawer anchor="left" open={menuOpened} onClose={() => setMenuOpened((prev) => !prev)}>
          <SideMenu onClose={() => setMenuOpened(false)}></SideMenu>
        </Drawer>
        <div className="d-flex flex-column h-100">
          <Navbar setMenuOpened={setMenuOpened}></Navbar>
          <div className="flex-grow-1" style={{ minHeight: 0 }}>
            <div className="row no-gutters h-100">
              <div className="col-auto d-none d-lg-block">
                <SideMenu></SideMenu>
              </div>
              <div ref={pageRef} className="col overflow-auto h-100">
                <Flipper flipKey={location.pathname}>
                  <Switch>
                    <Route path="/" exact={true}>
                      <Configurations
                        configurations={configurations}
                        setConfigurations={setConfigurations}
                      ></Configurations>
                    </Route>
                    <Route path="/connections" exact={true} component={Connection}></Route>
                    <Route
                      path="/configurations/new"
                      exact={true}
                      component={NewConfiguration}
                    ></Route>
                    <Route
                      path="/configurations/:id"
                      exact={true}
                      component={Configuration}
                    ></Route>
                    <Route path="/configurations" exact={true}>
                      <Configurations
                        configurations={configurations}
                        setConfigurations={setConfigurations}
                      ></Configurations>
                    </Route>
                  </Switch>
                </Flipper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
