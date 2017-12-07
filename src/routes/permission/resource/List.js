import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon } from 'antd'
import classnames from 'classnames'
import { AuthDropOption } from '../../../components/Auth'
import { Enum, env, getDropdownMenuOptions } from '../../../utils'
import styles from './List.less'

const confirm = Modal.confirm
const { EnumPermissionType, EnumResourceType } = Enum

const List = ({ onManagerItem, onDeleteItem, onEditItem, userAuth, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if(e.key === '2') {
      onEditItem(record)
    } else if (e.key === '3') {
      confirm({
        title: '确定要删除资源权限 ' + record.name + ' ?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const permissionType = []
  permissionType[EnumPermissionType.Public] = '公共'
  permissionType[EnumPermissionType.Protected] = '保护'
  permissionType[EnumPermissionType.Private] = '私人'

  const resourceType = []
  resourceType[EnumResourceType.View] = '视图'
  resourceType[EnumResourceType.Data] = '数据'

  const menuOptions = getDropdownMenuOptions([{ key: '2', name: '更新', auth: env.resourceUpdate }, { key: '3', name: '删除', auth: env.resourceRemove }], userAuth)

  const columns = [
    {
      title: '资源权限',
      dataIndex: 'resource',
      key: 'resource',
      render: (text, record) => <div><p>[{permissionType[record.permission_type]}/{resourceType[record.resource_type]}] - {record.name}</p><p>{record.description}</p></div>
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
