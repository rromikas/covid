import { useState, useEffect } from "react";
import ConfigureOptions from "./NewConfigureOptions";
import { useHistory } from "react-router-dom";
import Select from "@material-ui/core/Select";
import ArrowDown from "@material-ui/icons/KeyboardArrowDown";
import Button from "components/Button";
import BackButton from "components/BackButton";

const NewConfiguration = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newConfiguration, setNewConfiguration] = useState({
    tables: [
      {
        name: "",
        columns: [{ name: "", type: "" }],
        metrics: [{ name: "", aggregation: "" }],
        categories: [{ name: "" }],
        filters: [{ name: "", operation: "", value: "" }],
        date_specifier: [{ name: "" }],
        is_active: false,
      },
    ],
    train_schedule: "",
    predict_schedule: "",
  });
  const [connectionName, setConnectionName] = useState({ name: "", id: "" });

  const set_new_value = (index, name, value) => {
    let config = { ...newConfiguration };
    config["tables"][0][name] = value;
    setNewConfiguration(config);
  };

  const handleOnCreate = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/configuration/", {
        method: "POST",
        body: JSON.stringify({
          connection_id: "http://127.0.0.1:8000/connection/" + connectionName + "/",
          configuration: newConfiguration,
          configuration_name: newConfiguration["tables"][0]["name"],
          train_schedule: newConfiguration.train_schedule,
          predict_schedule: newConfiguration.predict_schedule,
          is_active: false,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()); // fetching the data from api, before the page loaded
      if (res.configuration_id) {
        history.push("/configurations");
      } else {
        setError("Missing fields: " + Object.keys(res).join(", "));
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

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
            id: connections[i]["connection_id"],
          });
        }

        setConnections(connection_names);
      } catch (e) {
        console.log(e);
      }
    }
    getConnections();
  }, []);

  const options = connections.map((item, index) => (
    <option className="text-dark" value={item["id"]}>
      {item["name"]}{" "}
    </option>
  ));

  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-3">
        <BackButton className="mr-3"></BackButton>
        <div style={{ fontSize: 29 }} className="font-weight-bold">
          New Configuration
        </div>
      </div>
      <div className="p-5 bg-gray-400" style={{ borderRadius: 31 }}>
        <div className="mb-3">
          <div className="text-capitalize mb-1" style={{ fontSize: 14, fontWeight: 500 }}>
            Name
          </div>
          <input
            placeholder="Enter name"
            spellCheck={false}
            type="text"
            value={newConfiguration["tables"][0]["name"]}
            onChange={(e) => set_new_value(0, "name", e.target.value)}
            style={{ background: "transparent", border: "none", outline: 0, fontSize: 18 }}
            className="font-weight-bold text-capitalize p-0"
          ></input>
        </div>
        <div className="mb-1 text-capitalize" style={{ fontSize: 14, fontWeight: 500 }}>
          Connection
        </div>
        <Select
          IconComponent={ArrowDown}
          disableUnderline
          className="w-full text-white mb-3"
          native
          classes={{
            root: "rounded bg-danger font-weight-bold px-4 py-2",
            icon: "text-white",
            selectMenu: "text-dark",
          }}
          value={connectionName}
          onChange={(e) => setConnectionName(e.target.value)}
          inputProps={{
            name: "name",
            id: "connection-name-simple",
          }}
        >
          <option className="text-dark" aria-label="None" value="None">
            Select
          </option>
          {options}
        </Select>
        <div className="mb-1 text-capitalize" style={{ fontSize: 14, fontWeight: 500 }}>
          Configure options
        </div>
        <ConfigureOptions
          set_new_value={set_new_value}
          setNewConfiguration={setNewConfiguration}
          newConfiguration={newConfiguration}
        ></ConfigureOptions>
        <div
          style={{ opacity: error ? 1 : 0, color: "red", height: 50 }}
          className="d-flex align-items-end pb-2"
        >
          {error}
        </div>
        <div className="d-flex flex-wrap">
          <Button primary className="mr-2 mb-2" onClick={handleOnCreate}>
            {loading ? "Loading..." : "Create"}
          </Button>
          <Button className="mb-2" onClick={() => history.push("/configurations")}>
            Discard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewConfiguration;
