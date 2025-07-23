import { useTimeSpentModal } from "../../hooks/TimeSpentModalContext"

const TimeSpentModal = ({ isLoading = false }) => {
  const { showModal, actualTime, setActualTime, handleSubmit, closeModal } = useTimeSpentModal()

  if (!showModal) return null

  return (
    <div className="time-spent-modal">
      <div className="time-spent-modal-content">
        <h2 className="text-xl mb-4">Enter Actual Time Spent (in minutes)</h2>
        <input
          type="number"
          className="form-input mb-4"
          value={actualTime}
          onChange={(e) => setActualTime(e.target.value)}
          placeholder="e.g. 60"
          min="0"
        />
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isLoading ? "Saving..." : "Save & Complete"}
          </button>
          <button className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimeSpentModal
