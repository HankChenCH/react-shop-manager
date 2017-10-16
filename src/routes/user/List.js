import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import moment from 'moment'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '微信昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text, record) => <Link to={`user/${record.id}`}><Avatar style={{ verticalAlign: 'middle', margin: '0 10px' }} src={record.extend.avatarUrl} alt='用户头像'/>{text}</Link>,
    }, {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (text, record) => <div>{ record.extend && record.extend.gender ? '男' : '女'}</div>
    }, {
      title: '所在地址',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => <div>{ record.extend ? record.extend.country + ' ' + record.extend.province + ' ' + record.extend.city : '-' }</div>
    }, {
      title: '注册时间',
      dataIndex: 'create_time',
      key: 'create_time',
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{ x: 900 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
