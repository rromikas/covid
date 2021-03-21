import SettingsIcon from "@material-ui/icons/Settings";
import ConnectionsIcon from "@material-ui/icons/SwapHoriz";
import Logo from "components/Logo";
import { useHistory } from "react-router-dom";

const menuItems = [
  { icon: SettingsIcon, title: "Configurations", path: "/configurations" },
  { icon: ConnectionsIcon, title: "Connections", path: "/connections" },
];

const SideMenu = ({ onClose = () => {} }) => {
  const history = useHistory();
  return (
    <div style={{ width: 285 }} className="p-4 bg-secondary text-white font-weight-bold h-100">
      <Logo className="mb-5"></Logo>
      {menuItems.map((x, i) => (
        <div
          key={`menu-item-${i}`}
          className="d-flex align-items-center mb-4 cursor-pointer"
          onClick={() => {
            history.push(x.path);
            onClose();
          }}
        >
          <x.icon className="mr-2"></x.icon>
          <div>{x.title}</div>
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
