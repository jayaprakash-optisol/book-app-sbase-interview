import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
      <div>
        <div className="p-0 min-vh-100 side-bar-bg-color">
          <ul className="text-light list-unstyled">
            <li className="p-3 pe-lg-5 sidebar-element">
              <Link to="/" className="nav-link px-0 px-lg-2">
                {" "}
                <i className="bi bi-house" />
                <span className="px-lg-2 ms-1 d-none d-lg-inline">
                  Home
                </span>{" "}
              </Link>
            </li>

            <li className="p-3 pe-lg-5 sidebar-element">
              <Link to="/addBook" className="nav-link px-0 px-lg-2">
                {" "}
                <i className="bi bi-upload" />
                <span className="px-lg-2 ms-1 d-none d-lg-inline">
                  Upload
                </span>{" "}
              </Link>
            </li>
            <li className="p-3 pe-lg-5 sidebar-element">
              <Link to="/profile" className="nav-link px-0 px-lg-2">
                {" "}
                <i className="bi bi-book"></i>
                <span className="px-lg-2 ms-1 d-none d-lg-inline">
                  Book Shelf
                </span>{" "}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
