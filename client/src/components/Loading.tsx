import Lottie from 'lottie-react'

import LoadingAnimation from '../assets/loading.json'

export default function Loading() {
  return (
    <Lottie
      style={{
        margin: 'auto',
        width: 250,
        height: 250,
      }}
      animationData={LoadingAnimation}
      loop={true}
    />
  )
}
