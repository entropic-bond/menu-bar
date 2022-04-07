import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { MenuBar } from './menu-bar'
import { MenuItem } from './menu-item'

describe( 'Menu Bar', ()=>{
	let menuItemClicked: jest.Mock<any, any>
	let menuAction: jest.Mock[] = []

	beforeEach(()=>{
		for ( let i=0; i<5; ++i ) {
			menuAction.push( jest.fn() )
		}
	})

	describe( 'Items visibility', ()=>{

		beforeEach(()=>{

			render(
				<MenuBar>
					<MenuItem caption="Item 1" action={ menuAction[0] }>
						Container 1
					</MenuItem>

					<MenuItem caption="Item 2" show={ 'disable' } action={ menuAction[1] }>
						Container 2
					</MenuItem>

					<MenuItem caption="Item 3" show={ 'hide' } action={ menuAction[2] }>
						Container 3
					</MenuItem>

					<div>Decorator 4</div>

					<MenuItem caption="Item 5" action={ menuAction[4] }>
						Container 5
					</MenuItem>

					<MenuItem caption={ undefined }>
						Nothing
					</MenuItem>
				</MenuBar>
			)
		})

		it( 'should not throw on undefined caption', ()=>{
			expect( ()=>{
				render(
					<MenuBar >
						<MenuItem caption={ undefined }></MenuItem>
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
			expect( screen.getByRole( 'button', { name: 'Item 1' } ) ).toBeInTheDocument()
			expect( screen.getByRole( 'button', { name: 'Item 2' } ) ).toBeInTheDocument()
			expect( screen.getByText( 'Decorator 4' ) ).toBeInTheDocument()
			expect( screen.getByRole( 'button', { name: 'Item 5' } ) ).toBeInTheDocument()
		})
	
		it( 'should disable menu items', ()=>{
			expect( screen.getByText( 'Item 1' ) ).toBeEnabled()
			expect( screen.getByText( 'Item 2' ).parentElement ).toBeDisabled()
			expect( screen.getByText( 'Decorator 4' ) ).toBeEnabled()
			expect( screen.getByText( 'Item 5' ) ).toBeEnabled()
		})
	
		it( 'should hide menu items', ()=>{
			expect( screen.getByText( 'Item 1' ) ).toBeVisible()
			expect( screen.getByText( 'Item 2' ) ).toBeVisible()
			expect( screen.queryByText( 'Item 3' ) ).not.toBeInTheDocument()
			expect( screen.getByText( 'Decorator 4' ) ).toBeVisible()
			expect( screen.getByText( 'Item 5' ) ).toBeVisible()
		})
		
	})

	describe( 'Menu items actions', ()=>{

		beforeEach(()=>{
			menuItemClicked = jest.fn()
			
			render(
				<MenuBar onClick={ menuItemClicked }>
					<MenuItem caption="Item 1" action={ menuAction[0] }>
						Container 1
					</MenuItem>

					<MenuItem caption="Item 2" show={ 'disable' } action={ menuAction[1] }>
						Container 2
					</MenuItem>

					<MenuItem caption="Item 3" show={ 'hide' } action={ menuAction[2] }>
						Container 3
					</MenuItem>

					<div>Decorator 4</div>

					<MenuItem caption="Item 5" action={ menuAction[4] }>
						Container 5
					</MenuItem>
				</MenuBar>
			)
		})

		it( 'should call menu item action on click', async ()=>{
			await userEvent.click( screen.getByText( 'Item 1' ) )
			
			expect( menuAction[ 0 ] ).toHaveBeenCalled()
			expect( menuAction[ 1 ] ).not.toHaveBeenCalled()
			expect( menuAction[ 2 ] ).not.toHaveBeenCalled()
			expect( menuAction[ 4 ] ).not.toHaveBeenCalled()
		})

		it( 'should show container on click', async ()=>{
			await userEvent.click( screen.getByText( 'Decorator 4' ) )

			expect( screen.queryByText( 'Container 1' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 5' ) ).not.toBeInTheDocument()
		})

		it( 'should not show on click on disabled item', async ()=>{
			await userEvent.click( screen.getByText( 'Item 2' ) )

			expect( screen.queryByText( 'Container 1' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
		})
		
		it( 'should notify on click', async ()=>{
			await userEvent.click( screen.getByText( 'Item 1' ) )

			expect( menuItemClicked ).toHaveBeenCalledWith( expect.objectContaining({
				props: expect.objectContaining({ caption: 'Item 1' })
			}), 0 )
		})
		
		it( 'should not notify on click on disabled item', async ()=>{
			await userEvent.click( screen.getByText( 'Item 2' ) )

			expect( menuItemClicked ).not.toHaveBeenCalled()
		})

	})

	describe( 'Default active', ()=>{

		it( 'should show container 0 as active container', ()=>{
			render(
				<MenuBar activeIndex={ 0 }>
					<MenuItem caption="Item 1" action={ menuAction[0] }>
						Container 1
					</MenuItem>

					<MenuItem caption="Item 2" show={ 'disable' } action={ menuAction[1] }>
						Container 2
					</MenuItem>

					<MenuItem caption="Item 3" show={ 'hide' } action={ menuAction[2] }>
						Container 3
					</MenuItem>

					<div>Decorator 4</div>

					<MenuItem caption="Item 5" action={ menuAction[4] }>
						Container 5
					</MenuItem>
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
				<MenuBar activeIndex={ 3 }>
					<MenuItem caption="Item 1" action={ menuAction[0] }>
						Container 1
					</MenuItem>

					<MenuItem caption="Item 2" show={ 'disable' } action={ menuAction[1] }>
						Container 2
					</MenuItem>

					<MenuItem caption="Item 3" show={ 'hide' } action={ menuAction[2] }>
						Container 3
					</MenuItem>

					<div>Decorator 4</div>

					<MenuItem caption="Item 5" action={ menuAction[4] }>
						Container 5
					</MenuItem>
				</MenuBar>
			)

			expect( screen.queryByText( 'Container 1' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 5' ) ).not.toBeInTheDocument()
		})

		it( 'should show change activeIndex programmatically', async ()=>{
			const rerender = render(
				<MenuBar activeIndex={ 3 }>
					<MenuItem caption="Item 1" action={ menuAction[0] }>
						Container 1
					</MenuItem>

					<MenuItem caption="Item 2" show={ 'disable' } action={ menuAction[1] }>
						Container 2
					</MenuItem>

					<MenuItem caption="Item 3" show={ 'hide' } action={ menuAction[2] }>
						Container 3
					</MenuItem>

					<div>Decorator 4</div>

					<MenuItem caption="Item 5" action={ menuAction[4] }>
						Container 5
					</MenuItem>
				</MenuBar>
			)

			rerender.rerender(
				<MenuBar activeIndex={ 0 }>
					<MenuItem caption="Item 1" action={ menuAction[0] }>
						Container 1
					</MenuItem>

					<MenuItem caption="Item 2" show={ 'disable' } action={ menuAction[1] }>
						Container 2
					</MenuItem>

					<MenuItem caption="Item 3" show={ 'hide' } action={ menuAction[2] }>
						Container 3
					</MenuItem>

					<div>Decorator 4</div>

					<MenuItem caption="Item 5" action={ menuAction[4] }>
						Container 5
					</MenuItem>
				</MenuBar>
			)

			expect( screen.queryByText( 'Container 1' ) ).toBeInTheDocument()
			expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 5' ) ).not.toBeInTheDocument()
		})

	})
	
	describe( 'Menu item has JSX Element', ()=>{
	
		beforeEach(()=>{

			render(
				<MenuBar>
					<MenuItem caption={<div>Item 1 as menu button</div>} action={ menuAction[0] }>
						Container 1
					</MenuItem>

					<MenuItem caption={<div>Item 2 as menu button</div>} show={ 'disable' } action={ menuAction[1] }>
						Container 2
					</MenuItem>

					<MenuItem caption={<div>Item 3 as menu button</div>} show={ 'hide' } action={ menuAction[2] }>
						Container 3
					</MenuItem>

					<div>Decorator 4</div>

					<MenuItem caption={<div>Item 5 as menu button</div>} action={ menuAction[4] }>
						Container 5
					</MenuItem>
				</MenuBar>
			)
		})
	
		it( 'should show menu components instead of menu buttons', ()=>{
			expect(	screen.getByText( 'Item 1 as menu button' ) ).toBeInTheDocument()
			expect(	screen.getByText( 'Item 2 as menu button' ) ).toBeInTheDocument()
			expect(	screen.queryByText( 'Item 3 as menu button' ) ).not.toBeInTheDocument()
			expect( screen.getByText( 'Decorator 4' ) ).toBeVisible()
			expect(	screen.getByText( 'Item 5 as menu button' ) ).toBeInTheDocument()
		})

		it( 'should not show any container as default', ()=>{
			expect( screen.queryByText( 'Container', { exact: false } ) ).not.toBeInTheDocument()
		})

		it( 'should show container on click', async ()=>{
			await userEvent.click( screen.getByText( 'Item 5 as menu button' ) )

			expect( screen.queryByText( 'Container 1' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
			expect( screen.queryByText( 'Container 5' ) ).toBeInTheDocument()
		})

		it( 'should add css class _active_ on click', async ()=>{
			await userEvent.click( screen.getByText( 'Decorator 4' ) )

			expect(	screen.getByText( 'Item 1 as menu button' ) ).not.toHaveClass( 'active' )
			expect(	screen.getByText( 'Item 2 as menu button' ) ).not.toHaveClass( 'active' )
			expect(	screen.getByText( 'Decorator 4' ) ).not.toHaveClass( 'active' )
			expect(	screen.getByText( 'Item 5 as menu button' ) ).not.toHaveClass( 'active' )
		})

		it( 'should add css class _disabled_ if disabled', ()=>{
			expect(	screen.getByText( 'Item 1 as menu button' ) ).not.toHaveClass( 'disabled' )
			expect(	screen.getByText( 'Item 2 as menu button' ) ).toHaveClass( 'disabled' )
			expect(	screen.getByText( 'Decorator 4' ) ).not.toHaveClass( 'disabled' )
			expect(	screen.getByText( 'Item 5 as menu button' ) ).not.toHaveClass( 'disabled' )
		})

		it( 'should not allow to click on disabled menu item', done =>{
			userEvent.click( screen.getByText( 'Item 2 as menu button' ) ).catch( ()=>{

				// expect(
				// 	()=> await userEvent.click( screen.getByText( 'Item 2 as menu button' ) ) 
				// ).toThrow()

				expect( screen.queryByText( 'Container 1' ) ).not.toBeInTheDocument()
				expect( screen.queryByText( 'Container 2' ) ).not.toBeInTheDocument()
				expect( screen.queryByText( 'Container 3' ) ).not.toBeInTheDocument()
				expect( screen.queryByText( 'Container 4' ) ).not.toBeInTheDocument()
				expect( screen.queryByText( 'Container 5' ) ).not.toBeInTheDocument()
				done()
			})
		})
				
	})
})