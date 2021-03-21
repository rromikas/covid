import ConfigurationColumn from "configuration_page/ConfigurationColumns";
import ConfigurationCategories from "configuration_page/ConfigurationCategories";
import ConfigurationFilter from "configuration_page/ConfigurationFilters";
import ConfigurationDateSpecifier from "configuration_page/ConfigurationDateSpecifier";
import ConfigurationMetric from "configuration_page/ConfigurationMetric";
import ConfigurationSchedules from "configuration_page/ConfigurationSchedules";
import { Flipped, spring } from "react-flip-toolkit";

const ConfigureOptions = ({ item, set_value, index, setConfigurations }) => {
  return (
    <Flipped
      flipId={`options-for-${index}-${Date.now()}`}
      onAppear={(el) => {
        el.style.opacity = 1;
        spring({
          onUpdate: (val) => (el.style.transform = `translateX(${(1 - val) * 100}%)`),
        });
      }}
      onExit={(el, ind, remove) => {
        spring({
          onComplete: remove,
          onUpdate: (val) => (el.style.transform = `translateX(${val * 100}%)`),
        });
      }}
    >
      <div className="w-100 m-auto">
        <div className="mb-2">
          <ConfigurationColumn
            unique_key={index + "_column"}
            columns={item["configuration"]["tables"][0]["columns"]}
            configuration_id={index}
            set_value={set_value}
          ></ConfigurationColumn>
        </div>
        <div className="mb-2">
          <ConfigurationCategories
            unique_key={index + "_category"}
            categories={item["configuration"]["tables"][0]["categories"]}
            configuration_id={index}
            set_value={set_value}
          ></ConfigurationCategories>
        </div>
        <div className="mb-2">
          <ConfigurationFilter
            unique_key={index + "_filter"}
            filters={item["configuration"]["tables"][0]["filters"]}
            configuration_id={index}
            set_value={set_value}
          ></ConfigurationFilter>
        </div>
        <div className="mb-2">
          <ConfigurationDateSpecifier
            unique_key={index + "_date_specifier"}
            dateSpecifier={item["configuration"]["tables"][0]["date_specifier"]}
            configuration_id={index}
            set_value={set_value}
          ></ConfigurationDateSpecifier>
        </div>
        <div className="mb-2">
          <ConfigurationMetric
            key={index + "_metric"}
            metrics={item["configuration"]["tables"][0]["metrics"]}
            configuration_id={index}
            set_value={set_value}
          ></ConfigurationMetric>
        </div>
        <div className="mb-2">
          <ConfigurationSchedules
            key={index + "_schedules"}
            schedules={{
              predict_schedule: item["predict_schedule"],
              train_schedule: item["train_schedule"],
            }}
            configuration_id={index}
            index={index}
            setTrain={(e) =>
              setConfigurations((prev) => {
                let arr = [...prev];
                arr[index]["train_schedule"] = e.target.value;
                return arr;
              })
            }
            setPredict={(e) =>
              setConfigurations((prev) => {
                let arr = [...prev];
                arr[index]["predict_schedule"] = e.target.value;
                return arr;
              })
            }
          ></ConfigurationSchedules>
        </div>
      </div>
    </Flipped>
  );
};

export default ConfigureOptions;
