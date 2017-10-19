import React from 'react'
import styles from './Footer.less'
import { config } from '../../utils'

const Footer = () => <div className={styles.footer}>
  <div>{config.footerText}</div> 
  <div>版本号：{config.version}</div>
</div>

export default Footer
