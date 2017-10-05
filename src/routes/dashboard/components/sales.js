import React from 'react'
import PropTypes from 'prop-types'
import styles from './sales.less'
import classnames from 'classnames'
import { color } from '../../../utils'
import { Button } from 'antd'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Sales ({ data, reflashable, reflashLoading, onReflash }) {
  return (
    <div className={styles.sales}>
      <div className={styles.title}>
        <span>月销量</span>
        {
          reflashable && 
          <Button className={styles.reflash} size="small" onClick={onReflash} loading={reflashLoading}>刷新</Button>
        }
      </div>
      <ResponsiveContainer minHeight={360}>
        <LineChart data={data}>
          <Legend verticalAlign="top"
          />
          <XAxis dataKey="date" axisLine={{ stroke: color.borderBase, strokeWidth: 1 }} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <CartesianGrid vertical={false} stroke={color.borderBase} strokeDasharray="3 3" />
          <Tooltip
          />
          <Line type="monotone" dataKey="销售量" stroke={color.green} strokeWidth={2} dot={{ fill: color.green }} activeDot={{ r: 5, strokeWidth: 0 }} />
          <Line type="monotone" dataKey="销售额" stroke={color.red} strokeWidth={2} dot={{ fill: color.red }} activeDot={{ r: 5, strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

Sales.propTypes = {
  data: PropTypes.array,
}

export default Sales
