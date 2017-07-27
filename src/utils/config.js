module.exports = {
  name: '探小店后台',
  prefix: 'tan_shop_',
  footerText: '探小店后台   © 2017 中山食探工作室',
  logo: '/st.jpg',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  baseURL: 'http://localhost:3050/api/v1',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:7000'],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  api: {
    system: {
      alogin: '/token/admin',
      alogout: '/token/admin',
    },
    dashboard: {
      home: '/home'
    },
    category: {
      list: '/category/all',
      info: '/category/:id',
      cproductManager: '/category/:id/product'
    },
    posts: '/posts',
    user:{
      list: '/user',
      info: '/user/:id',
    }, 
    order:{
      list: '/order/by_admin',
      info: '/order/by_admin/:id',
      delivery: '/order/delivery/:id',
    },
    image: {
      categoryTopic: 'image/category_topic_img',
    }
  },
}
