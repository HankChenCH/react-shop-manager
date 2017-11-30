import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Card } from 'antd'
import BaseForm from '../components/AdminBaseForm'
import NoticeSettingForm from './components/NoticeSettingForm'
import { loadavg } from 'os';


const Personal = ({
    admin,
    websocket,
    loading,
    dispatch,
}) => {
    const { currentItem } = admin
    const { notificationOn, notificationPlacement, notificationDuration } = websocket

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 14,
                offset: 6,
            },
        },
    };

    const baseFormProps = {
        item: currentItem,
        modalType: 'update',
        buttonLoading: loading.effects['admin/update'],
        formItemLayout,
        tailFormItemLayout,
        onSave(data) {
            dispatch({ 
                type: 'admin/update', 
                payload: data 
            })
        }
    }

    const noticeFormProps = {
        item: {
            notificationOn,
            notificationPlacement,
            notificationDuration
        },
        buttonLoading: loading.effects['websocket/setNotificationConfig'],
        formItemLayout,
        tailFormItemLayout,
        onSave(data) {
            dispatch({
                type: 'websocket/setNotificationConfig',
                payload: data
            })
        }
    }

    return (
        <section>
            <Card>
                <h3>基础信息设置</h3>
                <section>
                    <BaseForm {...baseFormProps}/>
                </section>
            </Card>
            <Card style={{ marginTop: 20 }}>
                <h3>消息通知设置</h3>
                <section>
                    <NoticeSettingForm {...noticeFormProps} />
                </section>
            </Card>
        </section>
    )
}

Personal.proptypes = {

}

export default connect(({ admin, websocket, loading }) => ({ admin, websocket, loading }))(Personal)

