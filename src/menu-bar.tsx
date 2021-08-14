import React, { cloneElement, Component } from 'react'

export type MenuItemShowState = 'show' | 'hide' | 'disable'

export interface MenuItem {
	caption: string | JSX.Element | ( ( menuItem: MenuItem, index?: number ) => JSX.Element )
	key?: string
	show?: MenuItemShowState
	action?: ( item: MenuItem )=>void
}

export interface MenuBarProps {
	className?: string
	menuItems: MenuItem[]
	onClick?: ( item: MenuItem, index: number )=>void
	activeIndex?: number
	position?: 'top' | 'left' | 'bottom' | 'right'
}

interface MenuBarState {
	selectedMenu: MenuItem
	selectedMenuIndex: number
}

export class MenuBar extends Component<MenuBarProps, MenuBarState> {

	constructor( props: MenuBarProps ) {
		super( props )
		const { menuItems, activeIndex } = props

		this.state = { 
			selectedMenuIndex: activeIndex,
			selectedMenu: activeIndex>=0 && menuItems[ activeIndex ]
		}
	}

	componentDidUpdate( prevProps: MenuBarProps ) {
		const { menuItems, activeIndex } = this.props

		if ( activeIndex !== prevProps.activeIndex ) {
			this.setState({ 
				selectedMenuIndex: activeIndex,
				selectedMenu: activeIndex>=0 && menuItems[ activeIndex ]
			})
		}
	}

	private renderButton( item: MenuItem, index: number ) {
		if ( !item.caption ) return
		const { onClick } = this.props
		const { selectedMenuIndex } = this.state

		const disabled = item.show === 'disable'

		const props = {
			key: item.key || index,
			onClick: ()=> {
				this.setState({ 
					selectedMenu: item,
					selectedMenuIndex: index
				}) 
				onClick && onClick( item, index )
				item.action && item.action( item )
			},
			disabled,
			className: `${ selectedMenuIndex===index? 'active' : '' } ${ disabled? 'disabled' : '' }`
		}

		if ( typeof item.caption === 'string' ) {
			return (
				<button {...props }>
					<span>{ item.caption }</span>
				</button>
			)
		}
	
		if ( typeof item.caption === 'function' ) {
			return cloneElement( item.caption( item, index ), props )
		}

		return cloneElement( item.caption, { ...props, style: { 
			pointerEvents: disabled? 'none' : 'auto' 
		}})
	}

	content() {
		const { children } = this.props
		const { selectedMenuIndex, selectedMenu } = this.state

		return (
			<div className="content">
				{ children && selectedMenuIndex >=0 && selectedMenu &&
					cloneElement( children[ selectedMenuIndex ], { 
						key: selectedMenu.key || selectedMenuIndex 
					}) 
				}
			</div>
		)
	}

	render() {
		const { menuItems, className, position } = this.props
		const vertical = position === 'left' || position === 'right'
		const contentFirst = position === 'bottom' || position === 'right'

		return(
			<div className={`menu-bar ${ className || '' } ${ vertical? 'vertical' : ''}`}>
				{ contentFirst && this.content() }
				<div className="button-bar">
					{
						menuItems?.map( ( item, index ) => {
							if ( item.show !== 'hide' ) {
								return this.renderButton( item, index )	
							}
						})
					}
				</div>
				{ !contentFirst && this.content() }
			</div>
		)
	}
}