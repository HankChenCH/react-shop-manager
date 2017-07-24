import { request, config } from '../utils'
const { api } = config
const { category } = api

export async function query (params) {
  return request({
    url: category,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: category.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: category,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: category,
    method: 'patch',
    data: params,
  })
}
