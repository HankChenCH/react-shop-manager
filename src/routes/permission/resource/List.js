import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Icon } from 'antd'
import classnames from 'classnames'
import { DropOption } from '../../../components'
import { Enum } from '../../../utils'
import styles from './List.less'

const confirm = Modal.confirm
const { EnumPermissionType, EnumResourceType } = Enum

const List = ({ onManagerItem, onDeleteItem, onEditItem, ...tableProps }) => {
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

  const premissionType = []
  premissionType[EnumPermissionType.Public] = '公共资源'
  premissionType[EnumPermissionType.Protected] = '保护资源'
  premissionType[EnumPermissionType.Private] = '私人资源'

  const resourceType = []
  resourceType[EnumResourceType.View] = '视图'
  resourceType[EnumResourceType.Data] = '数据'

  const columns = [
    {
      title: '资源权限名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '资源权限描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '资源权限类型',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => <div><p>{resourceType[record.resource_ype]}</p><p>{premissionType[record.premission_type]}</p></div>
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '2', name: '更新' }, { key: '3', name: '删除'}]} />
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
