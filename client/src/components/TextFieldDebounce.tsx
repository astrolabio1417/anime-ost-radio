import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'

import useDebounce from '../hooks/debounce'

interface TextFieldDebounceProps {
  label: string
  defaultValue?: string
  onChange: (value: string) => void
}

export default function TextFieldDebounce(props: TextFieldDebounceProps) {
  const [query, setQuery] = useState(props.defaultValue ?? '')
  const queryValue = useDebounce<string>(query, 500)

  useEffect(() => {
    props.onChange?.(queryValue)
    // eslint-disable-next-line
  }, [queryValue])

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setQuery(e.target.value ?? '')
  }

  return <TextField fullWidth label={props.label} value={query} sx={{ boxShadow: 3 }} onChange={onChange} />
}
