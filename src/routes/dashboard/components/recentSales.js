import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import moment from 'moment'
import styles from './recentSales.less'
import { color } from '../../../utils'

const status = {
  1: {
    color: color.blue,
    text: '未付款',
  },
  2: {
    color: color.yellow,
    text: '待发货',
  },
  3: {
    color: color.green,
    text: '已发货',
  }
}

function RecentSales ({ data }) {
  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_no',
    }, {
      title: '状态',
      dataIndex: 'status',
      render: text => <Tag color={status[text].color}>{status[text].text}</Tag>,
    }, {
      title: '下单时间',
      dataIndex: 'create_time',
      render: text => moment(text, "YYYY-MM-DD hh:mm:ss").startOf('s').fromNow(),
    }, {
      title: '订单价格',
      dataIndex: 'total_price',
      render: (text, it) => <span style={{ color: status[it.status].color }}>${text}</span>,
    },
  ]
  return (
    <div className={styles.recentsales}>
      <Table pagination={false} columns={columns} rowKey={(record, key) => key} dataSource={data.filter((item, key) => key < 5)} />
    </div>
  )
}

RecentSales.propTypes = {
  data: PropTypes.array,
}

export default RecentSales
