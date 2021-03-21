import { AreaChart, ResponsiveContainer, Area, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { curveCardinal } from "d3";
import moment from "moment";

const Chart = ({ data, float = false, title = "" }) => {
  useEffect(() => {
    document.querySelectorAll("rect").forEach((x) => {
      x.setAttributeNS(null, "rx", "15");
      x.setAttributeNS(null, "ry", "15");
    });
  }, []);

  const timeframes = { 30: "Month", 365: "Year", "-1": "All" };

  const [timeframe, setTimeframe] = useState(30);

  const customDot = (props) => {
    const { cx, cy } = props;
    return <circle cx={cx} cy={cy} r={9} stroke="white" strokeWidth={6} fill="#673de6" />;
  };

  const max = Math.max(...data.map((x) => x.value));

  return (
    <div className="mb-5 pb-4">
      <div className="row no-gutters align-items-end">
        <div
          className="col-auto d-md-flex d-none flex-column justify-content-between text-right pr-2"
          style={{ height: 200, fontWeight: 600, paddingBottom: 30 }}
        >
          <div>{float ? max.toFixed(1) : max}</div>
          <div>0</div>
        </div>
        <div className="col">
          <div className="chart-title mb-3">{title}</div>
          <div className="bg-white overflow-hidden" style={{ borderRadius: 15 }}>
            <div className="d-flex justify-content-end">
              <div className="d-flex py-3 px-3">
                {Object.keys(timeframes).map((x, i) => (
                  <div
                    key={`${title}-btn-${i}`}
                    className={`chart-btn ml-2 ${
                      parseInt(x) === parseInt(timeframe) ? "bg-secondary text-white" : ""
                    }`}
                    onClick={() => setTimeframe(x)}
                  >
                    {timeframes[x]}
                  </div>
                ))}
              </div>
            </div>
            <div className="row no-gutters">
              <div style={{ height: 170, width: 0 }} className="col">
                <ResponsiveContainer width="100%">
                  <AreaChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                    <CartesianGrid fill="white" vertical={false} horizontal={false}></CartesianGrid>
                    <Area
                      activeDot={customDot}
                      type={curveCardinal}
                      dataKey="value"
                      stroke="none"
                      fillOpacity={1}
                      fill="#673de6"
                    />
                    {/* <YAxis
                tickCount={3}
                textAnchor="start"
                interval="preserveStartEnd"
                tickMargin={-14}
                width={30}
                tickLine={false}
                axisLine={false}
                tick={{
                  fontWeight: 600,
                  fill: "black",
                  mixBlendMode: "difference",
                }}
              ></YAxis> */}
                    <Tooltip
                      cursor={false}
                      content={(props) => {
                        let payload = props?.payload?.length ? props.payload[0].payload : null;
                        return payload ? (
                          <div
                            style={{
                              background: "white",
                              padding: "7px 14px",
                              borderRadius: 7,
                              boxShadow: "2px 2px 9px 2px rgba(0,0,0,0.14)",
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                          >
                            <div className="d-flex mb-2">
                              <div className="mr-2">Date:</div>
                              <div className="text-muted">{payload?.date} </div>
                            </div>
                            <div className="d-flex">
                              <div className="mr-2">Value:</div>
                              <div className="font-weight-bold">{payload?.value}</div>
                            </div>
                          </div>
                        ) : (
                          <div></div>
                        );
                      }}
                    ></Tooltip>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div
            className="d-flex justify-content-between align-items-center px-2"
            style={{ fontWeight: 600, height: 30 }}
          >
            {/* {data
              .filter((x, i) => i % 4 === 0)
              .map((x, i) => (
                <div key={`${Math.random()}-label-${i}`}>{moment(x.date).format("MMM D")}</div>
              ))} */}
            {data.length ? (
              <>
                <div>{moment(data[0].date).format("YYYY, MMM D")}</div>
                <div>{moment(data[data.length - 1].date).format("YYYY, MMM D")}</div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
