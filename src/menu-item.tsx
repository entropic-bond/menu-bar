import React from 'react'
import { Component, PropsWithChildren } from 'react'

export type MenuItemShowState = 'show' | 'hide' | 'disable'

export type MenuItemProps = PropsWithChildren<{
	caption: string | JSX.Element | ( ( menuItem: MenuItem, index?: number ) => JSX.Element )
	key?: string
	show?: MenuItemShowState
	action?: ( item: MenuItem )=>void
}>

interface MenuItemState {}

export class MenuItem extends Component<MenuItemProps, MenuItemState> {
	
	render() {
		const { children } = this.props

		return (
			<>
				{ children }
			</>
		)		
	}
}
