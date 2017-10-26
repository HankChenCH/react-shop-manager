import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import classnames from 'classnames'
import { Link } from 'dva/router'
import ReactDragListView from 'react-drag-listview';
import { DropOption } from '../../components'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onManagerItem, onDeleteItem, onEditItem, onUpdateRank, location, layoutVisible, onSyncRank, onCancelRank, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onManagerItem(record)
    } else if(e.key === '2') {
      onEditItem(record)
    } else if (e.key === '3') {
      confirm({
        title: '确定要删除主题 ' + record.name + ' ?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = !layoutVisible ? [
    {
      title: '主题名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '头图',
      dataIndex: 'head_img.url',
      key: 'head_img',
      render: (text, record) => {
        return <img style={{maxWidth: '130px'}} src={text}/>
      }
    }, {
      title: '主题描述',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => {
        return text == null ? '-' : text;
      }
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '商品管理' }, { key: '2', name: '更新' }, { key: '3', name: '删除'}]} />
      },
    },
  ] : [
    {
      title: '主题(长按拖拽排序)',
      dataIndex: 'theme',
      key: 'theme',
      render: (text, record) => 
        <section className="drag-handle">
          <img style={{maxWidth: '130px'}} src={record.head_img.url}/>
          <p>{record.name}</p>
          <p>{record.description}</p>
        </section>
    },
  ]

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
        const { dataSource } = { ...tableProps }
        const item = dataSource.splice(fromIndex, 1)[0]
        dataSource.splice(toIndex, 0, item)
        onUpdateRank(dataSource)
    },
    handleSelector: ".drag-handle"
  }

  const { loading } = { ...tableProps }

  return (
    <div style={{ textAlign: 'right' }}>
      <ReactDragListView {...dragProps}>
          <Table
            {...tableProps}
            className={classnames({ [styles.table]: true })}
            columns={columns}
            simple
            size="small" 
            pagination={!layoutVisible}
            rowKey={record => record.id}
          />
      </ReactDragListView>
      {
        layoutVisible && 
        <div>
          <Button className={classnames([styles.sync_btn, styles.margin_right])} size="large" onClick={onCancelRank}>取消</Button>
          <Button className={styles.sync_btn} size="large" type="primary" onClick={onSyncRank} loading={loading}>确定并同步到小程序</Button>
        </div>
      }
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
