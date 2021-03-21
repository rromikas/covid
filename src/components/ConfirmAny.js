import { confirmable, createConfirmation } from "react-confirm";
import Button from "components/Button";
import { useState } from "react";

const ConfirmAny = ({ confirmation, proceed }) => {
  const [show, setShow] = useState(true); // for some reason after cancelling, popup closes with delay.
  return show ? (
    <div
      onClick={() => {
        proceed(false);
        setShow(false);
      }}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        background: `rgba(0,0,0,0.4)`,
      }}
      className="d-flex overflow-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 500, width: "100%", background: "white", borderRadius: 11 }}
        className="p-5 m-auto"
      >
        <div className="mb-5 text-center" style={{ fontSize: 18, fontWeight: 700 }}>
          {confirmation ? confirmation : "Are you sure?"}
        </div>
        <div className="d-flex justify-content-center">
          <div className="d-flex flex-wrap">
            <Button
              primary
              className="mr-3"
              onClick={() => {
                setShow(false);
                proceed(true);
              }}
            >
              Confirm
            </Button>
            <Button
              onClick={() => {
                proceed(false);
                setShow(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default createConfirmation(confirmable(ConfirmAny));
