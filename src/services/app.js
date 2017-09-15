import { request, config } from '../utils'
const { api } = config
const { user, system, product } = api
const { alogin, alogout, relogin } = system
const { list } = user
const { all } = product

export async function login (params) {
  return request({
    url: alogin,
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: alogout,
    method: 'delete',
    data: params,
  })
}

export async function reToken (params) {
  return request({
    url: relogin,
    method: 'post',
    data: params,
  })
}

export async function queryProductAll (params) {
  return request({
    url: all,
    method: 'get',
    data: params,
  })
}

export async function query (params) {
  if (params.token) {
    return {
      success: true,
      user: params,
    }
  }
  return {
    success: false
  }
}
