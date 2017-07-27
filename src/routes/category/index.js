import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Category = ({ location, dispatch, category, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys, createTempItem } = category
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    modalType: modalType,
    createTempItem: createTempItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['category/update'],
    title: `${modalType === 'create' ? '创建分类' : '更新分类'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      console.log(data)
      // dispatch({
      //   type: `category/${modalType}`,
      //   payload: data,
      // })
    },
    onUploadSuccess(data) {
      dispatch({
        type: 'category/uploadSuccess',
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'category/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['category/query'],
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
        type: 'category/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      console.log(item)
      dispatch({
        type: 'category/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'category/updateState',
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
        pathname: '/category',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/category',
      }))
    },
    onAdd () {
      dispatch({
        type: 'category/showModal',
        payload: {
          modalType: 'create',
        },
      })
    }
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'category/multiDelete',
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
           <Row style={{ marginBottom: 18, textAlign: 'right', fontSize: 13 }}>
             <Col>
               {`选择了 ${selectedRowKeys.length} 条分类 `}
               <Popconfirm title={'确定要删除选中的分类?'} placement="bottomRight" onConfirm={handleDeleteItems}>
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

Category.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ category, loading }) => ({ category, loading }))(Category)
