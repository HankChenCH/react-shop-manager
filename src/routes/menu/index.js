import React from 'react'
import { connect } from 'dva'

const Menu = ({ loading }) => {

    return (
        <div className="content-inner">
        </div>
    )
}

export default connect(({ loading }) => ({ loading }))(Menu)