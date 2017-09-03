module.exports = {
  name: '探小店后台',
  prefix: 'tan_shop_',
  footerText: '探小店后台  © 2017 中山食探工作室',
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
      relogin: '/token/admin/relogin',
      alogout: '/token/admin',
    },
    dashboard: {
      home: '/home'
    },
    product: {
      all: '/product/in_category/all',
      list: '/product',
      info: '/product/:id',
      batch: '/product/batch',
      stockAndPrice: '/product/:id/stock_and_price',
      detail: '/product/:id/detail',
      properties: '/product/:id/properties',
      pull: 'product/:id/pullOnOff',
      recent: '/product/recent',
    },
    category: {
      list: '/category/all',
      info: '/category/:id',
      batch: '/category/batch',
      products: '/product/by_category',
      setProducts: 'category/:id/product'
    },
    user:{
      list: '/user',
      info: '/user/:id',
    }, 
    order:{
      list: '/order/by_admin',
      info: '/order/by_admin/:id',
      price: '/order/by_admin/price/:id',
      delivery: '/order/by_admin/delivery/:id',
      batch: '/order/by_admin/batch',
    },
    image: {
      categoryTopic: 'image/category_topic_img',
      productMain: 'image/product_main_img',
      productDetail: 'image/product_detail_img',
    },
    posts: '/posts',
  },
}
