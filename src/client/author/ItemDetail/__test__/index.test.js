import React from 'react'
import { shallow, render } from 'enzyme'

import configureStore from '../../../configureStore'

import ItemDetail from '..'

const { store } = configureStore()

const match = {
  params: {
    _id: 0,
  },
}

describe('<ItemDetail />', () => {
  it('should render properly', () => {
    const renderedComponent = shallow(<ItemDetail />)
    expect(renderedComponent.length).toEqual(1)
  })

  it('it should contain ItemHeader component', () => {
    const renderedComponent = render(<ItemDetail store={store} match={match} />)
    expect(renderedComponent.find('ItemHeader')).toBeTruthy()
    expect(renderedComponent.find('TestItemPreview')).toBeTruthy()
    expect(renderedComponent.find('SettingBar')).toBeTruthy()
  })
})
