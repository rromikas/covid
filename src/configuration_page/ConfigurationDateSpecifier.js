import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import Button from "components/Button";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";

export default function ConfigurationDateSpecifier(props) {
  const { dateSpecifier, unique_key, configuration_id, set_value } = props;
  const [inputList, setInputList] = useState([{ name: "" }]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setInputList(dateSpecifier);
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);

    set_value(configuration_id, "date_specifier", list);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} utilityButton>
        Date Specifier Configuration{" "}
      </Button>
      <Modal open={open}>
        <div className="w-100 h-100 p-4 overflow-auto d-flex" onClick={() => setOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="m-auto bg-white p-5"
            style={{ maxWidth: 700, width: "100%", borderRadius: 15 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div style={{ fontSize: 29, fontWeight: 700 }}>Edit date specifier</div>
              <CloseIcon
                className="cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              ></CloseIcon>
            </div>
            <div className="px-2" style={{ height: 260, overflow: "auto" }}>
              {inputList.map((x, i) => {
                return (
                  <div className="box" key={`input-${i}-${unique_key}`}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      id={"date_specifier" + i}
                      label="Date Specifier"
                      name="name"
                      value={x["name"]}
                      autoFocus
                      required
                      onChange={(e) => handleInputChange(e, i)}
                    />
                  </div>
                );
              })}
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

ConfigurationDateSpecifier.propTypes = {
  dateSpecifier: PropTypes.array,
  unique_key: PropTypes.string,
  set_value: PropTypes.func,
  configuration_id: PropTypes.number,
};
