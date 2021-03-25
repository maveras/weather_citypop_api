const formatCities = (res) => {
  const formatCities = res.map(city => {
    return {
      city: city.place_name,
      lat: city.center[1],
      lon: city.center[0]
    }
  })
  return formatCities
}

module.exports = formatCities