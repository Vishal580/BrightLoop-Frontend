import { createContext, useContext, useState } from "react"

const TimeSpentModalContext = createContext()

export const TimeSpentModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false)
  const [actualTime, setActualTime] = useState("")
  const [onSubmit, setOnSubmit] = useState(() => () => {})

  const openModal = (submitHandler) => {
    setOnSubmit(() => submitHandler)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setActualTime("")
    setOnSubmit(() => () => {})
  }

  const handleSubmit = () => {
    if (!actualTime || isNaN(actualTime)) return
    onSubmit(parseInt(actualTime, 10))
    closeModal()
  }

  return (
    <TimeSpentModalContext.Provider
      value={{
        showModal,
        actualTime,
        setActualTime,
        openModal,
        closeModal,
        handleSubmit,
      }}
    >
      {children}
    </TimeSpentModalContext.Provider>
  )
}

export const useTimeSpentModal = () => useContext(TimeSpentModalContext)
