import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import { Link } from 'dva/router';

function IndexPage() {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yoo! Welcome to about page!</h1>
      <div className={styles.welcome} />
      <Link href="/">back</Link>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
