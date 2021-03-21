import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { Dropdown } from "semantic-ui-react";

import ConfigurationColumn from "./ConfigurationColumns";
import ConfigurationCategories from "./ConfigurationCategories";
import ConfigurationFilter from "./ConfigurationFilters";
import ConfigurationDateSpecifier from "./ConfigurationDateSpecifier";
import ConfigurationMetric from "./ConfigurationMetric";
import Header from "../templates/Header";

import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import DeleteIcon from "@material-ui/icons/Delete";
import { Fab } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const style = {
  margin: 0,
  top: "auto",
  right: "auto",
  bottom: 40,
  left: 40,
  position: "fixed"
};

const sections = [
  { title: "Home", url: "/" },
  { title: "Connections", url: "connection" }
];

export default function ConfigurationForm() {
  const history = useHistory();

  const useStyles = makeStyles(theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3)
    },
    submit: {
      margin: theme.spacing(3, 0, 2)
    }
  }));

  const popup_style = {
    position: "inherit",
    margin: "auto",
    maxWidth: "600px",
    width: "90%"
  };

  const classes = useStyles();

  const [configurationName, setConfigurationName] = useState("");
  const [connectionName, setConnectionName] = useState({ name: "", id: "" });
  const [trainSchedule, setTrainSchedule] = useState("");
  const [predictSchedule, setPredictSchedule] = useState("");

  const [connections, setConnections] = useState([]);
  useEffect(() => {
    async function getConnections() {
      try {
        const res = await fetch("http://127.0.0.1:8000/connection/");
        const connections = await res.json();

        const connection_names = [];

        for (let i = 0; i < connections.length; i++) {
          connection_names.push({
            name: connections[i]["connection_name"],
            id: connections[i]["connection_id"]
          });
        }

        setConnections(connection_names);
      } catch (e) {
        console.log(e);
      }
    }
    getConnections();
  }, []);

  const [configurations, setConfigurations] = useState([]);
  const [state, setState] = useState({});
  const [runningState, setRunningState] = useState({});

  useEffect(() => {
    async function getConfigurations() {
      try {
        const res = await fetch("http://127.0.0.1:8000/configuration/");
        const configurations = await res.json();

        const initialStates = {};
        const initialRunningStates = {};

        for (let i = 0; i < configurations.length; i++) {
          initialStates[configurations[i]["connection_id"]] =
            configurations[i]["is_active"];

          const stateRes = await fetch(
            "http://localhost:8000/configuration_jobs/" +
              configurations[i]["configuration_id"]
          );
          const runningConfState = await stateRes.json();
          initialRunningStates[configurations[i]["connection_id"]] =
            runningConfState["is_running"];
        }

        setRunningState(initialRunningStates);
        setState(initialStates);
        setConfigurations(configurations);
      } catch (e) {
        console.log(e);
      }
    }
    getConfigurations();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const stateRes = await fetch("http://localhost:8000/configuration_jobs/");
      const runningConfState = await stateRes.json();
      const finalRunningStates = {};

      for(var i = 0; i < runningConfState.length; i++){
        finalRunningStates[runningConfState[i]["configuration_id"]] = runningConfState[i]["is_running"];
      }

      console.log(finalRunningStates);

      setRunningState(finalRunningStates);
      // setSeconds(seconds => seconds + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [newConfiguration, setNewConfiguration] = useState({
    tables: [
      {
        name: "",
        columns: [{ name: "", type: "" }],
        metrics: [{ name: "", aggregation: "" }],
        categories: [{ name: "" }],
        filters: [{ name: "", operation: "", value: "" }],
        date_specifier: [{ name: "" }],
        is_active: false
      }
    ]
  });
  useEffect(() => {
    async function getNewConfigurations() {
      try {
        var record = {};
        record["columns"] = [{ name: "", type: "" }];
        record["metrics"] = [{ name: "", aggregation: "" }];
        record["categories"] = [{ name: "" }];
        record["filters"] = [{ name: "", operation: "", value: "" }];
        record["date_specifier"] = [{ name: "" }];

        var newConfiguration = {};

        newConfiguration["tables"] = [record];

        setNewConfiguration(newConfiguration);
      } catch (e) {
        console.log(e);
      }
    }
    getNewConfigurations();
  }, []);

  const handleOnCreate = async () => {
    try {
      console.log(connectionName["id"]);
      const res = await fetch("http://127.0.0.1:8000/configuration/", {
        method: "POST",
        body: JSON.stringify({
          connection_id:
            "http://127.0.0.1:8000/connection/" + connectionName + "/",
          configuration: newConfiguration,
          configuration_name: configurationName,
          train_schedule: trainSchedule,
          predict_schedule: predictSchedule,
          is_active: false
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }).then(res => res.json()); // fetching the data from api, before the page loaded

      console.log(res);

      if (res["success"]) {
        history.push("/configuration");
      } else {
        history.push("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  async function handleOnUpdate(index) {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/configuration/" +
          configurations[index]["configuration_id"] +
          "/",
        {
          method: "PUT",
          body: JSON.stringify({
            connection_id: configurations[index]["connection_id"],
            configuration: configurations[index]["configuration"],
            configuration_name: configurations[index]["configuration_name"],
            train_schedule: configurations[index]["train_schedule"],
            predict_schedule: configurations[index]["predict_schedule"],
            is_active: configurations[index]["is_active"]
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      ).then(res => res.json());

      if (res["success"]) {
        // history.push("/myevents");
        // NotificationManager.success(
        //   "Successfully updated the event",
        //   "Successful!"
        // );
      } else {
        console.log("Not success");
        console.log(res);
        // history.push("/signin");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const set_value = (index, name, value) => {
    const configs = [...configurations];
    configs[index]["configuration"]["tables"][0][name] = value;
    setConfigurations(configs);
  };

  const set_new_value = (index, name, value) => {
    newConfiguration["tables"][0][name] = value;
    setNewConfiguration(newConfiguration);
  };

  const handleChange = index => {
    const configs = [...configurations];
    configs[index]["is_active"] = !configs[index]["is_active"];

    state[configs[index]["configuration_id"]] = configs[index]["is_active"];
    setState(state);

    setConfigurations(configs);
    handleOnUpdate(index);
  };

  const handleRunningStateChange = index => {
    runningState[index] = true;
    setRunningState(runningState);
  };

  async function handleDeleteConfiguration(configuration_id) {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/configuration/" + configuration_id + "/",
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      console.log(res);

      if (res["ok"]) {
        window.location.reload();
      } else {
        history.push("/configuration");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleTrainModel(configuration_id) {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/isolated_forest/" + configuration_id + "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      handleRunningStateChange(configuration_id);

      console.log(res);

      if (res["success"]) {
        window.location.reload();
      } else {
        history.push("/configuration");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleFindAnomalies(configuration_id) {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/isolated_forest_predict/" +
          configuration_id +
          "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      console.log(res);

      handleRunningStateChange(configuration_id);

      if (res["success"]) {
        window.location.reload();
      } else {
        history.push("/configuration");
      }
    } catch (e) {
      console.log(e);
    }
  }

  var configurations_output = configurations.map((item, index) => (
    <Grid
      container
      spacing={1}
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item>
        <Switch
          checked={state[item["configuration_id"]]}
          onChange={e => handleChange(index)}
          color="primary"
          name={"is_" + index + "_active"}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      </Grid>
      <Grid item xs={2}>
        <Popup
          key={index + "_popup"}
          trigger={
            <Button key={index + "_config_button"} variant="contained">
              {item["configuration_name"]}
            </Button>
          }
          position="right center"
          modal
          nested
        >
          <form style={popup_style} key={index + "_div"}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="tableName"
                  name="tableName"
                  variant="outlined"
                  required
                  fullWidth
                  id="tableName"
                  label="Table Name"
                  value={item["configuration"]["tables"][0]["name"]}
                  onChange={e => set_value(index, "name", e.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <ConfigurationColumn
                  unique_key={index + "_column"}
                  columns={item["configuration"]["tables"][0]["columns"]}
                  configuration_id={index}
                  set_value={set_value}
                ></ConfigurationColumn>
              </Grid>
              <Grid item xs={12}>
                <ConfigurationCategories
                  unique_key={index + "_category"}
                  categories={item["configuration"]["tables"][0]["categories"]}
                  configuration_id={index}
                  set_value={set_value}
                ></ConfigurationCategories>
              </Grid>
              <Grid item xs={12}>
                <ConfigurationFilter
                  unique_key={index + "_filter"}
                  filters={item["configuration"]["tables"][0]["filters"]}
                  configuration_id={index}
                  set_value={set_value}
                ></ConfigurationFilter>
              </Grid>
              <Grid item xs={12}>
                <ConfigurationDateSpecifier
                  unique_key={index + "_date_specifier"}
                  dateSpecifier={
                    item["configuration"]["tables"][0]["date_specifier"]
                  }
                  configuration_id={index}
                  set_value={set_value}
                ></ConfigurationDateSpecifier>
              </Grid>
              <Grid item xs={12}>
                <ConfigurationMetric
                  key={index + "_metric"}
                  metrics={item["configuration"]["tables"][0]["metrics"]}
                  configuration_id={index}
                  set_value={set_value}
                ></ConfigurationMetric>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="trainSchedule"
                  name="trainSchedule"
                  variant="outlined"
                  required
                  fullWidth
                  id="trainSchedule"
                  label="Train Schedule"
                  autoFocus
                  value={item["train_schedule"]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="predictSchedule"
                  name="predictSchedule"
                  variant="outlined"
                  required
                  fullWidth
                  id="predictSchedule"
                  label="Predict Schedule"
                  autoFocus
                  value={item["predict_schedule"]}
                />
              </Grid>
            </Grid>
            <Button onClick={() => handleOnUpdate(index)}>Save</Button>
          </form>
        </Popup>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to train machine learning model?"
              )
            )
              handleTrainModel(item["configuration_id"]);
          }}
          className={classes.button}
        >
          Train Model
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (window.confirm("Are you sure you want to find anomalies?"))
              handleFindAnomalies(item["configuration_id"]);
          }}
          className={classes.button}
        >
          Find anomalies
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you wish to delete this configuration?"
              )
            )
              handleDeleteConfiguration(item["configuration_id"]);
          }}
          className={classes.button}
          startIcon={<DeleteIcon />}
        >
          Delete Configuration
        </Button>
      </Grid>
      {runningState[item["configuration_id"]] ? (
        <Grid item>
          <Loader
            type="TailSpin"
            color="#00BFFF"
            height={30}
            width={30}
            timeout={5000} //3 secs
          />
        </Grid>
      ) : (
        <Grid item></Grid>
      )}
    </Grid>
  ));

  var options = connections.map((item, index) => (
    <option value={item["id"]}> {item["name"]} </option>
  ));

  var create_configurations = (
    <Popup
      key="create_configuration_popup"
      trigger={
        <Fab color="primary" aria-label="add" style={style}>
          <AddIcon />
        </Fab>
      }
      position="right center"
      modal
      nested
    >
      <form style={popup_style} key="create_configuration_div">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="configurationName"
              name="configurationName"
              variant="outlined"
              required
              fullWidth
              id="configurationName"
              label="Configuration Name"
              autoFocus
              value={configurationName}
              onChange={e => setConfigurationName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel htmlFor="connection-name-simple">
              Connection Name
            </InputLabel>
            <Select
              native
              value={connectionName}
              onChange={e => setConnectionName(e.target.value)}
              inputProps={{
                name: "name",
                id: "connection-name-simple"
              }}
            >
              <option aria-label="None" value="" />
              {options}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="tableName"
              name="tableName"
              variant="outlined"
              required
              fullWidth
              id="tableName"
              label="Table Name"
              autoFocus
              value={newConfiguration["tables"][0]["name"]}
              onChange={e => set_new_value("name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <ConfigurationColumn
              unique_key="create_configuration_column"
              columns={newConfiguration["tables"][0]["columns"]}
              configuration_id={-1}
              set_value={set_new_value}
            ></ConfigurationColumn>
          </Grid>
          <Grid item xs={12}>
            <ConfigurationCategories
              unique_key="create_configuration_category"
              categories={newConfiguration["tables"][0]["categories"]}
              configuration_id={-1}
              set_value={set_new_value}
            ></ConfigurationCategories>
          </Grid>
          <Grid item xs={12}>
            <ConfigurationFilter
              unique_key="create_configuration_filter"
              filters={newConfiguration["tables"][0]["filters"]}
              configuration_id={-1}
              set_value={set_new_value}
            ></ConfigurationFilter>
          </Grid>
          <Grid item xs={12}>
            <ConfigurationDateSpecifier
              unique_key="create_configuration_date_specifier"
              dateSpecifier={newConfiguration["tables"][0]["date_specifier"]}
              configuration_id={-1}
              set_value={set_new_value}
            ></ConfigurationDateSpecifier>
          </Grid>
          <Grid item xs={12}>
            <ConfigurationMetric
              key="create_configuration_metric"
              metrics={newConfiguration["tables"][0]["metrics"]}
              configuration_id={-1}
              set_value={set_new_value}
            ></ConfigurationMetric>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="trainSchedule"
              name="trainSchedule"
              variant="outlined"
              required
              fullWidth
              id="trainSchedule"
              label="Train Schedule"
              autoFocus
              value={trainSchedule}
              onChange={e => setTrainSchedule(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="predictSchedule"
              name="predictSchedule"
              variant="outlined"
              required
              fullWidth
              id="predictSchedule"
              label="Predict Schedule"
              autoFocus
              value={predictSchedule}
              onChange={e => setPredictSchedule(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button onClick={() => handleOnCreate()}>Create</Button>
      </form>
    </Popup>
  );

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Header title="Anomaly Detection" sections={sections} />
      </Container>
      <Container component="main" fixed>
        <CssBaseline />
        <div style={{ padding: 20 }}>
          {/* <Grid container direction="column" justify="space-around" alignItems="center"> */}
          {configurations_output}
          {/* </Grid> */}
        </div>
        {create_configurations}
      </Container>
    </React.Fragment>
  );
}
