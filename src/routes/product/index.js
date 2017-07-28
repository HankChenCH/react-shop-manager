import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Product = ({ location, dispatch, product, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys } = product
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['product/update'],
    title: `${modalType === 'create' ? '新建产品' : '更新产品'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `product/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'product/hideModal',
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
    onEditItem (item) {
      dispatch({
        type: 'product/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    onPullShelvesItem (id, is_on){
      if (is_on) {
        dispatch({
          type: 'product/pullOn',
          payload: {
            id: id,
            is_on: 1
          }
        })
      } else {
        dispatch({
          type: 'product/pullOff',
          payload: {
            id: id,
            is_on: 0
          }
        })
      }
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
    isMotion,
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
      type: 'product/multiOn',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  const handlePullOffItems = () => {
    dispatch({
      type: 'product/multiOff',
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
