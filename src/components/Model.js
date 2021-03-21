import Modal from "@material-ui/core/Modal";
import { useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment";

const Model = ({ open, onClose, configId }) => {
  const [model, setModel] = useState(null);

  useEffect(() => {
    (async function getData() {
      try {
        let res = await fetch(`http://127.0.0.1:8000/trained_models/${configId}/`).then((x) =>
          x.json()
        );
        setModel(res);
      } catch (er) {
        console.log(er);
      }
    })();
  }, []);

  return model ? (
    <Modal open={open} onClose={onClose}>
      <div className="w-100 h-100 d-flex overflow-auto" onClick={onClose}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="m-auto w-100 h-100 bg-white rounded p-4 d-flex flex-column"
          style={{ maxWidth: 800, maxHeight: 550 }}
        >
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="text-capitalize mb-3" style={{ fontWeight: 700, fontSize: 29 }}>
              Model
            </div>
            <CloseIcon onClick={onClose} className="cursor-pointer"></CloseIcon>
          </div>
          {model.model_name && model.updated_at ? (
            <div className="mb-3">
              <div className="text-capitalize" style={{ fontWeight: 700, fontSize: 18 }}>
                {model.model_name.split("_").join(" ")}
              </div>
              <div className="text-muted" style={{ fontWeight: 500, fontSize: 14 }}>
                Updated at {moment(model.updated_at).format("YYYY-MM-DD hh:mm:ss")}
              </div>
            </div>
          ) : null}
          <div
            className="flex-grow-1 overflow-auto p-3 bg-gray-300 rounded code"
            style={{ height: 0 }}
          >
            {model.model ? <pre>{JSON.stringify(JSON.parse(model.model), null, 2)}</pre> : null}
          </div>
        </div>
      </div>
    </Modal>
  ) : null;
};

export default Model;
