package main

type Location struct {
  latitude  float64
  longitude float64
}

func NewLocation(latitude float64, longitude float64) *Location {
  return &Location{
    latitude: latitude,
    longitude: longitude,
  }
}
