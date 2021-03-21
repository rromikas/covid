import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import Button from "components/Button";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";

export default function ConfigurationColumn(props) {
  const { columns, unique_key, configuration_id, set_value } = props;
  const [inputList, setInputList] = useState([{ name: "", type: "" }]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setInputList(columns);
  }, [columns]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);

    set_value(configuration_id, "columns", list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { name: "", type: "" }]);
  };

  return (
    <>
      <Button key={unique_key} utilityButton onClick={() => setOpen(true)}>
        Columns Configuration
      </Button>
      <Modal open={open} onClose={() => setOpen((prev) => !prev)}>
        <div
          className="w-100 h-100 d-flex overflow-auto p-4"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div
            className="bg-white m-auto p-5"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 800,
              width: "100%",
              borderRadius: 15,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div style={{ fontSize: 29, fontWeight: 700 }}>Edit columns</div>
              <CloseIcon
                className="cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              ></CloseIcon>
            </div>

            <div className="mb-2 px-2 pb-4" style={{ height: 350, overflow: "auto" }}>
              {inputList.map((x, i) => {
                return (
                  <div
                    className="d-flex align-items-center flex-wrap"
                    key={`input-${i}-${unique_key}`}
                  >
                    <TextField
                      className="mr-2"
                      variant="outlined"
                      margin="normal"
                      required
                      id={"column_name_" + i}
                      label="Column Name"
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
                      id={"column_type_" + i}
                      label="Column Type"
                      name="type"
                      value={x["type"]}
                      autoFocus
                      required
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    {i > 0 ? (
                      <Button primary onClick={() => handleRemoveClick(i)}>
                        Remove
                      </Button>
                    ) : null}
                  </div>
                );
              })}
              <div className="btn-box mt-2">
                <Button onClick={handleAddClick}>Add</Button>
              </div>
              <div className="p-3 bg-gray-300 rounded code" style={{ marginTop: 20 }}>
                <pre>{JSON.stringify(inputList, null, 2)}</pre>
              </div>
            </div>
            <div>
              <Button className="float-right mt-3" onClick={() => setOpen(false)}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

ConfigurationColumn.propTypes = {
  columns: PropTypes.array,
  unique_key: PropTypes.string,
  set_value: PropTypes.func,
  configuration_id: PropTypes.number,
};
