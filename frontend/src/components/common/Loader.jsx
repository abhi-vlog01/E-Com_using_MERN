import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="page-loader">
      <div className="page-loader-box">
        <span className="page-loader-dot" />
        <span>{text}</span>
      </div>
    </div>
  );
};

export default Loader;
