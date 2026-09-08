import React from "react";
import { Link } from "react-router-dom";
import { GiShoppingBag } from "react-icons/gi";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">
            <GiShoppingBag /> Ecommerce App
          </span>
          <p>All Right Reserved &copy; Abhishek</p>
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/policy">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
