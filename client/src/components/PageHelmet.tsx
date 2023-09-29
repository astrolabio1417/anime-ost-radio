import { Helmet } from 'react-helmet-async'

interface PageHelmetProps {
  title: string
  description?: string
}

export default function PageHelmet(props: PageHelmetProps) {
  const { description, title } = props
  return (
    <Helmet>
      <title>{title ?? 'AnimeBeats - Anime Music'}</title>
      <meta
        name="description"
        content={
          description ?? 'AnimeBeats is a digital music service that gives you access to thousands of anime songs.'
        }
      />
    </Helmet>
  )
}
