import { render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { MenuBar, MenuItem } from './menu-bar'

describe( 'Menu Bar', ()=>{
	let menuItemClicked: jest.Mock<any, any>
	const menuItems: MenuItem[] = [
		{ caption: 'Item 1', show: 'show', action: jest.fn() },
		{ caption: 'Item 2', show: 'disable', action: jest.fn() },
		{ caption: 'Item 3', show: 'hide', action: jest.fn() },
		{ caption: 'Item 4' },
		{ caption: 'Item 5', action: jest.fn() },
	]

	describe( 'Items visibility', ()=>{

		beforeEach(()=>{
			
			render(
				<MenuBar menuItems={ menuItems }>
					<div>Container 1</div>
					<div>Container 2</div>
					<div>Container 3</div>
					<div>Container 4</div>
					<div>Container 5</div>
				</MenuBar>
			)
		})

		it( 'should not throw on undefined caption', ()=>{
			expect( ()=>{
				render(
					<MenuBar menuItems={ [{ caption: undefined }] }>
						<div>Container 1</div>
					</MenuBar>
				)
			}).not.toThrow()
		})
		
	
		it( 'should not show active container', ()=>{
			expect( screen.queryByText( 'Container 1' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 4' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 5' ) ).not.toBeInTheDocument()
		})
		
		it( 'should show menu items', ()=>{
			expect( screen.getByText( 'Item 1' ) ).toBeInTheDocument()
			expect( screen.getByText( 'Item 2' ) ).toBeInTheDocument()
			expect( screen.getByText( 'Item 4' ) ).toBeInTheDocument()
			expect( screen.getByText( 'Item 5' ) ).toBeInTheDocument()
		})
	
		it( 'should disable menu items', ()=>{
			expect( screen.getByText( 'Item 1' ) ).toBeEnabled()
			expect( screen.getByText( 'Item 2' ) ).toBeDisabled()
			expect( screen.getByText( 'Item 4' ) ).toBeEnabled()
			expect( screen.getByText( 'Item 5' ) ).toBeEnabled()
		})
	
		it( 'should hide menu items', ()=>{
			expect( screen.getByText( 'Item 1' ) ).toBeVisible()
			expect( screen.getByText( 'Item 2' ) ).toBeVisible()
			expect( screen.queryByText( 'Item 3' ) ).not.toBeInTheDocument()
			expect( screen.getByText( 'Item 4' ) ).toBeVisible()
			expect( screen.getByText( 'Item 5' ) ).toBeVisible()
		})
			
	})

	describe( 'Menu items actions', ()=>{

		beforeEach(()=>{
			menuItemClicked = jest.fn()
			
			render(
				<MenuBar 
					menuItems={ menuItems }
					onClick={ menuItemClicked }
				>
					<div>Container 1</div>
					<div>Container 2</div>
					<div>Container 3</div>
					<div>Container 4</div>
					<div>Container 5</div>
				</MenuBar>
			)
		})

		it( 'should call menu item action on click', ()=>{
			userEvent.click( screen.getByText( 'Item 1' ) )
			
			expect( menuItems[ 0 ].action ).toHaveBeenCalled()
			expect( menuItems[ 1 ].action ).not.toHaveBeenCalled()
			expect( menuItems[ 2 ].action ).not.toHaveBeenCalled()
			expect( menuItems[ 4 ].action ).not.toHaveBeenCalled()
		})

		it( 'should show container on click', ()=>{
			userEvent.click( screen.getByText( 'Item 4' ) )

			expect( screen.queryByText( 'Container 1' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
			expect( screen.getByText( 'Container 4' ) ).toBeInTheDocument()
			expect( screen.queryByText( 'Container 5' ) ).not.toBeInTheDocument()
		})

		it( 'should not show on click on disabled item', ()=>{
			userEvent.click( screen.getByText( 'Item 2' ) )

			expect( screen.queryByText( 'Container 1' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
		})
		
		it( 'should notify on click', ()=>{
			userEvent.click( screen.getByText( 'Item 1' ) )

			expect( menuItemClicked ).toHaveBeenCalledWith( menuItems[ 0 ], 0 )
		})
		
		it( 'should not notify on click on disabled item', ()=>{
			userEvent.click( screen.getByText( 'Item 2' ) )

			expect( menuItemClicked ).not.toHaveBeenCalled()
		})

	})

	describe( 'Default active', ()=>{

		it( 'should show container 0 as active container', ()=>{
			render(
				<MenuBar menuItems={ menuItems } activeIndex={ 0 }>
					<div>Container 1</div>
					<div>Container 2</div>
					<div>Container 3</div>
					<div>Container 4</div>
					<div>Container 5</div>
				</MenuBar>
			)

			expect( screen.queryByText( 'Container 1' ) ).toBeInTheDocument()
			expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 4' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 5' ) ).not.toBeInTheDocument()
		})


		it( 'should show container 3 as active container', ()=>{
			render(
				<MenuBar menuItems={ menuItems } activeIndex={ 3 }>
					<div>Container 1</div>
					<div>Container 2</div>
					<div>Container 3</div>
					<div>Container 4</div>
					<div>Container 5</div>
				</MenuBar>
			)

			expect( screen.queryByText( 'Container 1' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
			expect( screen.getByText( 'Container 4' ) ).toBeInTheDocument()
			expect( screen.queryByText( 'Container 5' ) ).not.toBeInTheDocument()
		})

	})
	
	describe( 'Menu item has JSX Element', ()=>{
	
		beforeEach(()=>{

			const menuItemsWithComponents: MenuItem[] = [
				{ caption: <div>Item 1 as menu button</div>, show: 'show', action: jest.fn() },
				{ caption: <div>Item 2 as menu button</div>, show: 'disable', action: jest.fn() },
				{ caption: <div>Item 3 as menu button</div>, show: 'hide', action: jest.fn() },
				{ caption: <div>Item 4 as menu button</div> },
				{ caption: <div>Item 5 as menu button</div>, action: jest.fn() },
			]

			render(
				<MenuBar menuItems={ menuItemsWithComponents }>
					<div>Container 1</div>
					<div>Container 2</div>
					<div>Container 3</div>
					<div>Container 4</div>
					<div>Container 5</div>
				</MenuBar>
			)
		})
	
		it( 'should show menu components instead of menu buttons', ()=>{
			const itemsComponents = screen.getAllByText( 'as menu button', { exact: false } )
			expect( itemsComponents.length ).toBe( 4 )
			expect(	screen.queryByText( 'Item 1 as menu button' ) ).toBeInTheDocument()
			expect(	screen.queryByText( 'Item 2 as menu button' ) ).toBeInTheDocument()
			expect(	screen.queryByText( 'Item 3 as menu button' ) ).not.toBeInTheDocument()
			expect(	screen.queryByText( 'Item 4 as menu button' ) ).toBeInTheDocument()
			expect(	screen.queryByText( 'Item 5 as menu button' ) ).toBeInTheDocument()
		})

		it( 'should not show any container as default', ()=>{
			expect( screen.queryByText( 'Container', { exact: false } ) ).not.toBeInTheDocument()
		})

		it( 'should show container on click', ()=>{
			userEvent.click( screen.getByText( 'Item 4 as menu button' ) )

			expect( screen.queryByText( 'Container 1' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
			expect( screen.getByText( 'Container 4' ) ).toBeInTheDocument()
			expect( screen.queryByText( 'Container 5' ) ).not.toBeInTheDocument()
		})

		it( 'should add css class _active_ on click', ()=>{
			userEvent.click( screen.getByText( 'Item 4 as menu button' ) )

			expect(	screen.getByText( 'Item 1 as menu button' ) ).not.toHaveClass( 'active' )
			expect(	screen.getByText( 'Item 2 as menu button' ) ).not.toHaveClass( 'active' )
			expect(	screen.getByText( 'Item 4 as menu button' ) ).toHaveClass( 'active' )
			expect(	screen.getByText( 'Item 5 as menu button' ) ).not.toHaveClass( 'active' )
		})

		it( 'should add css class _disabled_ if disabled', ()=>{
			expect(	screen.getByText( 'Item 1 as menu button' ) ).not.toHaveClass( 'disabled' )
			expect(	screen.getByText( 'Item 2 as menu button' ) ).toHaveClass( 'disabled' )
			expect(	screen.getByText( 'Item 4 as menu button' ) ).not.toHaveClass( 'disabled' )
			expect(	screen.getByText( 'Item 5 as menu button' ) ).not.toHaveClass( 'disabled' )
		})

		it( 'should not allow to click on disabled menu item', ()=>{
			expect( 
				()=>userEvent.click( screen.getByText( 'Item 2 as menu button' ) ) 
			).toThrow()

			expect( screen.queryByText( 'Container 1' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 4' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 5' ) ).not.toBeInTheDocument()
		})
				
	})


})