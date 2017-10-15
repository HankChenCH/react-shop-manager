import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Table } from 'antd'
import { hasProp } from '../../../utils'
import styles from '../detail/BuyNowTable.less'

export default class TicketsTable extends React.Component
{
    constructor(props) {
        super(props)
    }

    render(){
        const { item, ...tableProps } = this.props
        const columns = [
            {
                title: '购买用户',
                dataIndex: 'user_name',
                key: 'user_name',
                render: (text,record) => <div>{record.order.user.nickname}</div>
            },
            {
                title: '票据信息',
                dataIndex: 'ticket_no',
                key: 'ticket_no',
                render: (text, record) => <div>
                    <ul>
                        {
                            record.order.snap_items.map( item => {
                                if (hasProp(item, 'ticket')) {
                                    return item.ticket.map( t => <li>{t}</li> )
                                }
                            })
                        }
                    </ul>
                </div> 
            }
        ]

        return (
            <Table
                {...tableProps}
                className={classnames({ [styles.table]: true })}
                bordered
                columns={columns}
                simple
                rowKey={record => record.id}
            />
        )
    }
}