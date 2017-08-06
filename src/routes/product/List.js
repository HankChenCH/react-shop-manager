import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Switch, InputNumber } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ currentItem, onShowEidt, onChangeItemStock, onUpdateItem, onChangeItemPrice, onDeleteItem, onEditItem, onPullShelvesItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      onEditItem(record)
    } else if (e.key === '3') {
      onEditItem(record)
    } else if (e.key === '4') {
      confirm({
        title: '确定要删除商品 ' + record.name + ' ?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const handleSwitchChange = (record, checked) => {
    onPullShelvesItem(record.id, checked)
  }

  const handleDbClick = (record, e) => {
    onShowEidt(record, e)
  }

  const handleStockChange = (value) => {
    onChangeItemStock(value)
  }

  const handlePriceChange = (value) => {
    onChangeItemPrice(value)
  }

  const handleUpdate = (e) => {
    if (e.type === 'blur' || e.which === 13) {
      onUpdateItem()
    }
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
      title: '商品摘要',
      dataIndex: 'summary',
      key: 'summary',
    }, {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => {
        return currentItem.id === record.id ? 
        <InputNumber
          style={{width: '65px'}} 
          defaultValue={text} 
          min={0} 
          max={999} 
          step={0.01}
          size='small'
          onChange={handlePriceChange} 
          onBlur={handleUpdate}
          onKeyDown={handleUpdate}/> :
        <span onDoubleClick={e => handleDbClick(record, e)}>{text}</span>  
      }
    }, {
      title: '库存量',
      dataIndex: 'stock',
      key: 'stock',
      render: (text, record) => {
        return currentItem.id === record.id ? 
        <InputNumber
          style={{width: '65px'}} 
          defaultValue={text} 
          min={0} 
          max={999} 
          formatter={value => `${value}件`} 
          size='small'
          onChange={handleStockChange} 
          onBlur={handleUpdate}
          onKeyDown={handleUpdate}/> :
        <span onDoubleClick={e => handleDbClick(record, e)}>{text}</span>  
      }
    }, {
      title: '上架',
      dataIndex: 'is_on',
      key: 'is_on',
      render: (text, record) => <Switch checked={text === '1' ? true : false} checkedChildren="Off" unCheckedChildren="On" onChange={checked => handleSwitchChange(record, checked)}/>,
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'createTime',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '更新基础信息' }, { key: '2', name: '更新详情图片' }, { key: '3', name: '更新规格参数'}, { key: '4', name: '删除' }]} />
      },
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
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
  onShowEidt: PropTypes.func,
  onChangeItemStock: PropTypes.func,
  onChangeItemPrice: PropTypes.func,
  onUpdateItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onPullShelvesItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
