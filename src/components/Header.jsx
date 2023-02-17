import React from "react";
import logo from "../assets/img/one-inc-logo.jpg";
export const Header = () => {
  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{ background: "#256ba2" }}
      >
        <div className="container">
          <a className="navbar-brand" href="#">
            <img
              src={logo}
              alt="Logo"
              width="150"
              height="50"
              className="d-inline-block align-text-top"
            />
          </a>
        </div>
      </nav>
    </>
  );
};
