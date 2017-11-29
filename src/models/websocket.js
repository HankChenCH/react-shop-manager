import modelExtend from 'dva-model-extend'
import { notification } from 'antd'
import { model } from './common'
import * as ws from '../services/ws'
import { config, hasProp } from '../utils'
const { prefix } = config

export default modelExtend(model, {
    namespace: 'websocket',

    state: {
        notificationOn: true,
        notificationPlacement: '',
        notificationDuration: 4.5,
    },

    subscriptions: {
        setup ({ dispatch }) {
            let notificationSetting = JSON.parse(localStorage.getItem(`${prefix}notificationSetting`))

            if (!(notificationSetting instanceof Object)) {
                notificationSetting = {
                    on: true,
                    placement: 'bottomRight',
                    duration: 4.5,
                }
            }

            notificationSetting.init = true
            
            dispatch({ type: 'setNotificationConfig', payload: notificationSetting })
        },
        wsSetup ({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname !== '/login') {
                    //为了保证登录时不会拿旧票据去链接websocket，导致链接失效，登录后延迟.5秒再链接websocket
                    setTimeout(() => ws.connect(location.pathname), 500)
                } else {
                    ws.close()
                }
              })

            let hreatbeatTimer = setInterval(() => {
                ws.ready(() => ws.trigger('heartbeatCheck'))
            }, 25000) 
            
            window.onunload = () => {
                clearInterval(hreatbeatTimer)
                ws.close()
            }
        },
        wsListen ({ dispatch }) {
            //weapp通知
            ws.on('weapp/pay/notice',(res) => {
                dispatch({ type: 'app/addNoticeCount', payload: '1' })
                dispatch({ type: 'app/globalNotice', payload: { from: 'system', data: '您有一笔新的订单等待处理' } })
                dispatch({ type: 'message/addOrderNotice', payload: res.data })
            })
            //IM通知
            ws.on('offline/notice', (res) => {
                dispatch({ type: 'chat/offlineUpdate', payload: res })
            })
            ws.on('online/notice', (res) => {
                dispatch({ type: 'chat/onlineUpdate', payload: res })
            })
            ws.on('manager/online/count', (res) => {
                dispatch({ type: 'chat/membersUpdate', payload: res })
            })
            ws.on('manager/chat', (res) => {
                dispatch({ type: 'app/addNoticeCount', payload: '2' })
                dispatch({ type: 'chat/receiveMsg', payload: res })
            })
        },
    },

    effects: {
        *setNotificationConfig ({ payload }, { put }) {
            notification.config({ ...payload })
            
            yield localStorage.setItem(`${prefix}notificationSetting`, JSON.stringify(payload))
            yield put({ type: 'handleNotificationOn', payload: payload.on })
            yield put({ type: 'handleNotificationPlacement', payload: payload.placement })
            yield put({ type: 'handleNotificationDuration', payload: payload.duration })

            if (!hasProp(payload, 'init')) {
               yield put({ type: 'app/messageSuccess', payload: '设置成功' })
            }
        },
    },

    reducers: {
        handleNotificationOn (state, {payload}) {
            return {
                ...state,
                notificationOn: payload
            }
        },

        handleNotificationPlacement (state, { payload }) {
            return {
                ...state,
                notificationPlacement: payload
            }
        },

        handleNotificationDuration (state, { payload }) {
            return {
                ...state,
                notificationDuration: payload
            }
        },
    }
})