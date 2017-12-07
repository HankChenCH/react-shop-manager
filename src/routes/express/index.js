import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { AuthButton } from '../../components/Auth'
import { env } from '../../utils'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Express = ({ location, dispatch, app, express, loading }) => {
  const { userAuth } = app
  const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = express
  const { pageSize } = pagination

  const modalProps = {
    item: Object.assign((modalType === 'create' ? {} : currentItem)),
    modalType: modalType,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`express/${modalType}`],
    title: `${modalType === 'create' ? '创建快递公司' : '更新快递公司'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `express/${modalType}`,
        payload: data,
      })
    },
    onError (data) {
      dispatch({
        type: `app/messageError`,
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'express/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['express/query'],
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
        type: 'express/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'express/showModal',
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
          type: 'express/updateState',
          payload: {
            selectedRowKeys: keys,
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
        pathname: '/express',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/express',
      }))
    },
    onAdd () {
      dispatch({
        type: 'express/showModal',
        payload: {
          modalType: 'create',
        },
      })
    }
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'express/multiDelete',
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
               {`选择了 ${selectedRowKeys.length} 条快递公司 `}
               <Popconfirm title={'确定要删除选中的快递公司?'} placement="bottomRight" onConfirm={handleDeleteItems}>
                  <AuthButton auth={env.expressRemove} userAuth={userAuth} type="danger" size="small" style={{ marginLeft: 8 }}>批量删除</AuthButton>
               </Popconfirm>
             </Col>
           </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Express.propTypes = {
  app: PropTypes.object,
  express: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ app, express, loading }) => ({ app, express, loading }))(Express)
