import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Switch, InputNumber } from 'antd'
import styles from './BuyNowTable.less'
import classnames from 'classnames'
import { DropOption } from '../../../components'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const BuyNowTable = ({ onDeleteItem, ...tableProps }) => {

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onDeleteItem(record.id)
    }
  }

  const columns = [
    {
      title: '秒杀批次',
      dataIndex: 'batch_no',
      key: 'batch_no',
    }, {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
    }, {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
    }, {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '库存量',
      dataIndex: 'stock',
      key: 'stock',
    }, {
      title: '限购数',
      dataIndex: 'limit_every',
      key: 'limit_every'
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '删除' }]} />
      },
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

BuyNowTable.propTypes = {
  onDeleteItem: PropTypes.func,
}

export default BuyNowTable
