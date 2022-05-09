# Frontend Unit Tests Guidelines

## why

![Testing pyramid](https://martinfowler.com/articles/practical-test-pyramid/testPyramid.png 'Testing pyamid')

Unit tests form the solid base of the testing pyramid. They are the cheapest kinds of tests to run, and can be run frequently throughout the deployment pipeline. Unit tests allow us to find errors the soonest, and to fix them before they bubble up in other, more expensive kinds of testing like functional or UI tests, which take much longer to complete and run than unit tests.

## Unit test vs Integrated (cypress) Testing

Unit tests are written to verify individual pieces of code unlike integrated testing (like cypress), which is used to test whole module end to end. Unit tests are also meant to run very often compared to integrated tests. So the tests shouldn complete in few seconds opposed to few minutes or hours.

## What to mock

- Mock every network interactions like api, websocket , etc by mocking the modules which uses them
- Mock all browser interactions outside of component rendering like `localStorage`,popups,console methods, service workers, notifications, etc.
- Mock dependant modules when those modules are not part of the logic of components

## General rules

Following rules to be followed while writting unit tests.

- Prefer component testing over individual implementation details like reducer, hooks, utility methods unless there is a significant logic is involved
- Prefer multiple simple tests than one big tests
- Test cases shouldn't expect to have any state
- There shouldn't be any expectations on order of execution of states
- Each test cases should be self contained and shouldn't depend on any other test cases

## Tools

Frontend project is boostrapped with create-react-app. So out of the box, it supports jest as test runner. To make it easier to maintain unit tests, `@testing-library/react` library shall be used

## Examples

Following examples are created to get familiarize with `@testing-library/react` and `@testing-libary/userEvent`. Once familiarized with these libraries, follow best practices mentioned here [Common mistakes with react-testing-library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Basic rendering

These are the simplest level of tests. These tests would only verify whether the component is rendering without any issues.

```js
import App from '../App'
import { render, cleanup } from '@testing-library/react'

describe('Basic smoke tests', () => {
  it('tests component renders without error', () => {
    render(<App />)
  })

  it('tests component renders with expected text', () => {
    const result = render(<App />)
    expect(result.queryByText(/Hello/i)).toBeTruthy()
  })
})
```

**[Live example](https://codesandbox.io/s/smoke-tests-jdz1ge?file=/src/_tests_/App.test.js)**

### Basic event Handling

These tests simulate simple events like click and may involve simple state. We use @testing-library/user-event 14.x to simulate user interactions

```js
import App from '../App'
import { render, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Testing components with simple state', () => {
  it('tests increment and decrement', async () => {
    const result = render(<App />)
    const incrementButton = result.getByTestId('increment-button')
    const decrementButton = result.getByTestId('decrement-button')
    const countDisplay = result.getByTestId('count')
    expect(countDisplay.textContent).toBe('count: 0')

    await userEvent.click(incrementButton)
    expect(countDisplay.textContent).toBe('count: 1')
    await userEvent.click(decrementButton)
    expect(countDisplay.textContent).toBe('count: 0')
  })
})
```

[Live Example](https://codesandbox.io/s/simple-event-handling-mqemmf?file=/src/_tests_/App.spec.js:0-778)

### Keyboard events handling

We will be using `@testing-library/userEvent` to simulate keyboard events

```js
import { App } from '../App'
import { render, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const getInput = (result) =>
  result.container.querySelector('input[type="text"]')

const getOptions = (result) => result.queryAllByRole('option')

describe('keyboard event', () => {
  it('Tests typing just c', async () => {
    const result = render(<App />)
    const inputElement = getInput(result)

    await userEvent.type(inputElement, 'c')
    expect(getOptions(result).length).toBe(7)
  })

  it('Test typing  Company7', async () => {
    const result = render(<App />)
    const inputElement = getInput(result)

    await userEvent.type(inputElement, 'company7')
    const options = getOptions(result)
    expect(options.length).toBe(1)
    expect(options[0].textContent).toBe('company7')
  })
})
```

[Live Example](https://codesandbox.io/s/unit-testing-with-keyboard-events-pt9qqs?file=/src/_tests_/App.spec.js)

### Complex components with http requests

Unit tests not supposed to make any network requests. So whenever testing components involving external apis and other operations, need to mock the required modules

```js
import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import segmentApi from '@edulastic/api/src/segment'
import userApi from '@edulastic/api/src/user'
import PrivacyPolicyModal from './index'

jest.mock('react-redux')
jest.mock('@edulastic/common')
jest.spyOn(userApi, 'eulaPolicyStatusUpdate')

jest.spyOn(segmentApi, 'genericEventTrack')
segmentApi.genericEventTrack = jest.fn()

describe('PrivacyModal component', () => {
  test('rendernormally and button click working', async () => {
    userApi.eulaPolicyStatusUpdate = jest
      .fn()
      .mockReturnValue(Promise.resolve({}))
    const result = render(<PrivacyPolicyModal userID="testUserId" />)
    const acceptButton = result.getByTestId('acceptButton')
    expect(acceptButton).toBeDisabled()
    const checkbox = result.getByTestId('check')
    await userEvent.click(checkbox)
    expect(acceptButton).not.toBeDisabled()
    await userEvent.click(acceptButton)
    expect(userApi.eulaPolicyStatusUpdate).toBeCalled()
  })
})
```

[example](https://github.com/snapwiz/edulastic-poc/blob/036c3832ae6d037158e267c3413ed3fbce959696/src/client/privacyPolicy/privacyPolicy.spec.js#L7-L8)

### How to run

Run all the spec files
yarn test

Run specific spec file
yarn test <spec_path>
example : yarn run src/client/privacyPolicy/privacyPolicy.spec.js
