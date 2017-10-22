import React from 'react'
import styles from './Footer.less'
import { config } from '../../utils'

const Footer = () => <div className={styles.footer}>
  <div>{`版本:${config.version}`} {config.footerText}</div>
</div>

export default Footer
