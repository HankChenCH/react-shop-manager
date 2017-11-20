module.exports = {
  name: '探小店后台',
  version: '1.1.0@beta',
  prefix: 'tan_shop_',
  footerText: '探小店后台  © 2017 中山食探工作室',
  logo: '/st.jpg',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  websocketURL: false ? 'ws://127.0.0.1:9502' : 'wss://ws.zsshitan.com',
  baseURL: false ? 'http://api.c.cn/api/v1' : 'https://api.zsshitan.com/api/v1',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['https://api.zsshitan.com/api/vi'],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  api: {
    system: {
      alogin: '/token/admin',
      relogin: '/token/admin/relogin',
      alogout: '/token/admin',
    },
    dashboard: {
      home: '/home',
      numberCount: '/data/dashboard',
    },
    product: {
      all: '/product/all',
      list: '/product',
      info: '/product/:id',
      batch: '/product/batch',
      stockAndPrice: '/product/:id/stock_and_price',
      detail: '/product/:id/detail',
      properties: '/product/:id/properties',
      pull: 'product/:id/pullOnOff',
      recent: '/product/recent',
      countAllSales: '/product/sales',
      countOneSales: '/product/:id/sales',
      buyNow: '/product/:id/buynow',
      buyNowInfo: 'product/:id/buyNow/:bid',
    },
    order: {
      list: '/order/by_admin',
      info: '/order/by_admin/:id',
      price: '/order/by_admin/price/:id',
      delivery: '/order/by_admin/delivery/:id',
      issue: '/order/by_admin/issue/:id',
      batch: '/order/by_admin/batch',
      close: '/order/by_admin/closed',
      ticket: '/order/ticket/:bid'
    },
    category: {
      list: '/category/all',
      info: '/category/:id',
      batch: '/category/batch',
      products: '/product/by_category',
      setProducts: 'category/:id/product'
    },
    theme: {
      list: '/theme/all',
      info: '/theme/:id',
      batch: '/theme/batch',
      products: '/theme/:id/product',
      setProducts: 'theme/:id/product',
      pull: 'theme/:id/pullOnOff',
      rank: 'theme/rank',
    },
    express: {
      list: '/express/all',
      info: '/express/:id',
      batch: '/express/batch',
    },
    user:{
      list: '/user',
      info: '/user/:id',
    }, 
    admin: {
      list: '/admin',
      info: '/admin/:id',
      status: '/admin/:id/status',
      batch: '/admin/batch',
      members: '/admin/chat_member',
    },
    menu: {
      list: '/menu',
      info: '/menu/:id',
      subInfo: '/menu/:id/sub/:sid',
      batch: '/menu/batch',
    },
    image: {
      themeTopic: 'image/theme_topic_img',
      themeHead: 'image/theme_head_img',
      categoryTopic: 'image/category_topic_img',
      productMain: 'image/product_main_img',
      productDetail: 'image/product_detail_img',
      buyNowRules: 'image/buy_now_rules_img',
    },
  },
  imgStyle: {
    product: {
      thumb: '?imageView2/1/w/32/h/32/q/75|imageslim',
    }
  }
}
