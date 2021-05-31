// A custom configuration is required as we need to designate a `TZ` env var,
// however, `autoDetect` will instruct Wallaby to configure everything else
// automatically. If the `TZ` value is updated here, it should also be updated
// in the script params within package.json.
module.exports = () => {
  process.env.TZ = "UTC"

  return { autoDetect: true }
}
