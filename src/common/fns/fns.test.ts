import * as fns from "./fns"

describe("timezones", () => {
  test("should always be UTC", () =>
    expect(new Date().getTimezoneOffset()).toBe(0))
})

describe("fns", () => {
  test("gets next multiple of 7", () => {
    expect(fns.toNextMultipleOf7(5)).toBe(7)
    expect(fns.toNextMultipleOf7(10)).toBe(14)
    expect(fns.toNextMultipleOf7(30)).toBe(35)
  })

  test("gets month text from number", () => {
    expect(fns.monthNumToText(0)).toBe("jan")
    expect(fns.monthNumToText(5)).toBe("jun")
    expect(fns.monthNumToText(11)).toBe("dec")
    expect(fns.monthNumToText(-1)).toBe("")
  })

  test("gets percentage value from total and n", () => {
    expect(fns.toPercentage(10)(1)).toBe(10)
    expect(fns.toPercentage(100)(25)).toBe(25)
    expect(fns.toPercentage(1)(1)).toBe(100)
  })

  test("gets number, rounded down", () => {
    expect(fns.toRoundedDown(1.3)).toBe(1)
    expect(fns.toRoundedDown(1.8)).toBe(1)
    expect(fns.toRoundedDown(1)).toBe(1)
  })

  test("sorts numbers by asc order", () => {
    expect(fns.sortByNumbersAsc([3, 2, 1])).toEqual([1, 2, 3])
    expect(fns.sortByNumbersAsc([2, 3, 1])).toEqual([1, 2, 3])
  })

  test("sorts numbers by desc order", () => {
    expect(fns.sortByNumbersDesc([1, 2, 3])).toEqual([3, 2, 1])
    expect(fns.sortByNumbersDesc([2, 3, 1])).toEqual([3, 2, 1])
  })

  test("sorts number decimal parts by desc order", () => {
    expect(fns.sortByDecimalPartDesc([3.1, 2.5, 1.9])).toEqual([1.9, 2.5, 3.1])
    expect(fns.sortByDecimalPartDesc([100.08, 100.09, 100.095])).toEqual([
      100.095, 100.09, 100.08
    ])
  })

  test("gets rounded percentages from list of numbers", () => {
    expect(fns.getRoundedPercentages([50])).toEqual([100])
    expect(fns.getRoundedPercentages([30, 70])).toEqual([30, 70])
    expect(fns.getRoundedPercentages([5, 10, 15, 20])).toEqual([10, 20, 30, 40])
    expect(fns.getRoundedPercentages([7, 14, 28, 46])).toEqual([7, 15, 30, 48])
  })
})
