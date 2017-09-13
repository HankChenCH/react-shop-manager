import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Switch } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, onAbleItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '确定要删除这个管理员?',
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
      title: '用户名',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
    }, {
      title: '真实姓名',
      dataIndex: 'true_name',
      key: 'true_name',
    }, {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '联系邮箱',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: '启用',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => <Switch checked={text === '1' ? true : false} checkedChildren="禁用" unCheckedChildren="启用" onChange={checked => handleSwitchChange(record, checked)}/>,
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '更新' }, { key: '2', name: '删除'}]} />
      },
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true})}
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
