import React from 'react'
import { Link } from 'dva/router'
import { Table, Modal } from 'antd'
import moment from 'moment'
import { AuthDropOption } from '../../components/Auth'
import { Enum, env, getDropdownMenuOptions, getAuth } from '../../utils'
import styles from './List.less'

const confirm = Modal.confirm
const warning = Modal.warning
const { EnumOrderStatus } = Enum

const List = ({ userAuth, queryStatus, express, onChangeItemPrice, onDeleteItem, onCloseItem, onDeliveryItem, onIssueItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    switch (e.key) {
      case '1':
        onChangeItemPrice(record)
        break
      case '2':
        confirm({
          title: '确定要关闭订单 ' + record.order_no + ' ?',
          onOk () {
            onCloseItem(record.id)
          },
        })
        break
      case '3':
        confirm({
          title: '确定要删除订单 ' + record.order_no + ' ?',
          onOk () {
            onDeleteItem(record.id)
          },
        })
        break
      case '4': 
        express.length > 0 ?
          onDeliveryItem(record) :
          warning({
            title: '警告',
            content: '快递信息未定义，请先到快递管理处理！'
          })
        break
      case '5':
        onIssueItem(record)
        break
    }
  }

  const renderMenuByStatus = (record) => {
    const menu = []
    switch (queryStatus){
      case EnumOrderStatus.UNPAY:
          menu.push({ key: '1', name: '订单改价', auth: env.orderPrice }) 
          menu.push({ key: '2', name: '关闭订单', auth: env.orderClose }) 
          menu.push({ key: '3', name: '删除订单', auth: env.orderRemove }) 
        break
      case EnumOrderStatus.UNDELIVERY:
          if (record.type === '2') {
            menu.push({ key: '5', name: '订单出票', auth: env.orderIssue }) 
          } else {
            menu.push({ key: '4', name: '订单发货', auth: env.orderDelivery }) 
          }
        break
    }
    return menu
  }

  const canDetail = getAuth(env.orderDetail, userAuth)

  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      render: (text, record) => canDetail ? <Link to={`/order/${record.id}`}>{text}</Link> : text
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
      render: (text, record) => <div>{ queryStatus === EnumOrderStatus.UNPAY ? moment(text, "YYYY-MM-DD hh:mm:ss").startOf('s').fromNow() : text }</div>
    }
  ]

  queryStatus !== EnumOrderStatus.DELIVERY && columns.push({
    title: '操作',
    dataIndex: 'opteration',
    render: (text, record) => {
      const menuOptions = renderMenuByStatus(record)
      const authMenuOptions = getDropdownMenuOptions(menuOptions, userAuth)
      return <AuthDropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={authMenuOptions} />
    }
  })

  return (
    <div>
      <Table
        {...tableProps}
        columns={columns}
        simple
        className={styles.table}
        rowKey={record => record.id}
      />
    </div>
  )
}

export default List
