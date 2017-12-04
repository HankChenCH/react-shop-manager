import { request, config } from '../utils'
const { api } = config
const { list, info, batch, products, pull, rank } = api.theme

export async function query (params) {
  return request({
    url: list,
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

export async function pullOnOff (params) {
  return request({
    url: pull,
    method: 'put',
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

export async function setRank (params) {
  return request({
    url: rank,
    method: 'put',
    data: params
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
    url: products,
    method: 'put',
    data: params,
  })
}

export async function removeAllProducts (params) {
  return request({
    url: products,
    method: 'delete',
    data: params,
  })
}