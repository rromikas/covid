import React from "react";
import { useState, useEffect, useRef } from "react";
import Chart from "./Chart";

export default function AnomaliesByDay(props) {
  const { configurationId, reload } = props;

  const [graphData, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/dashboard_30/" + configurationId + "/"
        ).then((x) => x.json());
        setData(res.data.data.map((x, i) => ({ date: res.data.labels[i], value: x })));
      } catch (e) {
        console.log(e);
      }
    }
    getData();
  }, [configurationId, reload]);

  return (
    <div>
      <Chart data={graphData} title="Daily Anomalies Count" />
    </div>
  );
}
