export interface Session {
  id: number
  track_id: number
  duration?: string
  condition?: 'GOOD' | 'MEDIUM' | 'HEAVY'
  created_at: string
}

export interface Track {
  id: number
  name: string
  location?: string
  lon?: string
  lat?: string
  created_at: string
}