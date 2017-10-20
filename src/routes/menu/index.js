import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import List from './List'
import Filter from './Filter'
import InfoModal from './Modal'
import { arrayToTree } from '../../utils'

const Menu = ({ location, dispatch, menu, loading }) => {
    const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = menu
    const { pageSize } = pagination
    
    const treeList = arrayToTree(list, 'id', 'bpid')

    const modalProps = {
        item: (modalType === 'create' ? {} : currentItem),
        menuList: list,
        modalType: modalType,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects[`menu/${modalType}`],
        title: `${modalType === 'create' ? '创建菜单' : '更新菜单'}`,
        wrapClassName: 'vertical-center-modal',
        onOk (data) {
          dispatch({
            type: `menu/${modalType}`,
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
            type: 'menu/hideModal',
          })
        },
    }

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
        onAdd () {
            dispatch({
                type: 'menu/showModal',
                payload: {
                    modalType: 'create',
                },
            })
        }
    }

    const handleDeleteItems = () => {
        dispatch({
          type: 'menu/multiDelete',
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
                    {`选择了 ${selectedRowKeys.length} 条菜单 `}
                    <Popconfirm title={'确定要删除选中的菜单?'} placement="bottomRight" onConfirm={handleDeleteItems}>
                    <Button type="danger" size="small" style={{ marginLeft: 8 }}>批量删除</Button>
                    </Popconfirm>
                </Col>
                </Row>
            }
            <List {...listProps} />
            {modalVisible && <InfoModal {...modalProps} /> }
        </div>
    )
}

export default connect(({ menu, loading }) => ({ menu, loading }))(Menu)