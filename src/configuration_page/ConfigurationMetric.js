import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Button from "components/Button";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import CloseIcon from "@material-ui/icons/Close";

export default function ConfigurationMetric(props) {
  const { metrics, unique_key, configuration_id, set_value } = props;
  const [inputList, setInputList] = useState([{ name: "", aggregation: "" }]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setInputList(metrics);
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);

    set_value(configuration_id, "metrics", list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { name: "", aggregation: "" }]);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} utilityButton>
        Metrics Configuration
      </Button>
      <Modal open={open}>
        <div className="w-100 h-100 overflow-auto p-4 d-flex" onClick={() => setOpen(false)}>
          <div
            className="m-auto bg-white p-5"
            style={{ maxWidth: 800, width: "100%", borderRadius: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div style={{ fontSize: 29, fontWeight: 700 }}>Edit metrics</div>
              <CloseIcon
                className="cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              ></CloseIcon>
            </div>
            <div className="px-2 mb-2" style={{ height: 350, overflow: "auto" }}>
              {inputList.map((x, i) => {
                return (
                  <div className="d-flex align-items-center" key={`input-${i}-${unique_key}`}>
                    <TextField
                      className="mr-2"
                      variant="outlined"
                      margin="normal"
                      required
                      id="metric_name"
                      label="Metric Name"
                      name="name"
                      value={x["name"]}
                      autoFocus
                      required
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    <TextField
                      className="mr-2"
                      variant="outlined"
                      margin="normal"
                      required
                      id="aggregation"
                      label="Aggregation"
                      name="aggregation"
                      value={x["aggregation"]}
                      autoFocus
                      required
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    {i > 0 ? (
                      <Button className="mr10" onClick={() => handleRemoveClick(i)} primary>
                        Remove
                      </Button>
                    ) : null}
                  </div>
                );
              })}
              <Button onClick={handleAddClick}>Add</Button>
              <div className="p-3 bg-gray-300 rounded code" style={{ marginTop: 20 }}>
                <pre>{JSON.stringify(inputList, null, 2)}</pre>
              </div>
            </div>
            <Button className="float-right mt-3" onClick={() => setOpen(false)}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

ConfigurationMetric.propTypes = {
  categories: PropTypes.array,
  unique_key: PropTypes.string,
  set_value: PropTypes.func,
  configuration_id: PropTypes.number,
};
