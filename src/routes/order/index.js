import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'

const TabPane = Tabs.TabPane

const EnumPostStatus = {
  DELIVERY: 1,
  UNDELIVERY: 2,
}


const Index = ({ order, dispatch, loading, location }) => {
  const { list, pagination } = order
  const { query = {}, pathname } = location

  const listProps = {
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
    <Tabs activeKey={query.status === String(EnumPostStatus.DELIVERY) ? String(EnumPostStatus.DELIVERY) : String(EnumPostStatus.UNDELIVERY)} onTabClick={handleTabClick}>
      <TabPane tab="未发货" key={String(EnumPostStatus.UNDELIVERY)}>
        <List {...listProps} />
      </TabPane>
      <TabPane tab="以发货" key={String(EnumPostStatus.DELIVERY)}>
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
