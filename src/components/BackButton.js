import ArrowBack from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";

const BackButton = ({ className = "" }) => {
  const history = useHistory();

  return (
    <ArrowBack
      fontSize="large"
      onClick={() => history.goBack()}
      className={`${className} cursor-pointer`}
    ></ArrowBack>
  );
};

export default BackButton;
