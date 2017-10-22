import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Table } from 'antd'
import { hasProp, Enum } from '../../../utils'
import styles from '../detail/BuyNowTable.less'

const { EnumOrderStatus } = Enum

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
                dataIndex: 'user',
                key: 'user',
            },
            {
                title: '票据信息',
                dataIndex: 'ticket_no',
                key: 'ticket_no',
                render: (text, record) => {
                    const status = record.orderStatus.toString()
                    if (status === EnumOrderStatus.UNPAY) {
                        return <div>未付款</div>
                    } else if (status === EnumOrderStatus.UNDELIVERY) {
                        return <div>未发货</div>
                    } else {
                        return (
                            <div>
                                <ul>
                                    {
                                        record.tickets.map( (item, key) => {
                                            if (hasProp(item, 'ticket')) {
                                                return item.ticket.map( t => <li key={key}>{t}</li> )
                                            }
                                        })
                                    }
                                </ul>
                            </div>
                        )
                    }
                }
            }
        ]

        return (
            <Table
                {...tableProps}
                dataSource={item}
                className={classnames({ [styles.table]: true })}
                pagination={false}
                columns={columns}
                simple
                rowKey={record => record.id}
            />
        )
    }
}