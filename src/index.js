import './index.html'
import 'babel-polyfill'
import dva from 'dva'
import createLoading from 'dva-loading'
import { browserHistory } from 'dva/router'
import { message } from 'antd'
import moment from 'moment';

// 入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: browserHistory,
  onError (error) {
  	if (error.success === false) {
	    message.error(error.message)
    }
  },
})

// 2. Model
app.model(require('./models/app'))
app.model(require('./models/websocket'))
app.model(require('./models/message'))
app.model(require('./models/chat'))


// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')