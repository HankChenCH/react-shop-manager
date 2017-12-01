import React from 'react'
import { Icon } from 'antd'
import styles from './Notice.less'

export default class Notice extends React.Component
{
    constructor() {
        super()
    }

    render() {
        const { wrapperStyles, noticeStyles } = this.props
        
        return (
            <div className={styles.notice_container} style={wrapperStyles}>
                <p className={styles.notice_text} style={noticeStyles}>
                    <Icon type="exclamation-circle-o" />
                    {this.props.children}
                </p>
            </div>
        )
    }
}