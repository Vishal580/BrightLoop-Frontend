"use client"
import { Link } from "react-router-dom"
import { useMutation, useQueryClient } from "react-query"
import { resourcesAPI } from "../../services/api"
import toast from "react-hot-toast"

const ResourceCard = ({ resource }) => {
  const queryClient = useQueryClient()

  const markCompleteMutation = useMutation(() => resourcesAPI.markComplete(resource._id), {
    onSuccess: () => {
      queryClient.invalidateQueries("resources")
      queryClient.invalidateQueries("summary")
      toast.success("Resource marked as completed!")
    },
    onError: () => {
      toast.error("Failed to update resource")
    },
  })

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "article":
        return "📄"
      case "video":
        return "🎥"
      case "quiz":
        return "❓"
      default:
        return "📚"
    }
  }

  return (
    <div className="resource-card">
      <div className="resource-card-header">
        <h3 className="resource-card-title">{resource.title}</h3>
        <div className="resource-card-meta">
          <span className="resource-type">
            {getTypeIcon(resource.type)} {resource.type}
          </span>
          <span className="resource-category">{resource.category?.name || "Uncategorized"}</span>
        </div>
        <p className="resource-card-description">{resource.description}</p>
      </div>

      <div className="resource-card-footer">
        <div className={`completion-status ${resource.isCompleted ? "completed" : "pending"}`}>
          {resource.isCompleted ? "✅ Completed" : "⏳ Pending"}
        </div>
        <div className="flex gap-2">
          <Link
            to={`/resource/${resource._id}`}
            className="btn btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.5rem 1rem" }}
          >
            View
          </Link>
          {!resource.isCompleted && (
            <button
              onClick={() => markCompleteMutation.mutate()}
              disabled={markCompleteMutation.isLoading}
              className="btn btn-success"
              style={{ fontSize: "0.75rem", padding: "0.5rem 1rem" }}
            >
              {markCompleteMutation.isLoading ? "Updating..." : "Complete"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResourceCard
