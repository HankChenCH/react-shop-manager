import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Product = ({ location, dispatch, product, loading }) => {
  const { list, pagination, currentStep, currentItem, uploadTempItem, modalVisible, modalType, selectedRowKeys } = product
  const { pageSize } = pagination

  const modalProps = {
    item: Object.assign((modalType === 'create' ? {} : currentItem), uploadTempItem),
    modalType: modalType,
    visible: modalVisible,
    maskClosable: false,
    currentStep: currentStep,
    confirmLoading: loading.effects['product/${modalType}'],
    title: `${modalType === 'create' ? '新建商品' : '更新商品'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `product/${modalType}`,
        payload: data,
      })
    },
    onDetailsOk (data) {
      dispatch({
        type: 'product/updateDetail',
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'product/reloadList',
      })
      dispatch({
        type: 'product/hideModal',
      })
    },
    onUploadSuccess(data) {
      dispatch({
        type: 'product/uploadImageSuccess',
        payload: data
      })
    },
    onChangeStep (step) {
      dispatch({
        type: 'product/changeStep',
        payload: {
          step: step
        }
      })
    },
    onEditorStateChange (content) {
      dispatch({
        type: 'product/changeDetail',
        payload: content
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['product/query','product/updateCurrentItem'],
    pagination,
    location,
    currentItem,
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
        type: 'product/delete',
        payload: id,
      })
    },
    onEditItem (item, step) {
      dispatch({
        type: 'product/showEditModal',
        payload: {
          modalType: 'update',
          currentItem: item,
          currentStep: step - 1,
        },
      })
    },
    onPullShelvesItem (id, is_on){
      dispatch({
        type: 'product/pullItem',
        payload: {
          id: id,
          is_on: is_on
        }
      })
    },
    onShowEidt (item, e){
      dispatch({
        type: 'product/updateState',
        payload: {
          currentItem: item
        }
      })
    },
    onChangeItemStock (value) {
      dispatch({
        type: 'product/chageCurrentItem',
        payload: {
          stock: value
        }
      })
    },
    onChangeItemPrice (value) {
      dispatch({
        type: 'product/chageCurrentItem',
        payload: {
          price: value
        }
      })
    },
    onUpdateItem () {
      dispatch({
        type: 'product/updateCurrentItem',
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'product/updateState',
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
        pathname: '/product',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/product',
      }))
    },
    onAdd () {
      dispatch({
        type: 'product/showModal',
        payload: {
          modalType: 'create',
          uploadTempItem: {},
          currentItem: {},
          currentStep: 0,
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'product/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'product/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  const handlePullOnItems = () => {
    dispatch({
      type: 'product/multiOnOff',
      payload: {
        ids: selectedRowKeys,
        is_on: '1'
      },
    })
  }

  const handlePullOffItems = () => {
    dispatch({
      type: 'product/multiOnOff',
      payload: {
        ids: selectedRowKeys,
        is_on: '0'
      },
    })
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      {
         selectedRowKeys.length > 0 &&
           <Row style={{ marginBottom: 16, textAlign: 'right', fontSize: 13 }}>
             <Col>
               {`选中了 ${selectedRowKeys.length} 件商品 `}
               <Popconfirm title={'确定上架选中的商品？'} placement="bottomLeft" onConfirm={handlePullOnItems}>
                 <Button size="small" style={{ marginLeft: 8 }}>批量上架</Button>
               </Popconfirm>
               <Popconfirm title={'确定下架选中的商品？'} placement="bottom" onConfirm={handlePullOffItems}>
                 <Button size="small" style={{ marginLeft: 8 }}>批量下架</Button>
               </Popconfirm>
               <Popconfirm title={'确定删除选中的商品？'} placement="bottomRight" onConfirm={handleDeleteItems}>
                 <Button type="danger" size="small" style={{ marginLeft: 8 }}>批量删除</Button>
               </Popconfirm>
             </Col>
           </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Product.propTypes = {
  product: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ product, loading }) => ({ product, loading }))(Product)
