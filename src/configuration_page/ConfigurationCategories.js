import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import Button from "components/Button";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import CloseIcon from "@material-ui/icons/Close";

export default function ConfigurationCategories(props) {
  const { categories, unique_key, configuration_id, set_value } = props;

  const [inputList, setInputList] = useState([{ name: "" }]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setInputList(categories);
  }, []);

  // setInputList(categories);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);

    if (configuration_id == -1) {
      set_value("categories", list);
    } else {
      set_value(configuration_id, "categories", list);
    }
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { name: "" }]);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} utilityButton>
        Categories Configuration
      </Button>
      <Modal open={open}>
        <div className="w-100 h-100 d-flex overflow-auto p-4" onClick={() => setOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="m-auto bg-white p-5"
            style={{
              maxWidth: 700,
              width: "100%",
              borderRadius: 15,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div style={{ fontSize: 29, fontWeight: 700 }}>Edit categories</div>
              <CloseIcon
                className="cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              ></CloseIcon>
            </div>
            <div className="mb-2" style={{ height: 320, overflow: "auto" }}>
              {inputList.map((x, i) => {
                return (
                  <div className="d-flex align-items-center" key={`input-${i}-${unique_key}`}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      className="mr-2"
                      id={"category_name" + i}
                      label="Category Name"
                      name="name"
                      autoFocus
                      required
                      value={x["name"]}
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    <div className="btn-box">
                      {i > 0 ? (
                        <Button primary onClick={() => handleRemoveClick(i)}>
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
            <Button className="float-right" onClick={() => setOpen(false)}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

ConfigurationCategories.propTypes = {
  categories: PropTypes.array,
  unique_key: PropTypes.string,
  set_value: PropTypes.func,
  configuration_id: PropTypes.number,
};
