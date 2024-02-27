export interface WorkoutDetails {
  // required attributes for any Workout interfaces
  id: string
  title: string
  price: number
  tags: string[]

  // optional
  author?: string
  image?: string
  description?: string
  influencer_id?: string
  duration?: string
  level?: string
  file?: string
}

export interface InfluencerDetails {
  // required attributes for any Influencer interfaces
  name: string
  verified: boolean
  image: string

  // optional
  tag?: string
  slug?: string
  bio?: string
  website?: string
  youtube?: string
  twitter?: string
  instagram?: string
  workouts?: {
    id: string
    image: string
    title: string
    name: string
    price: number
    tags: string[]
    influencer_id: string
  }[]
}

export interface InfluencerRegistrationData {
  email: string
  password: string
  first_name: string
  last_name: string
  bio: string
  category: string
  instagram: string
  twitter: string
  youtube: string
  website: string
  image: File
}

export interface WorkoutPlan {
  [week: string]: {
    [day: string]: {
      workout: string
      sets?: number
      reps?: number
      rpe?: number
    }[]
  }
}

export interface WorkoutPageProps {
  params: { id: string }
}

export interface LoginData {
  email: string
  password: string
}

export interface ResetData {
  email: string
  password: string
  token: string
}
