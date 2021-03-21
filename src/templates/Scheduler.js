import React from "react";
import Crontab from "reactjs-crontab";
import "reactjs-crontab/dist/index.css";

export default function Scheduler(props) {
  const { item } = props;

  const sayHello = () => {
    console.log(item["configurationId"]);
  };
  
  const RequestSomething = () => {
    console.log(item["configurationId"]);
  };

  const tasks = React.useMemo(
    () => [
      {
        fn: sayHello,
        id: item["configurationId"] + "-train",
        config: item["trainSchedule"],
        // Execute every minutes
        name: item["configurationName"] + " train model"
      },
      {
        fn: RequestSomething,
        id: item["configurationId"] + "-predict",
        config: item["predictSchedule"],
        // Execute In November, December At 3PM and 7PM every minute
        name: item["configurationName"] + " predict"
      }
    ],
    []
  );
  // tasks should be memoized

  return (
    <Crontab
      tasks={tasks}
      timeZone="UTC"
      // timezone is UTC timezone.
      dashboard={{
        hidden: false
        // if true, dashboard is hidden
      }}
    />
  );
}
