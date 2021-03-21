import Logo from "components/Logo";
import MenuIcon from "@material-ui/icons/Menu";

const Navbar = ({ setMenuOpened }) => {
  return (
    <div className="d-flex d-lg-none align-items-center justify-content-between bg-secondary p-3">
      <Logo></Logo>
      <MenuIcon
        onClick={() => setMenuOpened((prev) => !prev)}
        className="text-white cursor-pointer"
      ></MenuIcon>
    </div>
  );
};

export default Navbar;
