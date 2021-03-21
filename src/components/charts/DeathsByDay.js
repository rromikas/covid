import React from "react";
import { useState, useEffect, useRef } from "react";
import Chart from "./Chart";

export default function AnomaliesMetricsByDay(props) {
  const { configurationId, reload } = props;
  const [graphName, setGraphName] = useState("Deaths");

  const [graphData, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/dashboard_metric_30/" + configurationId + "/"
        ).then((x) => x.json());
        setData(res.data.data[0].values.map((x, i) => ({ date: res.data.labels[i], value: x })));
      } catch (e) {
        console.log(e);
      }
    }
    getData();
  }, [configurationId, reload]);

  return (
    <div>
      <Chart data={graphData} title={graphName} />
    </div>
  );
}
