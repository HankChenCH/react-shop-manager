import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Switch } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, onPullShelvesItem, isMotion, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '2') {
      onEditItem(record)
    } else if (e.key === '3') {
      confirm({
        title: '确定要删除商品 ' + record.name + ' ?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const hanldeSwitchChange = (record, e) => {
    onPullShelvesItem(record, e)
  }

  const columns = [
    {
      title: '商品图',
      dataIndex: 'main_img_url',
      key: 'productImage',
      width: 64,
      className: styles.avatar,
      render: (text) => <img alt={'productImage'} width={32} src={text} />,
    }, {
      title: '商品名',
      dataIndex: 'name',
      key: 'title',
      render: (text, record) => <Link to={`product/${record.id}`}>{text}</Link>,
    }, {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '库存量',
      dataIndex: 'stock',
      key: 'stock',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: '上架',
      dataIndex: 'isOn',
      key: 'isOn',
      render: (text, record) => <Switch checked={text ? true : false} checkedChildren="下架" unCheckedChildren="上架" onChange={e => hanldeSwitchChange(record, e)}/>,
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '更新库存' }, { key: '2', name: '更新信息' }, { key: '3', name: '删除' }]} />
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = body => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

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
        getBodyWrapper={getBodyWrapper}
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
