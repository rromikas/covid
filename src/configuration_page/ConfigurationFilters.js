import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import Button from "components/Button";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";

export default function ConfigurationFilter(props) {
  const { filters, unique_key, configuration_id, set_value } = props;
  const [inputList, setInputList] = useState([{ name: "", operation: "", value: "" }]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setInputList(filters);
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);

    set_value(configuration_id, "filters", list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { name: "", operation: "", value: "" }]);
  };

  return (
    <>
      <Button utilityButton onClick={() => setOpen(true)}>
        Filters Configuration{" "}
      </Button>
      <Modal open={open}>
        <div className="w-100 h-100 overflow-auto p-4 d-flex" onClick={() => setOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="m-auto bg-white p-5"
            style={{ maxWidth: 800, width: "100%", borderRadius: 15 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div style={{ fontSize: 29, fontWeight: 700 }}>Edit filters</div>
              <CloseIcon
                className="cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              ></CloseIcon>
            </div>
            <div className="px-2 pb-4" style={{ height: 360, overflow: "auto" }}>
              {inputList.map((x, i) => {
                return (
                  <div
                    className="row no-gutters align-items-center"
                    key={`input-${i}-${unique_key}`}
                  >
                    <div className="col pr-2">
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id={"filter_name" + i}
                        label="1st Operand"
                        name="name"
                        value={x["name"]}
                        autoFocus
                        required
                        onChange={(e) => handleInputChange(e, i)}
                        fullWidth
                      />
                    </div>
                    <div className="col pr-2">
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id={"filter_operation" + i}
                        label="Operation"
                        name="operation"
                        value={x["operation"]}
                        autoFocus
                        required
                        onChange={(e) => handleInputChange(e, i)}
                        fullWidth
                      />
                    </div>
                    <div className="col pr-2">
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id={"filter_value" + i}
                        label="2nd Operand"
                        name="value"
                        value={x["value"]}
                        autoFocus
                        required
                        fullWidth
                      />
                    </div>
                    <div className="col-auto">
                      {i > 0 ? (
                        <Button onClick={() => handleRemoveClick(i)} primary>
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              <Button className="mt-2" onClick={handleAddClick}>
                Add
              </Button>
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

ConfigurationFilter.propTypes = {
  categories: PropTypes.array,
  unique_key: PropTypes.string,
  set_value: PropTypes.func,
  configuration_id: PropTypes.number,
};
