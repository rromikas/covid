import ButtonBase from "@material-ui/core/ButtonBase";
import { useEffect, useState } from "react";

const Button = ({
  isLoading,
  primary = false,
  utilityButton = false,
  className,
  width = 200,
  successValue = "Success!",
  loadingValue = "Loading...",
  children,
  onClick = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    let timeout;
    if (isLoading) {
      setLoading(true);
      setValue(loadingValue);
    } else {
      if (loading) {
        setValue(successValue);
        setLoading(false);
        timeout = setTimeout(() => {
          setValue(children);
          setLoading(false);
        }, 1600);
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading]);

  useEffect(() => {
    setValue(children);
  }, [children]);

  return (
    <ButtonBase
      onClick={onClick}
      style={{ borderRadius: 7, width }}
      className={`${
        utilityButton ? "bg-danger" : primary ? "bg-primary" : "bg-secondary"
      } px-4 py-2 text-white transition font-weight-bold ${className}`}
    >
      {value}
    </ButtonBase>
  );
};

export default Button;
