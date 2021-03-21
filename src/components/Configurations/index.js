import AddIcon from "@material-ui/icons/Add";
import { useEffect, useState } from "react";
import Button from "components/Button";
import ConfigureOptions from "./ConfigureOptions";
import SettingsIcon from "@material-ui/icons/Settings";
import { Flipper, Flipped, spring } from "react-flip-toolkit";
import { useHistory } from "react-router-dom";
import Confirm from "components/ConfirmAny";
import moment from "moment";

const ConnectionName = ({ cid }) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    (async function get() {
      try {
        const res = await fetch(cid).then((x) => x.json());
        if (res.connection_name) {
          setValue(res.connection_name);
        }
      } catch (er) {
        console.log(er);
      }
    })();
  }, [cid]);
  return value;
};

const TrainTime = ({ cid }) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    (async function get() {
      try {
        let res = await fetch(`http://127.0.0.1:8000/trained_models/${cid}/`).then((x) => x.json());
        if (res.updated_at) {
          setValue(res.updated_at);
        }
      } catch (er) {
        console.log(er);
      }
    })();
  }, [cid]);
  return value ? moment(value).format("YYYY-MM-DD hh-mm-ss") : "Not trained";
};

const Configurations = ({ configurations, setConfigurations }) => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [openedConfigOptionsIndex, setOpenedConfigOptionsIndex] = useState(-1);
  const [reload, setReload] = useState(false);

  const set_value = (index, name, value) => {
    const configs = [...configurations];
    configs[index]["configuration"]["tables"][0][name] = value;
    setConfigurations(configs);
  };

  useEffect(() => {
    async function getConfigurations() {
      try {
        const res = await fetch("http://127.0.0.1:8000/configuration/");
        console.log("Response", res);
        const configurations = await res.json();

        const initialStates = {};
        const initialRunningStates = {};

        for (let i = 0; i < configurations.length; i++) {
          initialStates[configurations[i]["connection_id"]] = configurations[i]["is_active"];

          const stateRes = await fetch(
            "http://localhost:8000/configuration_jobs/" + configurations[i]["configuration_id"]
          );
          const runningConfState = await stateRes.json();
          initialRunningStates[configurations[i]["connection_id"]] = runningConfState["is_running"];
        }

        // setRunningState(initialRunningStates);
        // setState(initialStates);
        console.log("initial states", initialStates);
        console.log("initial rrunning states", initialRunningStates);
        console.log("configurations", configurations);
        setConfigurations(configurations);
      } catch (e) {
        console.log(e);
      }
    }
    getConfigurations();
  }, [reload]);

  async function handleOnUpdate(index) {
    try {
      setLoading(true);
      const res = await fetch(
        "http://127.0.0.1:8000/configuration/" + configurations[index]["configuration_id"] + "/",
        {
          method: "PUT",
          body: JSON.stringify({
            connection_id: configurations[index]["connection_id"],
            configuration: configurations[index]["configuration"],
            configuration_name: configurations[index]["configuration_name"],
            train_schedule: configurations[index]["train_schedule"],
            predict_schedule: configurations[index]["predict_schedule"],
            is_active: configurations[index]["is_active"],
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      ).then((x) => x.json());

      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDeleteConfiguration(configuration_id) {
    try {
      let agreement = await Confirm({
        confirmation: "Are you sure you wish to delete this configuration?",
      });

      if (agreement) {
        const res = await fetch("http://127.0.0.1:8000/configuration/" + configuration_id + "/", {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        console.log(res);

        if (res["ok"]) {
          setReload((prev) => !prev);
        } else {
          history.push("/configuration");
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  console.log("congifura", configurations);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center p-4">
        <div style={{ fontSize: 29 }} className="font-weight-bold">
          Configurations
        </div>
        <Button onClick={() => history.push("/configurations/new")}>
          <div className="d-flex align-items-center">
            <div className="mr-2">Add new</div>
            <AddIcon></AddIcon>
          </div>
        </Button>
      </div>
      <Flipper flipKey={configurations.length} className="row no-gutters p-2">
        {configurations.map((x, i) => (
          <div className="col-md-6 col-12 p-3" key={`config-${i}`}>
            <Flipped flipId={`config-${x.configuration_id}-container`}>
              <div className="bg-gray-400 p-5" style={{ borderRadius: 31 }}>
                <input
                  spellCheck={false}
                  type="text"
                  disabled={openedConfigOptionsIndex !== i}
                  value={x["configuration"]["tables"][0]["name"]}
                  onChange={(e) => set_value(i, "name", e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: 0,
                    fontSize: 25,
                  }}
                  className="font-weight-bold text-capitalize text-truncate w-100"
                ></input>

                <Flipper
                  id={Date.now()}
                  flipKey={openedConfigOptionsIndex === i}
                  className="overflow-hidden"
                  handleEnterUpdateDelete={({
                    animateEnteringElements,
                    animateExitingElements,
                    animateFlippedElements,
                  }) => {
                    animateEnteringElements();
                    animateExitingElements();
                    animateFlippedElements();
                  }}
                >
                  <div className="d-flex" style={{ height: 350 }}>
                    {openedConfigOptionsIndex === i ? (
                      <ConfigureOptions
                        index={i}
                        item={x}
                        set_value={set_value}
                        setConfigurations={setConfigurations}
                      ></ConfigureOptions>
                    ) : (
                      <Flipped
                        flipId={`preview-for-${i}-${Date.now()}`}
                        onAppear={(el) => {
                          el.style.opacity = 1;
                          spring({
                            onUpdate: (val) =>
                              (el.style.transform = `translateX(${(val - 1) * 100}%)`),
                          });
                        }}
                        onExit={(el, ind, remove) => {
                          console.log("index", ind);
                          spring({
                            onComplete: remove,
                            onUpdate: (val) => (el.style.transform = `translateX(-${val * 100}%)`),
                          });
                        }}
                      >
                        <div className="my-auto">
                          <div className="mb-4">
                            <div
                              className="mb-1 text-capitalize"
                              style={{ fontSize: 14, fontWeight: 500 }}
                            >
                              Connection name
                            </div>
                            <div className="font-weight-bold" style={{ fontSize: 18 }}>
                              <ConnectionName cid={x.connection_id}></ConnectionName>
                            </div>
                          </div>
                          {["predict_schedule", "train_schedule"].map((prop, ind) => (
                            <div className="mb-4" key={`config-${i}-prop-${ind}`}>
                              <div
                                className="mb-1 text-capitalize"
                                style={{ fontSize: 14, fontWeight: 500 }}
                              >
                                {prop.split("_").join(" ")}
                              </div>
                              <div className="font-weight-bold" style={{ fontSize: 18 }}>
                                {x[prop]}
                              </div>
                            </div>
                          ))}
                          <div className="mb-2">
                            <div
                              className="mb-1 text-capitalize"
                              style={{ fontSize: 14, fontWeight: 500 }}
                            >
                              Last time trained
                            </div>
                            <div className="font-weight-bold" style={{ fontSize: 18 }}>
                              <TrainTime cid={x.configuration_id}></TrainTime>
                            </div>
                          </div>
                        </div>
                      </Flipped>
                    )}
                  </div>
                </Flipper>
                {openedConfigOptionsIndex === i ? (
                  <div className="row no-gutters">
                    <Button
                      primary
                      className="mr-2 mb-2"
                      onClick={() => {
                        handleOnUpdate(i);
                        setOpenedConfigOptionsIndex(-1);
                      }}
                    >
                      {loading ? "Loading..." : "Save"}
                    </Button>

                    <Button className="mb-2 mr-2" onClick={() => setOpenedConfigOptionsIndex(-1)}>
                      Discard
                    </Button>
                    <Button
                      className="mb-2"
                      onClick={() => handleDeleteConfiguration(x.configuration_id)}
                    >
                      Delete
                    </Button>
                  </div>
                ) : (
                  <div className="row no-gutters">
                    <Button
                      primary
                      className="mr-2 mb-2"
                      onClick={() => history.push(`/configurations/${x.configuration_id}`)}
                    >
                      View
                    </Button>

                    <Button
                      className="mb-2"
                      onClick={(e) => {
                        setOpenedConfigOptionsIndex(openedConfigOptionsIndex === i ? -1 : i);
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="mr-3">Configure</div>
                        <SettingsIcon></SettingsIcon>
                      </div>
                    </Button>
                  </div>
                )}
              </div>
            </Flipped>
          </div>
        ))}
      </Flipper>
    </div>
  );
};

export default Configurations;
