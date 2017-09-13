import { request, config } from '../utils'
const { api } = config
const { list, info, batch, products, setProducts } = api.theme
const { all } = api.product

export async function query (params) {
  return request({
    url: list,
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

export async function queryProducts (params) {
  return request({
    url: products,
    method: 'get',
    data: params
  })
}

export async function create (params) {
  return request({
    url: info.replace('/:id', ''),
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

export async function batchRemove (params) {
  return request({
    url: batch,
    method: 'delete',
    data: params,
  })
}

export async function updateProducts (params) {
  return request({
    url: setProducts,
    method: 'put',
    data: params,
  })
}

export async function removeAllProducts (params) {
  return request({
    url: setProducts,
    method: 'delete',
    data: params,
  })
}