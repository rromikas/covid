import Modal from "@material-ui/core/Modal";
import { useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";

const Logs = ({ open, onClose, configId }) => {
  const [data, setData] = useState("");

  useEffect(() => {}, []);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-100 h-100 d-flex overflow-auto" onClick={onClose}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="m-auto w-100 h-100 bg-white rounded p-4 d-flex flex-column"
          style={{ maxWidth: 600, maxHeight: 500 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div style={{ fontSize: 29, fontWeight: 700 }}>Logs</div>
            <CloseIcon onClick={onClose} className="cursor-pointer"></CloseIcon>
          </div>

          <div className="flex-grow-1 overflow-auto bg-gray-400 rounded p-4" style={{ height: 0 }}>
            <div>{data}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Logs;
