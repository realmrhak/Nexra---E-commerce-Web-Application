import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();

  // ❌ Hide on homepage
  if (location.pathname === "/") return null;

  const pathnames = location.pathname.split("/").filter(x => x);

  return (
    <div className="breadcrumbWrapper">
      <div className="container">
        <ul className="breadcrumb">
          <li>
            <Link to="/" className="homeLink">Home</Link>
          </li>

          {pathnames.map((value, index) => {
            const to = "/" + pathnames.slice(0, index + 1).join("/");

            return (
              <li key={to}>
                <span className="separator">›</span>
                <Link to={to} className="normalLink">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumbs;