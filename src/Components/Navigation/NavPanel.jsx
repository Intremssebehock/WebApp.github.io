import React from 'react';
import { Link } from 'react-router-dom';
import './NavPanel.css';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage } from '../../Redux/Slices/PageSlice';

function NavPanel() {
  const currentPage = useSelector((state) => state.page.currentPage);
  const dispatch = useDispatch();

  return (
    <div className="nav-panel">
      <nav className="nav-panel-container">
        <ul className="link-list">
          <li
            onClick={() => dispatch(setCurrentPage('/'))}
            className={`clicker-link link ${currentPage === '/' ? 'active' : ''}`}>
            <Link className="link-batton" to="/"></Link>
          </li>
          <li
            onClick={() => dispatch(setCurrentPage('/shop'))}
            className={`shop-link link ${currentPage === '/shop' ? 'active' : ''}`}>
            <Link className="link-batton" to="/shop"></Link>
          </li>
          <li
            onClick={() => dispatch(setCurrentPage('/rating'))}
            className={`rating-link link ${currentPage === '/rating' ? 'active' : ''}`}>
            <Link className="link-batton" to="/rating"></Link>
          </li>
          <li
            onClick={() => dispatch(setCurrentPage('/invitations'))}
            className={`invitations-link link ${currentPage === '/invitations' ? 'active' : ''}`}>
            <Link className="link-batton" to="/invitations"></Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavPanel;
