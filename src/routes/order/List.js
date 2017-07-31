import React from 'react'
import { Table } from 'antd'
import { DropOption } from '../../components'
import styles from './List.less'

const List = ({ ...tableProps }) => {
  const handleMenuClick = (e) => {
    console.log(e)
  }

  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_no',
    }, {
      title: '用户',
      dataIndex: 'user.nickname',
    }, {
      title: '订单快照',
      dataIndex: 'snap_item',
      render: (text, record) => {
        return <div><img width={32} src={record.snap_img}/><span>{record.snap_name}</span></div>
      }
    }, {
      title: '总金额',
      dataIndex: 'total_price'
    }, {
      title: '下单时间',
      dataIndex: 'create_time',
    }, {
      title: '操作',
      dataIndex: 'opteration',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '商品管理' }, { key: '2', name: '更新' }, { key: '3', name: '删除'}]} />
      }
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 900 }}
        columns={columns}
        simple
        className={styles.table}
        rowKey={record => record.id}
      />
    </div>
  )
}

export default List
