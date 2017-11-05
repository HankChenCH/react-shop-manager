import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Row, Col } from 'antd'
import { Comments } from '../../dashboard/components'
import { menu } from '../../../utils'

class NoticeList extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    render() {
        const columns = [{
            title: '消息',
            dataIndex: 'msg',
            key: 'msg',
            render: (text, record) => {
                if(record.type === 'order') {
                    return (
                        <Row gutter={8}>
                            <Link to={`/order/${record.orderInfo.id}`}>
                            <Col span={4}>
                                <img src={record.orderInfo.snap_img} style={{maxWidth: '100%'}}/>
                            </Col>
                            <Col span={20}>
                                {text}
                            </Col>
                            </Link>
                        </Row>
                    )
                }
            }
        }]

        return (
            <Comments className={this.props.className} dataSource={this.props.dataSource} columns={columns} />
        )
    }
}

NoticeList.proptypes = {
    dataSource: PropTypes.array.isRequired,
}

export default NoticeList