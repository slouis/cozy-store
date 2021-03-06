'use strict'

/* eslint-env jest */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { tMock } from '../../../jestLib/I18n'
import { Discover } from 'ducks/apps/components/Discover'

import mockApps from '../_mockApps'

Enzyme.configure({ adapter: new Adapter() })

const mockError = new Error('This is a test error')

const mockRegistyApps = mockApps
  .filter(app => app.isInRegistry)
  .filter(
    app => Array.isArray(app.versions.stable) && !!app.versions.stable.length
  )

const getMockProps = (
  apps = mockRegistyApps,
  isFetching = false,
  fetchError = null,
  match = { isExact: true }
) => ({
  fetchApps: jest.fn(),
  apps,
  isFetching,
  fetchError,
  actionError: null,
  history: { push: jest.fn() },
  match
})

describe('Discover component', () => {
  it('should be rendered correctly with apps', () => {
    const mockProps = getMockProps()
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a spinner if apps is fetching', () => {
    const mockProps = getMockProps([], true, null)
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should display error from props correctly', () => {
    const mockProps = getMockProps([], false, mockError)
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not render apps list if !match.isExact', () => {
    const mockProps = getMockProps(mockRegistyApps, false, null, {
      isExact: false
    })
    const component = shallow(
      <Discover t={tMock} {...mockProps} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should define the correct onAppClick function to pass to sections', () => {
    const mockProps = getMockProps()
    const component = shallow(<Discover t={tMock} {...mockProps} />)
    const instance = component.instance()
    instance.onAppClick(mockRegistyApps[0].slug)
    expect(mockProps.history.push.mock.calls.length).toBe(1)
    expect(mockProps.history.push.mock.calls[0][0]).toBe(
      `/discover/${mockRegistyApps[0].slug}`
    )
  })
})
