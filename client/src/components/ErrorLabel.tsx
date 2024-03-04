import React from 'react'

interface ErrorLabelProps extends React.ComponentPropsWithoutRef<'label'> {
  message?: string
}

export default function ErrorLabel(props: ErrorLabelProps) {
  const { message, ...otherProps } = props
  if (!message) return null
  return (
    <label style={{ color: 'red' }} {...otherProps}>
      {message}
    </label>
  )
}
