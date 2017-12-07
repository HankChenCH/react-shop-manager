import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { AuthButton } from '../../components/Auth'
import { env } from '../../utils'
import List from './List'
import Filter from './Filter'
import InfoModal from './Modal'
import AllotModal from './AllotModal'

const Group = ({ location, dispatch, app, admin, group, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, allotModalVisible, selectedRowKeys } = group
  const adminList = admin.list
  const { userAuth } = app
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    modalType,
    maskClosable: false,
    confirmLoading: loading.effects['group/update'],
    title: `${modalType === 'create' ? '创建群组' : '更新群组'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `group/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'group/hideModal',
      })
    },
  }

  const allotModalProps = {
    item: currentItem,
    visible: allotModalVisible,
    adminList: adminList.map( i => ({ key: i.id, ...i })) || [],
    modalType,
    maskClosable: false,
    confirmLoading: loading.effects['group/allot'],
    title: '群组成员分配',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `group/allot`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'group/hideAllotModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['group/query'],
    pagination,
    location,
    userAuth,
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
        type: 'group/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'group/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    onAuthItem (item) {
      dispatch({
        type: 'group/showAllotModal',
        payload: {
          modalType: 'allot',
          currentItem: item
        }
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'group/updateState',
          payload: {
            selectedRowKeys: selectedRowKeys,
          },
        })
      },
    },
  }

  const filterProps = {
    userAuth,
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
        pathname: '/group',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/group',
      }))
    },
    onAdd () {
      dispatch({
        type: 'group/showModal',
        payload: {
          modalType: 'create',
        },
      })
    }
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'group/multiDelete',
      payload: {
        ids: selectedRowKeys,
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
               {`选择了 ${selectedRowKeys.length} 个群组 `}
               <Popconfirm title={'确定要删除这些群组吗?'} placement="left" onConfirm={handleDeleteItems}>
                 <AuthButton auth={env.groupRemove} userAuth={userAuth} type="danger" size="small" style={{ marginLeft: 8 }}>批量删除</AuthButton>
               </Popconfirm>
             </Col>
           </Row>
      }
      <List {...listProps} />
      {modalVisible && <InfoModal {...modalProps} />}
      {allotModalVisible && <AllotModal {...allotModalProps} />}
    </div>
  )
}

Group.propTypes = {
  app: PropTypes.object,
  admin: PropTypes.object,
  group: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ app, admin, group, loading }) => ({ app, admin, group, loading }))(Group)
