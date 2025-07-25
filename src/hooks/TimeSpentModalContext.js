import { createContext, useContext, useState } from "react"
import toast from "react-hot-toast"

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
    if (!actualTime || Number(actualTime) <= 0) {
      toast.error("Please enter the actual time spent (in minutes).")
      return
    }
    onSubmit(actualTime)
    setShowModal(false)
    setActualTime("")
  }

  const value = {
    showModal,
    actualTime,
    setActualTime,
    openModal,
    closeModal,
    handleSubmit,
  }

  return (
    <TimeSpentModalContext.Provider value={value}>
      {children}
    </TimeSpentModalContext.Provider>
  )
}

export const useTimeSpentModal = () => useContext(TimeSpentModalContext)
