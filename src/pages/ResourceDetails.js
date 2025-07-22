"use client"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { resourcesAPI } from "../services/api"
import toast from "react-hot-toast"
import LoadingSpinner from "../components/common/LoadingSpinner"

const ResourceDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: resource, isLoading } = useQuery(["resource", id], () => resourcesAPI.getById(id))

  const markCompleteMutation = useMutation(() => resourcesAPI.markComplete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["resource", id])
      queryClient.invalidateQueries("resources")
      queryClient.invalidateQueries("summary")
      toast.success("Resource marked as completed!")
    },
    onError: () => {
      toast.error("Failed to update resource")
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!resource?.data) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Resource not found</h2>
        <button onClick={() => navigate("/dashboard")} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const resourceData = resource.data

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "article":
        return "📄"
      case "video":
        return "🎥"
      case "quiz":
        return "❓"
      case "book":
        return "📖"
      case "course":
        return "🎓"
      default:
        return "📚"
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/dashboard")} className="btn btn-secondary">
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Resource Details</h1>
      </div>

      <div className="card">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">{resourceData.title}</h1>

          <div className="flex items-center gap-4 mb-4">
            <span className="resource-type">
              {getTypeIcon(resourceData.type)} {resourceData.type}
            </span>
            <span className="resource-category">{resourceData.category?.name || "Uncategorized"}</span>
            <span className={`completion-status ${resourceData.isCompleted ? "completed" : "pending"}`}>
              {resourceData.isCompleted ? "✅ Completed" : "⏳ Pending"}
            </span>
          </div>

          {resourceData.description && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-secondary leading-relaxed">{resourceData.description}</p>
            </div>
          )}

          <div className="grid grid-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium text-sm text-secondary mb-1">Created</h4>
              <p>{new Date(resourceData.createdAt).toLocaleDateString()}</p>
            </div>
            {resourceData.completedAt && (
              <div>
                <h4 className="font-medium text-sm text-secondary mb-1">Completed</h4>
                <p>{new Date(resourceData.completedAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {!resourceData.isCompleted && (
            <button
              onClick={() => markCompleteMutation.mutate()}
              disabled={markCompleteMutation.isLoading}
              className="btn btn-success"
            >
              {markCompleteMutation.isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  Updating...
                </>
              ) : (
                "✅ Mark as Completed"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResourceDetails
