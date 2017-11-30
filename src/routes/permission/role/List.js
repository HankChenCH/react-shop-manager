import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { DropOption } from '../../../components'

const confirm = Modal.confirm

const List = ({ onManagerItem, onDeleteItem, onEditItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onManagerItem(record)
    } else if(e.key === '2') {
      onEditItem(record)
    } else if (e.key === '3') {
      confirm({
        title: '确定要删除角色 ' + record.name + ' ?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '授权' }, { key: '2', name: '更新' }, { key: '3', name: '删除'}]} />
      },
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
        pagination={false}
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
}

export default List
