import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import { forwardRef } from "react";
import axios from "axios";
import MaterialTable from "material-table";
import Alert from "@material-ui/lab/Alert";
import ViewColumn from "@material-ui/icons/ViewColumn";
import Search from "@material-ui/icons/Search";
import SaveAlt from "@material-ui/icons/SaveAlt";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import { MuiThemeProvider as ThemeProvider } from "@material-ui/core/styles";
import CreateTheme from "@material-ui/core/styles/createMuiTheme";

const theme = CreateTheme({
  palette: {
    primary: {
      main: "#ff007a",
    },
    secondary: {
      main: "#673de6",
    },
    error: {
      main: "#673de6",
    },
  },
  typography: { fontFamily: "Montserrat, sans-serif" },
});

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const api = axios.create({
  baseURL: `http://127.0.0.1:8000`,
});

export default function Connection() {
  var columns = [
    { title: "Connection ID", field: "connection_id", editable: "never" },
    { title: "Connection Name", field: "connection_name" },
    { title: "Username", field: "username" },
    { title: "Host", field: "host" },
    { title: "Port", field: "port" },
    { title: "Database Name", field: "database" },
    { title: "Password", field: "password" },
  ];

  const history = useHistory();

  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const [connections, setConnections] = useState([]);
  useEffect(() => {
    async function getConnections() {
      try {
        const res = await fetch("http://127.0.0.1:8000/connection/");
        const connections = await res.json();

        setConnections(connections);
      } catch (e) {
        console.log(e);
      }
    }
    getConnections();
  }, []);

  useEffect(() => {
    let el = document.querySelector(`[class^=Component-horizontalScrollContainer]`);
    el.className = "skrolbaras";
  }, []);

  const handleRowAdd = (newData, resolve) => {
    //validation
    let errorList = [];
    if (newData.connection_name === undefined) {
      errorList.push("Please enter connection name");
    }
    if (newData.username === undefined) {
      errorList.push("Please enter a valid username");
    }
    if (newData.host === undefined || newData.host.split(".").length - 1 !== 3) {
      errorList.push("Please enter a valid host");
    }
    if (newData.port === undefined) {
      errorList.push("Please enter a valid port");
    }
    if (newData.database === undefined) {
      errorList.push("Please enter a valid database name");
    }
    if (newData.password === undefined) {
      errorList.push("Please enter a valid passowrd");
    }

    if (errorList.length < 1) {
      //no error
      api
        .post("/connection/", newData)
        .then((res) => {
          let dataToAdd = [...connections];
          dataToAdd.push(newData);
          setConnections(dataToAdd);
          resolve();
          setErrorMessages([]);
          setIserror(false);
          history.push("/connection");
        })
        .catch((error) => {
          setErrorMessages(["Cannot add data. Server error!"]);
          setIserror(true);
          resolve();
          history.push("/connection");
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  const handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    let errorList = [];
    if (errorList.length < 1) {
      api
        .patch("/connection/" + newData.connection_id + "/", newData)
        .then((res) => {
          const dataUpdate = [...connections];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          setConnections([...dataUpdate]);
          resolve();
          setIserror(false);
          setErrorMessages([]);
        })
        .catch((error) => {
          setErrorMessages(["Update failed! Server error"]);
          setIserror(true);
          resolve();
          history.push("/connection");
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  const handleRowDelete = (oldData, resolve) => {
    api
      .delete("/connection/" + oldData.connection_id + "/")
      .then((res) => {
        const dataDelete = [...connections];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setConnections([...dataDelete]);
        resolve();
      })
      .catch((error) => {
        setErrorMessages(["Delete failed! Server error"]);
        setIserror(true);
        resolve();
        history.push("/connection");
      });
  };

  const handleMultipleRowDelete = (rows) => {
    return new Promise((resolve, reject) => {
      let promises = [];
      rows.forEach((x) => {
        promises.push(new Promise((res, rej) => handleRowDelete(x, res)));
      });
      Promise.all(promises).then(resolve);
    });
  };

  return (
    <div className="p-4" style={{ maxWidth: 1200 }}>
      <div style={{ fontSize: 29 }} className="font-weight-bold mb-3">
        Connections
      </div>
      {iserror && (
        <Alert severity="error">
          {errorMessages.map((msg, i) => {
            return <div key={i}>{msg}</div>;
          })}
        </Alert>
      )}
      <ThemeProvider theme={theme}>
        <MaterialTable
          actions={[
            {
              tooltip: "Remove Selected Connections",
              icon: tableIcons.Delete,
              onClick: (evt, data) => handleMultipleRowDelete(data),
            },
          ]}
          title="Table"
          style={{
            boxShadow: "none",
            border: "none",
            background: "#f2f3f7",
            fontSize: 16,
            borderRadius: 11,
            // border: "10px solid #f2f3f7",
          }}
          columns={columns}
          data={connections}
          icons={tableIcons}
          options={{
            selection: true,
            headerStyle: {
              fontFamily: "Montserrat",
              background: "transparent",
              fontSize: 15,
              fontWeight: 700,
            },
            rowStyle: { border: "none", fontWeight: 500, background: "#E7EAF1" },
            actionsCellStyle: { border: "none" },
          }}
          editable={{
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                handleRowUpdate(newData, oldData, resolve);
              }),
            onRowAdd: (newData) =>
              new Promise((resolve) => {
                handleRowAdd(newData, resolve);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                handleRowDelete(oldData, resolve);
              }),
          }}
        />
      </ThemeProvider>
    </div>
  );
}
