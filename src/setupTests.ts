// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"
import MockDate from "mockdate"
import { setupServer } from "msw/node"
import handlers from "./msw-handlers"

const server = setupServer(...handlers)

beforeAll(() => {
  /* Desired implementation:
    jest.useFakeTimers("modern")
    jest.setSystemTime(1622433600 * 1000)

    However, this produces issues because `nextTick`
    is automatically mocked:
    - https://github.com/nock/nock/issues/2200
    - https://github.com/facebook/jest/issues/10221
  */
  // Mon May 31 2021 04:00:00 GMT+0000
  MockDate.set(new Date(1622433600 * 1000))

  server.listen()
})

afterEach(() => server.resetHandlers())

afterAll(() => {
  MockDate.reset()
  server.close()
})
