import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'

import useOutsideClick from '../hooks/outsideClick'

interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  children: React.ReactNode
  style?: React.CSSProperties
}

export default function Modal(props: ModalProps) {
  const { isOpen, onClose, children, style } = props
  const [isModalOpen, setIsModalOpen] = useState(isOpen)
  const modalRef = useRef<HTMLDialogElement>(null)
  const containerRef = useOutsideClick(() => handleClose())

  useEffect(() => setIsModalOpen(isOpen), [isOpen])

  useEffect(() => {
    const modalElement = modalRef.current
    if (!modalElement) return
    isModalOpen ? modalElement.showModal() : modalElement.close()
  }, [isModalOpen])

  function handleClose() {
    setIsModalOpen(false)
    onClose?.()
  }

  return (
    <dialog className="modal" ref={modalRef} style={{ border: 'none', padding: 0, borderRadius: 10, ...style }}>
      <IconButton title="Close" onClick={handleClose} sx={{ position: 'absolute', right: 1, top: 1 }}>
        <CloseIcon />
      </IconButton>
      <Box ref={containerRef} width="100%">
        {children}
      </Box>
    </dialog>
  )
}
