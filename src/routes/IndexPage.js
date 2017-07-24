import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './IndexPage.css';

function IndexPage({ children }) {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to dva!</h1>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li><Link to='/home'>home</Link></li>
        <li><Link to='/users'>users</Link></li>
      </ul>
      <div>{ children }</div>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
