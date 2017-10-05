import { request, config } from '../utils'
const { api } = config
const { all, list, info, batch, stockAndPrice, detail, properties, pull, countOneSales, buyNow } = api.product

export async function query (params) {
  return request({
    url: list,
    method: 'get',
    data: params,
  })
}

export async function queryDetail (params) {
  return request({
    url: info,
    method: 'get',
    data: params,
  })
}

export async function queryAll (params) {
  return request({
    url: all,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: info.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function createBuyNow (params) {
  return request({
    url: buyNow,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: info,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: info,
    method: 'put',
    data: params,
  })
}

export async function updateStockAndPrice (params) {
  return request({
    url: stockAndPrice,
    method: 'put',
    data: params,
  })
}

export async function updateDetail (params) {
  return request({
    url: detail,
    method: 'put',
    data: params,
  })
}

export async function updateParams (params) {
  return request({
    url: properties,
    method: 'put',
    data: params,
  })
}

export async function pullOnOff (params) {
  return request({
    url: pull,
    method: 'put',
    data: params,
  })
}

export async function batchOnOff(params) {
  return request({
    url: batch,
    method: 'put',
    data: params,
  })
}

export async function batchRemove(params) {
  return request({
    url: batch,
    method: 'delete',
    data: params,
  })
}

export async function oneSales (params) {
  return request({
    url: countOneSales,
    method: 'get',
    data: params,
  })
}
