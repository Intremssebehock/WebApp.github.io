import React from 'react';
import { Link } from 'react-router-dom';
import './NavPanel.css';

function NavPanel() {
  return (
    <div className="nav-panel">
      <nav className="nav-panel-container">
        <ul className="link-list">
          <li className="clicker-link link">
            <Link className="link-batton" to="/"></Link>
          </li>
          <li className="shop-link link">
            <Link className="link-batton" to="/shop"></Link>
          </li>
          <li className="rating-link link">
            <Link className="link-batton" to="/rating"></Link>
          </li>
          <li className="invitations-link link">
            <Link className="link-batton" to="/invitations"></Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavPanel;
