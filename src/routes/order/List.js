import React from 'react'
import { Link } from 'dva/router'
import { Table, Modal } from 'antd'
import moment from 'moment'
import { DropOption } from '../../components'
import styles from './List.less'

moment.locale('zh-cn');
const confirm = Modal.confirm

const List = ({ queryStatus, onChangeItemPrice, onDeleteItem, onCloseItem, onDeliveryItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onChangeItemPrice(record)
    } else if(e.key === '2') {
      confirm({
        title: '确定要关闭订单 ' + record.order_no + ' ?',
        onOk () {
          onCloseItem(record.id)
        },
      })
    } else if (e.key === '3') {
      confirm({
        title: '确定要删除订单 ' + record.order_no + ' ?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    } else if (e.key === '4') {
      onDeliveryItem(record)
    }
  }

  const renderMenuByStatus = () => {
    let menu
    switch (queryStatus){
      case '1':
          menu = [{ key: '1', name: '订单改价' },{ key: '2', name: '关闭订单' },{ key: '3', name: '删除订单' }]
        break
      case '2':
          menu = [{ key: '4', name: '订单发货' }]
        break
    }
    return menu
  }

  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      render: (text, record) => <Link to={`/order/${record.id}`}>{text}</Link>
    }, {
      title: '用户',
      dataIndex: 'user.nickname',
    }, {
      title: '订单快照',
      dataIndex: 'snap_item',
      width: 300,
      render: (text, record) => {
        return <div><img width={32} src={record.snap_img} style={{verticalAlign: 'middle'}}/><span>{record.snap_name}</span></div>
      }
    }, {
      title: '收货地址',
      dataIndex: 'snap_address',
      render: (text) => {
        return <div>{`${text.province} ${text.city} ${text.country}`}<br/>{`${text.detail}`}<br/>{`${text.name}收 ${text.mobile}`}</div>
      }
    },{
      title: '总金额',
      dataIndex: 'total_price',
      render: (text, record) => {
        return record.discount_price ? <div><p style={{textDecoration: 'line-through', color: '#930000'}}>{text}</p><p>{record.discount_price}</p></div> : text
      }
    }, {
      title: '下单时间',
      dataIndex: 'create_time',
      render: (text, record) => <div>{ queryStatus == 1 ? moment(text, "YYYY-MM-DD hh:mm:ss").startOf('s').fromNow() : text }</div>
    }
  ]

  queryStatus !== '3' && columns.push({
    title: '操作',
    dataIndex: 'opteration',
    render: (text, record) => {
      let menuOptions = renderMenuByStatus()
      return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />
    }
  })

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
