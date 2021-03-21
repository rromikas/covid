import React, { useState, useEffect, useRef, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import AnomaliesByDay from "../components/charts/AnomaliesByDay";
import AnomaliesMetricsByDay from "../components/charts/DeathsByDay";
import AnomalyScoresByDay from "../components/charts/AnomalyScoresByDay";
import Footer from "../templates/Footer";
import Header from "../templates/Header";
import SideBar from "./SideBar";
import Scheduler from "../templates/Scheduler";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

const sections = [
  { title: "Configurations", url: "configuration" },
  { title: "Connections", url: "connection" },
];

const initialState = {
  configurationId: 1,
};

function reducer(state, action) {
  switch (action.type) {
    case "handleConfigurationId":
      return {
        ...state,
        configurationId: action.value,
      };
    default:
      return state;
  }
}

export default function Home() {
  const classes = useStyles();

  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    async function getConfigurations() {
      try {
        const res = await fetch("http://127.0.0.1:8000/configuration/");
        const configurations = await res.json();

        var configurationInfo = [];

        for (let i = 0; i < configurations.length; i++) {
          configurationInfo.push({
            configurationName: configurations[i]["configuration_name"],
            configurationId: configurations[i]["configuration_id"],
            trainSchedule: configurations[i]["train_schedule"],
            predictSchedule: configurations[i]["predict_schedule"],
          });
        }
        setConfigurations(configurationInfo);
      } catch (e) {
        console.log(e);
      }
    }
    getConfigurations();
  }, []);

  const [state, dispatch] = useReducer(reducer, initialState);

  function handleConfigurationId(newId) {
    dispatch({ type: "handleConfigurationId", value: newId });
  }

  function showSettings(event) {
    event.preventDefault();
  }

  var crontabs = configurations.map((item, index) => <Scheduler item={item}></Scheduler>);

  return (
    <React.Fragment>
      <SideBar set_value={handleConfigurationId} items={configurations}></SideBar>
      <Container maxWidth="lg">
        <Header title="Anomaly Detection" sections={sections} />
        <AnomaliesByDay configurationId={state.configurationId} />
        <AnomaliesMetricsByDay configurationId={state.configurationId} />
        <AnomalyScoresByDay configurationId={state.configurationId} />
      </Container>
      {crontabs}
      <Footer title={"Anomaly Detection"} description={""}></Footer>
    </React.Fragment>
  );
}
