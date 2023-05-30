import { Beach as BeachModel } from '@prisma/client'

enum GeoPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

class Beach {
  id?: string
  name: string
  position: GeoPosition
  lat: number
  lng: number
  userId: string

  private constructor({ id, name, position, lat, lng, userId }: Beach) {
    this.id = id
    this.name = name
    this.position = position
    this.lat = lat
    this.lng = lng
    this.userId = userId
  }

  public static create({
    id,
    name,
    position,
    lat,
    lng,
    userId,
  }: BeachModel): Beach {
    const beach: Beach = {
      id,
      name,
      position: GeoPosition[position as keyof typeof GeoPosition],
      lat,
      lng,
      userId,
    }
    return beach
  }
}

export { GeoPosition, Beach }
