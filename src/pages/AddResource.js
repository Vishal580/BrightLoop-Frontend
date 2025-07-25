import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { resourcesAPI, categoriesAPI } from "../services/api"
import toast from "react-hot-toast"
import LoadingSpinner from "../components/common/LoadingSpinner"

const AddResource = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: "",
    type: "Article",
    category: "",
    description: "",
    newCategory: "",
    estimatedTime: "",
  })

  const { data: categories } = useQuery("categories", categoriesAPI.getAll)

  const createResourceMutation = useMutation((data) => resourcesAPI.create(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("resources")
      queryClient.invalidateQueries("summary")
      toast.success("Resource added successfully!")
      navigate("/dashboard")
    },
    onError: () => {
      toast.error("Failed to add resource")
    },
  })

  const createCategoryMutation = useMutation((data) => categoriesAPI.create(data), {
    onSuccess: async (response) => {
      await queryClient.invalidateQueries("categories") // Ensure categories are refetched
      setFormData((prev) => ({
        ...prev,
        category: response.data._id, // Select the new category
        newCategory: "",
      }))
      toast.success("Category created successfully!")
    },
    onError: () => {
      toast.error("Failed to create category")
    },
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCreateCategory = async () => {
    if (!formData.newCategory.trim()) {
      toast.error("Please enter a category name")
      return
    }

    await createCategoryMutation.mutateAsync({
      name: formData.newCategory.trim(),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.category) {
      toast.error("Please select a category")
      return
    }

    const resourceData = {
      title: formData.title,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime, 10) : 0,
    }

    createResourceMutation.mutate(resourceData)
  }

  const categoriesList = categories?.data?.categories || []

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/dashboard")} className="btn btn-secondary">
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Add New Resource</h1>
      </div>

      <div className="card" style={{ maxWidth: "600px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type" className="form-label">
              Type *
            </label>
            <select
              id="type"
              name="type"
              className="form-select"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="Article">Article</option>
              <option value="Video">Video</option>
              <option value="Quiz">Quiz</option>
              <option value="Book">Book</option>
              <option value="Course">Course</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category *
            </label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categoriesList.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Create New Category</label>
            <div className="flex gap-4">
              <input
                type="text"
                name="newCategory"
                className="form-input"
                placeholder="Enter new category name"
                value={formData.newCategory}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={createCategoryMutation.isLoading}
                className="btn btn-secondary"
              >
                {createCategoryMutation.isLoading ? <LoadingSpinner size="small" /> : "Create"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description of the resource..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="estimatedTime" className="form-label">
              Estimated Time (in minutes)
            </label>
            <input
              type="number"
              id="estimatedTime"
              name="estimatedTime"
              className="form-input"
              value={formData.estimatedTime}
              onChange={handleChange}
              min={0}
              placeholder="e.g. 60"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                createResourceMutation.isLoading ||
                createCategoryMutation.isLoading ||
                !formData.title.trim() ||
                !["Article", "Video", "Quiz", "Book", "Course"].includes(formData.type) ||
                !formData.category
              }
              className="btn btn-primary"
            >
              {createResourceMutation.isLoading ? <LoadingSpinner size="small" /> : "Add Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddResource
