import React from 'react'
import PropTypes from 'prop-types'
import styles from './sales.less'
import classnames from 'classnames'
import { color } from '../../../utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Sales ({ data }) {
  return (
    <div className={styles.sales}>
      <div className={styles.title}>月销量</div>
      <ResponsiveContainer minHeight={360}>
        <LineChart data={data}>
          <Legend verticalAlign="top"
          />
          <XAxis dataKey="date" axisLine={{ stroke: color.borderBase, strokeWidth: 1 }} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <CartesianGrid vertical={false} stroke={color.borderBase} strokeDasharray="3 3" />
          <Tooltip
          />
          <Line type="monotone" dataKey="counts" stroke={color.green} strokeWidth={2} dot={{ fill: color.green }} activeDot={{ r: 5, strokeWidth: 0 }} />
          <Line type="monotone" dataKey="sales" stroke={color.red} strokeWidth={2} dot={{ fill: color.red }} activeDot={{ r: 5, strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

Sales.propTypes = {
  data: PropTypes.array,
}

export default Sales
