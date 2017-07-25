module.exports = {
  name: '食探商城后台',
  prefix: 'antdAdmin',
  footerText: '食探商城后台   © 2017 中山食探工作室',
  logo: '/st.jpg',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  baseURL: 'http://localhost:8000/api/v1',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:7000'],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  api: {
    userLogin: '/token/admin',
    userLogout: '/user/logout',
    userInfo: '/userInfo',
    users: '/users',
    category: '/category/all',
    posts: '/posts',
    user: '/user/:id',
    dashboard: '/dashboard',
    imageCategoryTopic: 'image/category_topic_img',
  },
}
