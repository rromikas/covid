import { useHistory } from "react-router-dom";
import LogoImage from "assets/logo.svg";

const Logo = ({ className = "" }) => {
  const history = useHistory();
  return (
    <div
      className={
        "font-weight-bold d-flex align-items-center cursor-pointer text-white " + className
      }
      style={{ fontSize: 20 }}
      onClick={() => history.push("/")}
    >
      <img className="mr-2" src={LogoImage}></img>
      <div>
        <div style={{ fontSize: 20, lineHeight: "26px" }}>Anomaly</div>
        <div style={{ fontSize: 12, color: "#A098FF" }}>DETECTOR</div>
      </div>
    </div>
  );
};

export default Logo;
