import * as fns from "./fns"

describe("timezones", () => {
  test("should always be UTC", () =>
    expect(new Date().getTimezoneOffset()).toBe(0))
})

describe("fns", () => {
  test("gets padded number", () => {
    expect(fns.toClosestMultipleOf7(5)).toBe(7)
    expect(fns.toClosestMultipleOf7(10)).toBe(14)
    expect(fns.toClosestMultipleOf7(30)).toBe(35)
  })
})
