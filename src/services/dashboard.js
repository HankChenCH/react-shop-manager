import { request, config } from '../utils'
const { api } = config
const { dashboard } = api
const { countAllSales } = api.product
const orderList = api.order.list

export async function myCity (params) {
  return request({
    url: 'http://www.zuimeitianqi.com/zuimei/myCity',
    data: params,
  })
}

export async function queryWeather (params) {
  return request({
    url: 'http://www.zuimeitianqi.com/zuimei/queryWeather',
    data: params,
  })
}

export async function query (params) {
  return request({
    url: dashboard.home,
    method: 'get',
    data: params,
  })
}

export async function queryRecentOrder (params) {
  return request({
    url: orderList,
    method: 'get',
    data: params,
  })
}

export async function allSales (params) {
  return request({
    url: countAllSales,
    method: 'get',
    data: params,
  })
}
