import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs, Row, Col, Popconfirm, Button } from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'

const TabPane = Tabs.TabPane

const EnumPostStatus = {
  UNPAY: 1,
  UNDELIVERY: 2,
  DELIVERY: 3,
}


const Index = ({ order, dispatch, loading, location }) => {
  const { list, pagination, selectedRowKeys } = order
  const { query = {}, pathname } = location

  const listProps = {
    queryStatus: query.status || '1',
    pagination,
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
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'order/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
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

  return (<div className="content-inner">
    <Tabs activeKey={query.status || '1'} onTabClick={handleTabClick}>
      <TabPane tab="未付款" key={String(EnumPostStatus.UNPAY)}>
        {
           selectedRowKeys.length > 0 &&
             <Row style={{ marginBottom: 16, textAlign: 'right', fontSize: 13 }}>
               <Col>
                 {`选中了 ${selectedRowKeys.length} 条订单 `}
                 <Popconfirm title={'确定删除选中的订单？'} placement="bottomRight" onConfirm={handleDeleteItems}>
                   <Button type="danger" size="small" style={{ marginLeft: 8 }}>批量删除</Button>
                 </Popconfirm>
               </Col>
             </Row>
        }
        <List {...listProps} />
      </TabPane>
      <TabPane tab="未发货" key={String(EnumPostStatus.UNDELIVERY)}>
        <List {...listProps} />
      </TabPane>
      <TabPane tab="已发货" key={String(EnumPostStatus.DELIVERY)}>
        <List {...listProps} />
      </TabPane>
    </Tabs>
  </div>)
}

Index.propTypes = {
  order: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ order, loading }) => ({ order, loading }))(Index)
