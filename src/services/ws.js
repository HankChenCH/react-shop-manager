import { config } from '../utils/'

const { websocketURL } = config

let websocket = undefined

function getWebsocket(url) {
    if (!(websocket instanceof WebSocket)) {
        websocket = new WebSocket(url)
    }
    return websocket
}

export async function connect() {
    const client = getWebsocket(websocketURL)
    client.onopen = () => {
        console.log('链接成功',client)
    }
}

//监听服务器事件以及返回结果
export async function listen(event, cb) {
    const client = getWebsocket(websocketURL)
    switch (event){
        case 'error':
            client.onerror = (e) => {
                cb(e)
            }
            break;
        case 'close':
            //服务器主动关闭
            client.onclose=function(e){
                cb(e)
                client.close() //关闭TCP连接
            }
            break;
        default:
            client.onmessage = (res) => {
                if (res.event === event) {
                    cb(res)
                }
            }
    }
}

//普通发送消息
export async function sendMsg(data) {
    const client = getWebsocket(websocketURL)
    const sendBody = { ...data, event: 'msg'}
    client.send(JSON.stringify(sendBody))
}

//触发服务器事件
export async function trigger(event, data) {
    const client = getWebsocket(websocketURL)
    const sendBody = { ...data, event: event }
    client.send(JSON.stringify(sendBody))
}

//客户端主动关闭
export async function close(code, reason) {
    const client = getWebsocket(websocketURL);
    client.close(code, reason);
}