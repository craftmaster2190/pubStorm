package main

import "github.com/StefanSchroeder/Golang-Ellipsoid/ellipsoid"

type Earth struct {
  geo ellipsoid.Ellipsoid
}

func NewEarth() *Earth {
  return &Earth{
    geo: ellipsoid.Init("WGS84",
      ellipsoid.Degrees,
      ellipsoid.Meter,
      ellipsoid.LongitudeIsSymmetric,
      ellipsoid.BearingIsSymmetric),
  }
}

/**
 * Returns Meters
 */
func (earth *Earth) DistanceBetween(lat1, lon1, lat2, lon2 float64) float64 {
  distance, _ := earth.geo.To(lat1, lon1, lat2, lon2)
  return distance
}

/**
 * Returns Meters
 */
func (earth *Earth) DistanceBetween2(location1, location2 *Location) float64 {
  return earth.DistanceBetween(location1.latitude, location1.latitude, location2.latitude, location2.longitude)
}

/**
 * bearing [0..360)
 * distance Meters
 */
func (earth *Earth) ComputeLocation(lat float64, long float64, bearing float64, distance float64) (float64, float64) {
  return earth.geo.At(lat, long, distance, bearing)
}

/**
 * bearing [0..360)
 * distance Meters
 */
func (earth *Earth) ComputeLocation2(location *Location, bearing, distance float64) *Location {
  latitude, longitude := earth.ComputeLocation(location.latitude, location.longitude, bearing, distance)
  return &Location{latitude: latitude, longitude: longitude}
}
