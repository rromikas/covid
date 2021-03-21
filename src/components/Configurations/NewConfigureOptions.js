import ConfigurationColumn from "configuration_page/ConfigurationColumns";
import ConfigurationCategories from "configuration_page/ConfigurationCategories";
import ConfigurationFilter from "configuration_page/ConfigurationFilters";
import ConfigurationDateSpecifier from "configuration_page/ConfigurationDateSpecifier";
import ConfigurationMetric from "configuration_page/ConfigurationMetric";
import ConfigurationSchedules from "configuration_page/ConfigurationSchedules";

const ConfigureOptions = ({ newConfiguration, setNewConfiguration, set_new_value, index }) => {
  return (
    <div className="w-100 m-auto d-flex flex-wrap">
      <div className="mb-2 mr-2">
        <ConfigurationColumn
          unique_key="create_configuration_column"
          columns={newConfiguration["tables"][0]["columns"]}
          configuration_id={-1}
          set_value={set_new_value}
        ></ConfigurationColumn>
      </div>
      <div className="mb-2 mr-2">
        <ConfigurationCategories
          unique_key="create_configuration_category"
          categories={newConfiguration["tables"][0]["categories"]}
          configuration_id={-1}
          set_value={set_new_value}
        ></ConfigurationCategories>
      </div>
      <div className="mb-2 mr-2">
        <ConfigurationFilter
          unique_key="create_configuration_filter"
          filters={newConfiguration["tables"][0]["filters"]}
          configuration_id={-1}
          set_value={set_new_value}
        ></ConfigurationFilter>
      </div>
      <div className="mb-2 mr-2">
        <ConfigurationDateSpecifier
          unique_key="create_configuration_date_specifier"
          dateSpecifier={newConfiguration["tables"][0]["date_specifier"]}
          configuration_id={-1}
          set_value={set_new_value}
        ></ConfigurationDateSpecifier>
      </div>
      <div className="mb-2 mr-2">
        <ConfigurationMetric
          key="create_configuration_metric"
          metrics={newConfiguration["tables"][0]["metrics"]}
          configuration_id={-1}
          set_value={set_new_value}
        ></ConfigurationMetric>
      </div>
      <div className="mb-2 mr-2">
        <ConfigurationSchedules
          key={index + "_schedules"}
          schedules={{
            predict_schedule: newConfiguration["predict_schedule"],
            train_schedule: newConfiguration["train_schedule"],
          }}
          configuration_id={index}
          index={index}
          setTrain={(e) => {
            return setNewConfiguration((prev) => ({ ...prev, train_schedule: e.target.value }));
          }}
          setPredict={(e) => {
            return setNewConfiguration((prev) => ({ ...prev, predict_schedule: e.target.value }));
          }}
        ></ConfigurationSchedules>
      </div>
    </div>
  );
};

export default ConfigureOptions;
