import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Switch, InputNumber, Row, Col } from 'antd'
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
            <span>{record.start_time}</span>
          </Col>
          <Col span={24}>
            <label>结束时间：</label>
            <span>{record.end_time}</span>
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
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '删除' }]} />
      },
    }
  ] :  
  [
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
