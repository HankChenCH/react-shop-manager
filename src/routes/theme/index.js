import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import ManagerModal from '../components/ManagerModal'

const Theme = ({ location, dispatch, theme, loading }) => {
  const { list, pagination, currentItem, modalVisible, managerModalVisible, productList, currentProductKeyList, modalType, selectedRowKeys, uploadTempItem } = theme
  const { pageSize } = pagination

  const modalProps = {
    item: Object.assign((modalType === 'create' ? {} : currentItem), uploadTempItem),
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
    productList,
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
    },
    onChangeProductItem (nextTargetKeys) {
      dispatch({
        type: 'theme/updateState',
        payload: {
          currentProductKeyList: nextTargetKeys
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['theme/query'],
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
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'theme/updateState',
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
      <Filter {...filterProps} />
      {
         selectedRowKeys.length > 0 &&
           <Row style={{ marginBottom: 18, textAlign: 'right', fontSize: 13 }}>
             <Col>
               {`选择了 ${selectedRowKeys.length} 条主题 `}
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

export default connect(({ theme, loading }) => ({ theme, loading }))(Theme)
