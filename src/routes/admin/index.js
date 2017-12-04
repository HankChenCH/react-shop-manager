import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import List from './List'
import Filter from './Filter'
import InfoModal from './Modal'
import AuthModal from './AuthModal'

const Admin = ({ location, dispatch, admin, role, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, authModalVisible, selectedRowKeys } = admin
  const roleList = role.list
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    modalType,
    maskClosable: false,
    confirmLoading: loading.effects['admin/update'],
    title: `${modalType === 'create' ? '创建管理员' : '更新管理员'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `admin/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'admin/hideModal',
      })
    },
  }

  const authModalProps = {
    item: currentItem,
    visible: authModalVisible,
    roleList: roleList.map( i => ({ key: i.id, ...i })),
    modalType,
    maskClosable: false,
    confirmLoading: loading.effects['admin/auth'],
    title: '管理员角色授权',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `admin/auth`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'admin/hideAuthModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['admin/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'admin/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'admin/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    onAuthItem (item) {
      dispatch({
        type: 'admin/showAuthModal',
        payload: {
          modalType: 'auth',
          currentItem: item
        }
      })
    },
    onAbleItem (id, status) {
      dispatch({
        type: 'admin/updateStatus',
        payload: {
          id,
          state: status ? 1 : 0
        }
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'admin/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/admin',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/admin',
      }))
    },
    onAdd () {
      dispatch({
        type: 'admin/showModal',
        payload: {
          modalType: 'create',
        },
      })
    }
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'admin/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  const handlePullOnItems = () => {
    dispatch({
      type: 'admin/multiUpdateStatus',
      payload: {
        ids: selectedRowKeys,
        state: '1'
      },
    })
  }

  const handlePullOffItems = () => {
    dispatch({
      type: 'admin/multiUpdateStatus',
      payload: {
        ids: selectedRowKeys,
        state: '0'
      },
    })
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      {
         selectedRowKeys.length > 0 &&
           <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
             <Col>
               {`选择了 ${selectedRowKeys.length} 个管理员 `}
               <Popconfirm title={'确定启用选中的商品？'} placement="bottomLeft" onConfirm={handlePullOnItems}>
                 <Button size="small" style={{ marginLeft: 8 }}>批量启用</Button>
               </Popconfirm>
               <Popconfirm title={'确定禁用选中的商品？'} placement="bottom" onConfirm={handlePullOffItems}>
                 <Button size="small" style={{ marginLeft: 8 }}>批量禁用</Button>
               </Popconfirm>
               <Popconfirm title={'确定要删除这些管理员吗?'} placement="left" onConfirm={handleDeleteItems}>
                 <Button type="danger" size="small" style={{ marginLeft: 8 }}>批量删除</Button>
               </Popconfirm>
             </Col>
           </Row>
      }
      <List {...listProps} />
      {modalVisible && <InfoModal {...modalProps} />}
      {authModalVisible && <AuthModal {...authModalProps} />}
    </div>
  )
}

Admin.propTypes = {
  admin: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ admin, role, loading }) => ({ admin, role, loading }))(Admin)
