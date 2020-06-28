import React from "react";
import {Link} from 'react-router-dom'
import styles from './nav.module.css'
import logo from '../../logo.png'


export default function NavBar() {
  return (
    <nav>
      <div className={styles.nav}>
        <ul>
          <li><Link to='/top'><img width={22} height={22} src={logo} alt="logo"/></Link></li>
          <li><Link to='/top'>Top</Link></li>
          <li><Link to='/new'>New</Link></li>
          <li><Link to='/show'>Show</Link></li>
          <li><Link to='/ask'>Ask</Link></li>
          <li><Link to='/jobs'>Jobs</Link></li>
        </ul>
        <span style={{marginLeft:'auto'}}>Built with React</span>
      </div>
    </nav>
  );
}
