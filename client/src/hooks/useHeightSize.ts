import { useEffect, useState } from 'react'

export default function useHeightSize() {
  const [windowHeight, setHeightWidth] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setHeightWidth(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { windowHeight }
}
