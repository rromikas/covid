import ButtonBase from "@material-ui/core/ButtonBase";

const Button = ({
  children,
  primary = false,
  utilityButton = false,
  className,
  onClick = () => {},
}) => {
  return (
    <ButtonBase
      onClick={onClick}
      style={{ borderRadius: 7, minWidth: 150 }}
      className={`${
        utilityButton ? "bg-danger" : primary ? "bg-primary" : "bg-secondary"
      } px-4 py-2 text-white transition font-weight-bold ${className}`}
    >
      {children}
    </ButtonBase>
  );
};

export default Button;
