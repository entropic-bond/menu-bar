import React, { cloneElement, Component } from 'react'
import { MenuItem } from './menu-item'

type MenuElement = MenuItem | JSX.Element

export interface MenuBarProps {
	className?: string
	onClick?: ( item: MenuItem, index: number )=>void
	activeIndex?: number
	position?: 'top' | 'left' | 'bottom' | 'right'
	children: MenuElement[]
}

interface MenuBarState {
	selectedMenuIndex: number
}

export class MenuBar extends Component<MenuBarProps, MenuBarState> {

	constructor( props: MenuBarProps ) {
		super( props )
		const { activeIndex } = props

		this.state = { 
			selectedMenuIndex: activeIndex,
		}
	}

	componentDidMount(): void {
		const { activeIndex } = this.props

		this.setState({
			selectedMenuIndex: activeIndex,
		})
	}

	componentDidUpdate( prevProps: MenuBarProps ) {
		const { activeIndex } = this.props

		if ( activeIndex !== prevProps.activeIndex ) {
			this.setState({ 
				selectedMenuIndex: activeIndex,
			})
		}
	}

	private renderButton( item: MenuElement, index: number ) {
		const itemProps = item.props
		if ( !( item['type'] === MenuItem ) ) return ( item )
		if ( !itemProps.caption ) return ( <button className="undefined-caption"/> )
		if ( itemProps.show === 'hide' ) return

		const { onClick } = this.props
		const { selectedMenuIndex } = this.state

		const disabled = itemProps.show === 'disable'

		const props = {
			key: itemProps.key || index,
			onClick: ()=> {
				this.setState({ 
					selectedMenuIndex: index
				}) 
				onClick?.( item as MenuItem, index )
				itemProps.action?.( item )
			},
			disabled,
			className: `${ selectedMenuIndex===index? 'active' : '' } ${ disabled? 'disabled' : '' }`
		}

		if ( typeof itemProps.caption === 'string' ) {
			return (
				<button {...props }>
					<span>{ itemProps.caption }</span>
				</button>
			)
		}
	
		if ( typeof itemProps.caption === 'function' ) {
			return cloneElement( itemProps.caption( item, index ), props )
		}

		return cloneElement( itemProps.caption, { ...props, style: { 
			pointerEvents: disabled? 'none' : 'auto' 
		}})
	}

	content() {
		const { children } = this.props
		const { selectedMenuIndex } = this.state
		const child = children[ selectedMenuIndex ] as MenuItem

		return (
			<div className="content">
				{ child?.props.children }
			</div>
		)
	}

	render() {
		const { children, className, position } = this.props
		const vertical = position === 'left' || position === 'right'
		const contentFirst = position === 'bottom' || position === 'right'

		return(
			<div className={`menu-bar ${ className || '' } ${ vertical? 'vertical' : ''}`}>
				{ contentFirst && this.content() }
				<div className="button-bar">
					{
						children?.map( ( item, index ) => this.renderButton( item, index ) )
					}
				</div>
				{ !contentFirst && this.content() }
			</div>
		)
	}
}
