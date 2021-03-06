import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { AuthDropOption } from '../../../components/Auth'
import { env, getDropdownMenuOptions } from '../../../utils'
import Mention from 'antd/lib/mention';

const confirm = Modal.confirm

const List = ({ onManagerItem, onDeleteItem, onEditItem, userAuth, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if(e.key === '2') {
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

  const menuOptions = getDropdownMenuOptions([{ key: '2', name: '更新', auth: env.roleUpdate }, { key: '3', name: '删除', auth: env.roleRemove }], userAuth)

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
        return <AuthDropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />
      },
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
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
