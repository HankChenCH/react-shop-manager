import React from 'react'
import { Card } from 'antd'
import PropTypes from 'prop-types'
import styles from './ProductCard.css'

class ProductCard extends React.Component
{
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<Card style={this.props.style} bodyStyle={{ padding: 0 }}>
					{
						this.props.img_src && 
						<div className={styles.product_image}>
							<img alt="example" width="100%" src={this.props.img_src} />
						</div>
					}
			    <div className={styles.product_card}>
			      <h3>{this.props.title}</h3>
			      <div>{this.props.description}</div>
			    </div>
			</Card>
		)
	}
}

ProductCard.propTypes = {
	img_src: PropTypes.string,
	title: PropTypes.string.isRequired,
	description: PropTypes.element,
}

export default ProductCard