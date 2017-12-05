import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Switch } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ onAuthItem, onDeleteItem, onEditItem, onAbleItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onAuthItem(record)
    }else if (e.key === '2') {
      onEditItem(record)
    } else if (e.key === '3') {
      confirm({
        title: '确定要删除这个群组?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const handleSwitchChange = (record, checked) => {
    onAbleItem(record.id, checked)
  }

  const columns = [
    {
      title: '群组名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '群组描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '成员' }, { key: '2', name: '更新' }, { key: '3', name: '删除'}]} />
      },
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true})}
        columns={columns}
        simple
        onRowDoubleClick={onEditItem}
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
