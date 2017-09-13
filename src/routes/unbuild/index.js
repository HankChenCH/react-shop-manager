import React from 'react'
import { Icon } from 'antd'
import styles from './index.less'

const UnBuild = () => <div className="content-inner">
  <div className={styles.notice}>
    <Icon type="tool" />
    <h1>页面施工中</h1>
  </div>
</div>

export default UnBuild