import { Flipped } from "react-flip-toolkit";
import { useEffect, useState, useRef } from "react";
import AnomaliesByDay from "components/charts/AnomaliesByDay";
import DeathsByDay from "components/charts/DeathsByDay";
import AnomalyScoresByDay from "components/charts/AnomalyScoresByDay";
import Button from "components/Button";
import Logs from "components/Logs";
import Model from "components/Model";
import BackButton from "components/BackButton";
import StatefulButton from "components/StatefulButton";
import WarningIcon from "@material-ui/icons/Warning";

const Configuration = (props) => {
  const id = props.match.params.id;
  const [config, setConfig] = useState(null);
  const [logsOpened, setLogsOpened] = useState(false);
  const [modelOpened, setModelOpened] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [reload, setReload] = useState(false);
  const [concern, setConcern] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    (async function get() {
      try {
        const res = await fetch("http://127.0.0.1:8000/configuration/" + id + "/").then((x) =>
          x.json()
        );
        setConfig(res);
      } catch (er) {
        console.log(er);
      }
    })();
  }, []);

  useEffect(() => {
    if (isTraining) {
      timeoutRef.current = setTimeout(async () => {
        const res = await fetch("http://localhost:8000/configuration_jobs/" + id).then((x) =>
          x.json()
        );
        if (!res.is_running) {
          setIsTraining(false);
        } else {
          setRefresh((prev) => !prev);
        }
      }, 2000);
    }
    return () => (timeoutRef.current ? clearTimeout(timeoutRef.current) : null);
  }, [isTraining, refresh]);

  async function handleTrainModel() {
    try {
      setIsTraining(true);
      const res = await fetch("http://127.0.0.1:8000/isolated_forest/" + id).then((x) => x.json());

      if (res["success"]) {
        setReload((prev) => !prev);
      } else {
        setConcern(true);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="p-4">
      <Logs open={logsOpened} onClose={() => setLogsOpened(false)} configId={id}></Logs>
      <Model open={modelOpened} onClose={() => setModelOpened(false)} configId={id}></Model>
      <Flipped flipId={`config-${id}-container`}>
        <div
          className="bg-gray-400 w-100 px-sm-5 py-5 px-4"
          style={{ minHeight: 700, borderRadius: 31 }}
        >
          <div className="row no-gutters justify-content-between mb-5 aling-items-start">
            <div className="d-flex align-items-center mb-4 mr-3">
              <BackButton className="mr-3"></BackButton>
              <div style={{ fontSize: 29 }} className="font-weight-bold text-capitalizem mr-2">
                {config ? config.configuration_name : ""}
              </div>
              {concern ? <WarningIcon style={{ color: "red" }}></WarningIcon> : null}
            </div>

            <div className="d-flex flex-wrap mb-3">
              <StatefulButton
                primary
                width={150}
                className="mr-2 mb-2"
                onClick={handleTrainModel}
                isLoading={isTraining}
                loadingValue="Traininig..."
                successValue="Finished!"
              >
                {"Train model"}
              </StatefulButton>
              <Button onClick={() => setModelOpened(true)} className="mr-2 mb-2">
                View model
              </Button>
              <Button onClick={() => setLogsOpened(true)} className="mb-2">
                Logs
              </Button>
            </div>
          </div>
          <DeathsByDay configurationId={id} reload={reload}></DeathsByDay>
          <AnomaliesByDay configurationId={id} reload={reload}></AnomaliesByDay>
          <AnomalyScoresByDay configurationId={id} reload={reload}></AnomalyScoresByDay>
        </div>
      </Flipped>
    </div>
  );
};

export default Configuration;
