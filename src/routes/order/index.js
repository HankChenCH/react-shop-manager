import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs, Row, Col, Popconfirm, Button, Modal, Form } from 'antd'
import PriceModal from './PriceModal'
import DeliveryModal from './DeliveryModal'
import ModalForm from './ModalForm'
import { routerRedux } from 'dva/router'
import List from './List'
import { Enum } from '../../utils'

const TabPane = Tabs.TabPane

const { EnumOrderStatus } = Enum

const Index = ({ order, express, dispatch, loading, location }) => {
  const { list, pagination, selectedRowKeys, currentItem, modalType, modalVisible, priceModalVisible, deliveryModalVisible, queryStatus } = order
  const expresses = express.list
  const { query = {}, pathname } = location

  const listProps = {
    queryStatus: queryStatus || '1',
    pagination,
    express: expresses,
    dataSource: list,
    loading: loading.effects['order/query'],
    onChange (page) {
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onChangeItemPrice (item) {
      dispatch({
        type: 'order/showModal',
        payload: {
          currentItem: item,
          modalType: 'price',
        }
      })
    },
    onCloseItem (id) {
      dispatch({
        type: 'order/close',
        payload: id,
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'order/delete',
        payload: id
      })
    },
    onDeliveryItem (item) {
      dispatch({
        type: 'order/showModal',
        payload: {
          currentItem: item,
          modalType: 'delivery',
        }
      })
    },
    onIssueItem (item) {
      dispatch({
        type: 'order/showModal',
        payload: {
          currentItem: item,
          modalType: 'issue',
        }
      })
    },
  }
  
  if (queryStatus === '1') {
    listProps.rowSelection = {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'order/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    }
  }

  const modalProps = {
    item: currentItem,
    express: expresses,
    modalType,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`order/${modalType}Item`],
    title: modalType === 'price' ? '订单改价' : '订单发货',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `order/${modalType}Item`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'order/hideModal',
      })
    },
  }

  const handleCloseItems = () => {
    dispatch({
      type: 'order/multiClose',
      payload: {
        ids: selectedRowKeys,
      }
    })
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'order/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  const handleTabClick = (key) => {
    dispatch(routerRedux.push({
      pathname,
      query: {
        status: key,
      },
    }))
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={queryStatus || '1'} onTabClick={handleTabClick}>
        <TabPane tab="未付款" key={String(EnumOrderStatus.UNPAY)}>
          {
            selectedRowKeys.length > 0 &&
              <Row style={{ marginBottom: 16, textAlign: 'right', fontSize: 13 }}>
                <Col>
                  {`选中了 ${selectedRowKeys.length} 条订单 `}
                  <Popconfirm title={'确定关闭选中的订单？'} placement="bottomRight" onConfirm={handleCloseItems}>
                    <Button type="danger" size="small" style={{ marginLeft: 8 }}>批量关闭</Button>
                  </Popconfirm>
                  <Popconfirm title={'确定删除选中的订单？'} placement="bottomRight" onConfirm={handleDeleteItems}>
                    <Button type="danger" size="small" style={{ marginLeft: 8 }}>批量删除</Button>
                  </Popconfirm>
                </Col>
              </Row>
          }
          <List {...listProps} />
        </TabPane>
        <TabPane tab="待发货" key={String(EnumOrderStatus.UNDELIVERY)}>
          <List {...listProps} />
        </TabPane>
        <TabPane tab="已发货" key={String(EnumOrderStatus.DELIVERY)}>
          <List {...listProps} />
        </TabPane>
      </Tabs>
      {modalVisible && <ModalForm {...modalProps}/>}
    </div>
  )
}

Index.propTypes = {
  order: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ order, express, loading }) => ({ order, express, loading }))(Index)
