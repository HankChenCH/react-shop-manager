import React from 'react'
import { Table } from 'antd'
import { DropOption } from '../../components'
import styles from './List.less'

const List = ({ queryStatus, ...tableProps }) => {
  const handleMenuClick = (e) => {
    console.log(queryStatus)
    console.log(e)
  }

  const renderMenuByStatus = () => {
    let menu
    switch (queryStatus){
      case '1':
          menu = [{ key: '1', name: '订单改价' },{ key: '2', name: '删除订单' }]
        break
      case '2':
          menu = [{ key: '3', name: '订单发货' }]
        break
      case '3':
          menu = [{ key: '4', name: '查看订单' }]
        break
    }
    return menu
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
        let menuOptions = renderMenuByStatus()
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />
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
