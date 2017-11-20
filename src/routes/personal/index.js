import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Card } from 'antd'
const Personal = ({
    app,
    dispatch,
}) => {

    return (
        <section>
            <Card>
                <h3>基础设置</h3>
                <section>
                    
                </section>
            </Card>
            <Card style={{ marginTop: 20 }}>
                <h3>通知设置</h3>
                <section>
                    
                </section>
            </Card>
        </section>
    )
}

Personal.proptypes = {

}

export default connect(({}) => ({}))(Personal)

