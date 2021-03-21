import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import Modal from "@material-ui/core/Modal";
import Button from "components/Button";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";

export default function ConfigurationCategories(props) {
  const { schedules, unique_key, setConfigurations, index, setTrain, setPredict } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} utilityButton>
        Schedules Configuration
      </Button>
      <Modal open={open}>
        <div className="w-100 h-100 d-flex overflow-auto p-4">
          <div
            className="m-auto bg-white p-5"
            style={{ maxWidth: 500, width: "100%", borderRadius: 15 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div style={{ fontSize: 29, fontWeight: 700 }}>Edit schedules</div>
              <CloseIcon
                className="cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              ></CloseIcon>
            </div>
            <TextField
              className="w-100"
              variant="outlined"
              margin="normal"
              required
              id="predict_schedule"
              label="Predict schedule"
              name="name"
              value={schedules["predict_schedule"]}
              autoFocus
              required
              onChange={setPredict}
            />
            <TextField
              className="w-100"
              variant="outlined"
              margin="normal"
              required
              id="train_schedule"
              label="Train schedule"
              name="name"
              value={schedules["train_schedule"]}
              autoFocus
              required
              onChange={setTrain}
            />
            <Button className="float-right mt-3" onClick={() => setOpen(false)}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

ConfigurationCategories.propTypes = {
  unique_key: PropTypes.string,
  set_value: PropTypes.func,
  configuration_id: PropTypes.number,
};
