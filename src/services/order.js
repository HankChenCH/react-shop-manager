import { request, config } from '../utils'
const { api } = config
const { list, info, price, delivery, batch } = api.order

export async function query (params) {
  return request({
    url: list,
    method: 'get',
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

export async function changePrice (params) {
	return request({
		url: price,
		method: 'put',
		data: params,
	})
}

export async function deliveryGoods (params) {
	return request({
		url: delivery,
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

export async function batchRemove (params) {
	return request({
		url: batch,
		method: 'delete',
		data: params,
	})
}
