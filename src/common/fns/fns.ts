import * as R from "ramda"

// sort fns
export const sortByNumbersAsc = R.sort((a: number, b: number) => a - b)
export const sortByNumbersDesc = R.sort((a: number, b: number) => b - a)
export const sortByDecimalPartDesc = R.sort(
  (a: number, b: number) => (b % 1) - (a % 1)
)

// transformer fns
export const toNextMultipleOf7 = (n: number) => 7 * Math.ceil(n / 7)
export const toPercentage = (total: number) => (n: number) => (n / total) * 100
export const toRoundedDown = (n: number) => Math.floor(n)

// This is not ideal, as we lose access to `Date` localization.
export const monthNumToText = (n: number) => {
  if (n < 0) return ""

  return [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec"
  ][n]
}

export const getRoundedPercentages = (ns: number[]) => {
  const total = R.sum(ns)
  const roundedPercentageSum = R.compose(
    R.sum,
    R.map(toRoundedDown),
    R.map(toPercentage(total))
  )(ns)
  let diff = 100 - roundedPercentageSum

  return R.compose(
    sortByNumbersAsc,
    R.map((n: number) => (diff-- > 0 ? n + 1 : n)),
    R.map(toRoundedDown),
    sortByDecimalPartDesc,
    R.map(toPercentage(total))
  )(ns)
}
