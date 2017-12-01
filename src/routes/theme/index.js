import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import ManagerModal from '../components/ManagerModal/'

const Theme = ({ location, dispatch, app, theme, loading }) => {
  const { productAll } = app
  const { list, pagination, currentItem, modalVisible, managerModalVisible, currentProductKeyList, modalType, selectedRowKeys, layoutVisible, layoutList } = theme
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    modalType: modalType,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`theme/${modalType}`],
    title: `${modalType === 'create' ? '创建主题' : '更新主题'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `theme/${modalType}`,
        payload: data,
      })
    },
    onError (data) {
      dispatch ({
        type: 'app/messageError',
        payload: data,
      })
    },
    onUploadSuccess(data) {
      dispatch({
        type: 'theme/uploadImageSuccess',
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'theme/hideModal',
      })
    },
  }

  const managerModalProps = {
    productAll,
    currentProductKeyList,
    visible: managerModalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['theme/setProductList'],
    title: `${currentItem.name}--商品管理`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'theme/setProductList',
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'theme/hideManagerModal',
      })
    }
  }

  const listProps = {
    dataSource: layoutVisible ? layoutList : list,
    loading: loading.effects['theme/query','theme/syncRank'],
    layoutVisible,
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
    onManagerItem (item) {
      dispatch({
        type: 'theme/showProductManager',
        payload: {
          currentItem: item,
        }
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'theme/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'theme/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    onPullShelvesItem (id, is_on) {
      dispatch({
        type: 'theme/pullItem',
        payload: {
          id,
          is_on,
        }
      })
    },
    onUpdateRank (layoutList) {
      dispatch({
        type: 'theme/updateState',
        payload: {
          layoutList
        }
      })
    },
    onSyncRank () {
      dispatch({
        type: 'theme/syncRank',
      })
    },
    onCancelRank () {
      dispatch({
        type: 'theme/hideLayout',
      })
    }
  }

  if (!layoutVisible) {
    listProps.rowSelection = {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'theme/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    }
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
        pathname: '/theme',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/theme',
      }))
    },
    onAdd () {
      dispatch({
        type: 'theme/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onShowLayout () {
      dispatch({
        type: 'theme/showLayout',
      })
    }
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'theme/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  return (
    <div className="content-inner">
      { !layoutVisible && <Filter {...filterProps} /> }
      {
         selectedRowKeys.length > 0 &&
           <Row style={{ marginBottom: 18, textAlign: 'right', fontSize: 13 }}>
             <Col>
               {`选择了 ${selectedRowKeys.length} 条主题 `}
               <Popconfirm title={'确定要取消选中的主题的精选推荐?'} placement="bottomRight" onConfirm={handleDeleteItems}>
                 <Button type="ghost" size="small" style={{ marginLeft: 8 }}>批量取消精选</Button>
               </Popconfirm>
               <Popconfirm title={'确定要推荐选中的主题为精选?'} placement="bottomRight" onConfirm={handleDeleteItems}>
                 <Button type="ghost" size="small" style={{ marginLeft: 8 }}>批量推荐精选</Button>
               </Popconfirm>
               <Popconfirm title={'确定要删除选中的主题?'} placement="bottomRight" onConfirm={handleDeleteItems}>
                 <Button type="danger" size="small" style={{ marginLeft: 8 }}>批量删除</Button>
               </Popconfirm>
             </Col>
           </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
      {managerModalVisible && <ManagerModal {...managerModalProps} />}
    </div>
  )
}

Theme.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ app, theme, loading }) => ({ app, theme, loading }))(Theme)
