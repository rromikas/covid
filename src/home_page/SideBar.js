import React, { Component } from "react";
import { scaleDown as Menu } from "react-burger-menu";

export default function SideBar(props) {
  var styles = {
    bmBurgerButton: {
      position: "fixed",
      width: "36px",
      height: "30px",
      left: "36px",
      top: "36px"
    },
    bmBurgerBars: {
      background: "#373a47"
    },
    bmBurgerBarsHover: {
      background: "#a90000"
    },
    bmCrossButton: {
      height: "24px",
      width: "24px"
    },
    bmCross: {
      background: "#bdc3c7"
    },
    bmMenuWrap: {
      position: "fixed",
      height: "100%"
    },
    bmMenu: {
      background: "#373a47",
      padding: "2.5em 1.5em 0",
      fontSize: "1.15em"
    },
    bmMorphShape: {
      fill: "#373a47"
    },
    bmItemList: {
      color: "#b8b7ad",
      padding: "0.8em"
    },
    bmItem: {
      display: "block",
      color: "#b8b7ad",
      padding: "0.8em",
      textDecoration: "none",
      fontSize: "1.15em"
    },
    bmOverlay: {
      background: "rgba(0, 0, 0, 0.3)"
    }
  };

  const { items, set_value } = props;

  function handleClick(e, item) {
    e.preventDefault();
    set_value(item);
  }

  var sideBar = items.map((item, index) => (
    <a href={"#" + item["configurationId"]} onClick={e => handleClick(e, item["configurationId"])}>
      <span>{item["configurationName"]}</span>
    </a>
  ));

  return <Menu styles={styles}>{sideBar}</Menu>;
}
