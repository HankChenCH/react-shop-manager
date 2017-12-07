import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Switch, InputNumber, Row, Col } from 'antd'
import styles from './BuyNowTable.less'
import classnames from 'classnames'
import { AuthButton, AuthDropOption } from '../../../components/Auth'
import { env, getDropdownMenuOptions } from '../../../utils'
import { Link } from 'dva/router'

const confirm = Modal.confirm
const info = Modal.info

const BuyNowTable = ({ item, userAuth, onDeleteItem, onShowTicketList, ...tableProps }) => {

  const handleMenuClick = (record, e) => {
    if (e.key === '3') {
      onDeleteItem(record.id)
    } else if (e.key === '2') {
      onShowTicketList(record.id)
    } else if (e.key === '1') {
      info({
        title: '生成页面路径',
        content: (
          <div>
            {`pages/buy-now/buy-now?id=${item.id}&bid=${record.id}`}
          </div>
        )
      })
    }
  }

  const menuOptions = getDropdownMenuOptions([{ 
      key: '1',
      name: '页面路径',
      auth: env.productBuyNowWeapp
    }, { 
      key: '2',
      name: '出票列表',
      auth: env.productBuyNowTicket,
    }, { 
      key: '3',
      name: '删除',
      auth: env.productBuyNowRemove
  }], userAuth)

  const columns = document.body.clientWidth < 769 ? 
  [
    {
      title: '秒杀信息',
      dataIndex: 'batch_info',
      key: 'batch_info',
      render: (text, record) => <section>
        <Row gutter={8}>
          <Col span={24}>
            <label>秒杀批次：</label>
            <span>{record.batch_no}</span>
          </Col>
          <Col span={24}>
            <label>开始时间：</label>
            <span>{new Date().setTime(parseInt(record.start_time) * 1000)}</span>
          </Col>
          <Col span={24}>
            <label>结束时间：</label>
            <span>{new Date().setTime(parseInt(record.end_time) * 1000)}</span>
          </Col>
          <Col span={24}>
            <label>单价：</label>
            <span>{record.price}</span>
          </Col>
          <Col span={24}>
            <label>库存量：</label>
            <span>{record.stock}</span>
          </Col>
          <Col span={24}>
            <label>限购数：</label>
            <span>{record.limit_every}</span>
          </Col>
        </Row>
      </section>
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <AuthDropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />
      },
    }
  ] :  
  [
    {
      title: '秒杀批次',
      dataIndex: 'batch_no',
      key: 'batch_no',
    }, {
      title: '秒杀时段',
      dataIndex: 'buynow_time',
      key: 'buynow_time',
      render: (text,record) => {
        let start_time = new Date(),
        end_time = new Date()
        start_time.setTime(record.start_time * 1000)
        end_time.setTime(record.end_time * 1000)
        return <div>{start_time.format('yyyy-MM-dd HH:mm')} - {end_time.format('yyyy-MM-dd HH:mm')}</div>
      }
    }, {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (text) => <div>￥{text}</div>
    }, {
      title: '库存量',
      dataIndex: 'stock',
      key: 'stock',
      render: (text) => <div>余{text}件</div>
    }, {
      title: '限购数',
      dataIndex: 'limit_every',
      key: 'limit_every',
      render: (text) => <div>每人限{text}件</div>
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />
      },
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
        showHeader={false}
        columns={columns}
        simple
        pagination={false}
        rowKey={record => record.id}
      />
    </div>
  )
}

BuyNowTable.propTypes = {
  onDeleteItem: PropTypes.func,
}

export default BuyNowTable
