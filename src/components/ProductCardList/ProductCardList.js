import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import ProductCard from './ProductCard'
import styles from './ProductCardList.css'

class ProductCardList extends React.Component
{
	constructor(props) {
		super(props)
	}

	render() {
		const { data, header, footer, cardStyle } = this.props
		const CardList = data.map( item => 
			<Col style={{ margin: '10px auto' }} lg={12} md={24}>
				<ProductCard 
					style={cardStyle} 
					img_src={item.img_url} 
					title={item.title} 
					description={item.description} 
				/>
			</Col>
		)

		return (
			<div>
				{
					header &&
					<Row className="header">
						header
					</Row>
				}
				<Row className="content" justify="center" align="center">
					{CardList}
				</Row>
				{
					footer &&
					<Row className="footer">
						footer
					</Row>
				}
			</div>
		)
	}
}

ProductCardList.propTypes = {
	header: PropTypes.element,
	data: PropTypes.array.isRequired,
	footer: PropTypes.element,
}

export default ProductCardList