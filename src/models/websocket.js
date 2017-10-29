import modelExtend from 'dva-model-extend'
import { notification } from 'antd'
import { model } from './common'
import * as ws from '../services/ws'
import { config, hasProp } from '../utils'
const { prefix } = config

export default modelExtend(model, {
    namespace: 'websocket',

    state: {
        notificationPlacement: '',
        notificationDuration: 4.5,
    },

    subscriptions: {
        setup ({ dispatch }) {
            let notificationSetting = JSON.parse(localStorage.getItem(`${prefix}notificationSetting`))

            if (!(notificationSetting instanceof Object)) {
                notificationSetting = {
                    placement: 'bottomRight',
                    duration: 4.5,
                }

                localStorage.setItem(`${prefix}notificationSetting`, JSON.stringify(notificationSetting))
            }

            dispatch({ type: 'setNotificationConfig', payload: notificationSetting })
        },
        wsSetup ({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname !== '/login') {
                  ws.connect()
                }
              })

            let hreatbeatTimer = setInterval(() => {
                ws.trigger('heartbeatCheck')
            }, 25000) 
            
            window.onunload = () => {
                clearInterval(hreatbeatTimer)
                ws.close()
            }
        },
        wsListen ({ dispatch }) {
            ws.registerListener('login',(res) => {
                dispatch({ type: 'app/globalNotice', payload: res })
            })
            ws.registerListener('manager/chat', (res) => {
                dispatch({ type: 'app/addNoticeCount' })
                dispatch({ type: 'message/receiveMsg', payload: res })
            })
            ws.registerListener('pay/notice',(res) => {
                dispatch({ type: 'app/addNoticeCount' })
                dispatch({ type: 'app/globalNotice', payload: { from: 'system', data: '您有一笔新的订单等待处理' } })
                dispatch({ type: 'message/addOrderNotice', payload: res })
            })
        },
    },

    effects: {
        *setNotificationConfig ({ payload }, { put }) {
            notification.config({ ...payload })

            yield put({ type: 'handleNotificationPlacement', payload: payload.placement })
            yield put({ type: 'handleNotificationDuration', payload: payload.duration })
        },
    },

    reducers: {
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