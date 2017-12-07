import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Switch, Icon } from 'antd'
import classnames from 'classnames'
import { AuthDropOption, AuthSwtich } from '../../components/Auth'
import { Link } from 'dva/router'
import { env, getDropdownMenuOptions } from '../../utils'
import styles from './List.less'


const confirm = Modal.confirm

const List = ({ userAuth, onAuthItem, onDeleteItem, onEditItem, onAbleItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onAuthItem(record)
    }else if (e.key === '2') {
      onEditItem(record)
    } else if (e.key === '3') {
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

  const menuOptions = getDropdownMenuOptions([{ key: '1', name: '授权', auth: env.adminAuth }, { key: '2', name: '更新', auth: env.adminUpdate }, { key: '3', name: '删除', auth: env.adminRemove }], userAuth)

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
      dataIndex: 'profile.phone',
      key: 'phone',
    }, {
      title: '联系邮箱',
      dataIndex: 'profile.email',
      key: 'email',
    }, {
      title: '启用',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => <AuthSwtich auth={env.adminStatus} userAuth={userAuth} unAuthType="disabled" checked={text === '1' ? true : false} checkedChildren="禁用" unCheckedChildren="启用" onChange={checked => handleSwitchChange(record, checked)}/>,
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
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
        className={classnames({ [styles.table]: true})}
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
