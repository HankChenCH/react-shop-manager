import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import List from './List'
import Filter from './Filter'
import { arrayToTree } from '../../utils'

const Menu = ({ location, dispatch, menu, loading }) => {
    const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = menu
    const { pageSize } = pagination

    const treeList = arrayToTree(list, 'id', 'bpid')

    const listProps = {
        dataSource: treeList,
        loading: loading.effects['menu/query'],
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
                type: 'menu/showProductManager',
                payload: {
                    currentItem: item,
                }
            })
        },
        onDeleteItem (id) {
            dispatch({
                type: 'menu/delete',
                payload: id,
            })
        },
        onEditItem (item) {
            dispatch({
                type: 'menu/showModal',
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
                    type: 'menu/updateState',
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
                    pathname: '/menu',
                    query: {
                        field: fieldsValue.field,
                        keyword: fieldsValue.keyword,
                    },
            })) : dispatch(routerRedux.push({
                pathname: '/menu',
            }))
        },
        onAdd () {
            dispatch({
                type: 'menu/showModal',
                payload: {
                    modalType: 'create',
                },
            })
        }
    }

    return (
        <div className="content-inner">
            <Filter {...filterProps} />
            {
            selectedRowKeys.length > 0 &&
                <Row style={{ marginBottom: 18, textAlign: 'right', fontSize: 13 }}>
                <Col>
                    {`选择了 ${selectedRowKeys.length} 条菜单 `}
                    <Popconfirm title={'确定要删除选中的菜单?'} placement="bottomRight" onConfirm={handleDeleteItems}>
                    <Button type="danger" size="small" style={{ marginLeft: 8 }}>批量删除</Button>
                    </Popconfirm>
                </Col>
                </Row>
            }
            <List {...listProps} />
        </div>
    )
}

export default connect(({ menu, loading }) => ({ menu, loading }))(Menu)