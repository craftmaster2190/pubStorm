package main

import "github.com/StefanSchroeder/Golang-Ellipsoid/ellipsoid"

type Earth struct {
  geo ellipsoid.Ellipsoid
}

func NewEarth() *Earth {
  return &Earth{
    geo: ellipsoid.Init("WGS84", ellipsoid.Degrees, ellipsoid.Meter, ellipsoid.LongitudeIsSymmetric, ellipsoid.BearingIsSymmetric)
  }
}
func (earth *Earth) DistanceBetween(lat1, lon1, lat2, lon2 float64) float64 {
  distance, _ := earth.geo.To(lat1, lon1, lat2, lon2)
  return distance
}

func ComputeLocation(lat float64, long float64, heading float64, distance float64) {}
