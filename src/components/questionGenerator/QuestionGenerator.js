import React, { useState } from "react"
import toast from "react-hot-toast"
import "../../styles/questionGenerator.css"
import { questionGeneratorAPI } from "../../services/api"

const QuestionGenerator = () => {
  // Form state
  const [formData, setFormData] = useState({
    jobDescription: "",
    questionStyles: [],
    experienceLevel: "",
    language: "English",
    numberOfQuestions: 5,
  })

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [expandedAnswers, setExpandedAnswers] = useState(new Set())

  // Available options
  const questionStyleOptions = [
    "Behavioral", "Situational", "Technical", "Knowledge", "Terminology", "Problem-Solving"
  ]

  const experienceLevelOptions = [
    "Fresher", "Mid-Level", "Senior"
  ]

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle question style selection (max 3)
  const handleQuestionStyleToggle = (style) => {
    setFormData(prev => {
      const currentStyles = prev.questionStyles
      const isSelected = currentStyles.includes(style)

      if (isSelected) {
        return {
          ...prev,
          questionStyles: currentStyles.filter(s => s !== style)
        }
      } else if (currentStyles.length < 3) {
        return {
          ...prev,
          questionStyles: [...currentStyles, style]
        }
      } else {
        toast.error("You can select maximum 3 question styles")
        return prev
      }
    })
  }

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a .txt, .pdf, or .docx file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setSelectedFile(file);

    try {
      const response = await questionGeneratorAPI.uploadJobDescription(file);
      setFormData(prev => ({
        ...prev,
        jobDescription: response.data.content
      }));
      toast.success("Job description uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file");
      setSelectedFile(null);
    }
  };


  // Generate questions
  const handleGenerateQuestions = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.jobDescription.trim()) {
      toast.error("Job description is required")
      return
    }

    if (formData.questionStyles.length === 0) {
      toast.error("Please select at least one question style")
      return
    }

    if (!formData.experienceLevel) {
      toast.error("Please select experience level")
      return
    }

    setIsLoading(true)

    try {
      const response = await questionGeneratorAPI.generateQuestions(formData)
      setGeneratedQuestions(response.data)
      toast.success("Questions generated successfully!")
    } catch (error) {
      toast.error("Failed to generate questions")
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle answer visibility
  const toggleAnswer = async (questionId) => {
    if (expandedAnswers.has(questionId)) {
      setExpandedAnswers(prev => {
        const newSet = new Set(prev)
        newSet.delete(questionId)
        return newSet
      })
    } else {
      try {
        const response = await questionGeneratorAPI.getAnswer(questionId)
        // Store answer in the question object for display
        setGeneratedQuestions(prev => ({
          ...prev,
          questions: prev.questions.map(q =>
            q.id === questionId
              ? { ...q, answer: response.data.answer, evaluationTips: response.data.evaluationTips }
              : q
          )
        }))

        setExpandedAnswers(prev => new Set(prev).add(questionId))
      } catch (error) {
        toast.error("Failed to load answer")
      }
    }
  }

  return (
    <div className="question-generator-container">
      {/* Form Panel */}
      <div className="question-generator-form">
        <div className="form-header">
          <h2 className="text-2xl font-bold mb-4">AI Interview Question Generator</h2>
        </div>

        <form onSubmit={handleGenerateQuestions} className="question-form">
          {/* Job Description Section */}
          <div className="form-group">
            <label className="form-label">Job Description</label>
            <div className="file-upload-section">
              <input
                type="file"
                accept=".txt, .pdf, .docx"
                onChange={handleFileUpload}
                className="file-input"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="file-upload-label">
                <span>📄</span>
                {selectedFile ? selectedFile.name : "Click to upload or drag file here"}
              </label>
            </div>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Paste job description here or upload a .txt file..."
              rows="6"
              required
            />
          </div>

          {/* Question Styles Section */}
          <div className="form-group">
            <label className="form-label">Question Styles (Select up to 3)</label>
            <div className="question-styles-grid">
              {questionStyleOptions.map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleQuestionStyleToggle(style)}
                  className={`question-style-btn ${formData.questionStyles.includes(style) ? "selected" : ""
                    }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level Section */}
          <div className="form-group">
            <label className="form-label">Experience Level</label>
            <div className="experience-level-options">
              {experienceLevelOptions.map(level => (
                <label key={level} className="radio-option">
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={level}
                    checked={formData.experienceLevel === level}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Settings Section */}
          <div className="form-group">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label className="form-label">Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="English">English</option>
                </select>
              </div>
              <div className="setting-item">
                <label className="form-label">Questions</label>
                <select
                  name="numberOfQuestions"
                  value={formData.numberOfQuestions}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary generate-btn"
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Generating Questions...
              </>
            ) : (
              "Generate Questions"
            )}
          </button>
        </form>
      </div>

      {/* Results Panel */}
      <div className="question-generator-results">
        {generatedQuestions ? (
          <div className="results-content">
            <h2 className="text-2xl font-bold mb-6">Generated Questions</h2>

            {/* Job Summary */}
            <div className="result-section">
              <h3 className="section-title">Job Summary</h3>
              <div className="job-summary">
                <p><strong>Job Title:</strong> {generatedQuestions.jobSummary.jobTitle}</p>
                <p><strong>Industry:</strong> {generatedQuestions.jobSummary.industry}</p>
                <p><strong>Experience Level:</strong> {generatedQuestions.jobSummary.experienceLevel}</p>
              </div>
            </div>

            {/* Key Skills & Competencies */}
            <div className="result-section">
              <h3 className="section-title">Key Skills & Competencies</h3>
              <div className="competencies-grid">
                <div className="competency-item">
                  <h4>Personal Skills:</h4>
                  <p>{generatedQuestions.keySkillsAndCompetencies.personalSkills.join(", ")}</p>
                </div>
                <div className="competency-item">
                  <h4>Technical Skills:</h4>
                  <p>{generatedQuestions.keySkillsAndCompetencies.technicalSkills.join(", ")}</p>
                </div>
                <div className="competency-item">
                  <h4>Certifications:</h4>
                  <p>{generatedQuestions.keySkillsAndCompetencies.certifications.join(", ")}</p>
                </div>
                <div className="competency-item">
                  <h4>Core Competencies:</h4>
                  <p>{generatedQuestions.keySkillsAndCompetencies.coreCompetencies.join(", ")}</p>
                </div>
              </div>
              <p className="total-questions"><strong>Total Questions:</strong> {generatedQuestions.keySkillsAndCompetencies.totalQuestions}</p>
            </div>

            {/* Interview Structure */}
            <div className="result-section">
              <h3 className="section-title">Recommended Interview Structure</h3>
              <p><strong>Estimated Duration:</strong> {generatedQuestions.recommendedInterviewStructure.estimatedDuration}</p>

              <div className="interview-structure">
                <h4>Structure</h4>
                <div className="structure-item">
                  <h5>Introduction:</h5>
                  <p>{generatedQuestions.recommendedInterviewStructure.structure.introduction}</p>
                </div>
                <div className="structure-item">
                  <h5>Technical Assessment:</h5>
                  <p>{generatedQuestions.recommendedInterviewStructure.structure.technicalAssessment}</p>
                </div>
                <div className="structure-item">
                  <h5>Behavioral Assessment:</h5>
                  <p>{generatedQuestions.recommendedInterviewStructure.structure.behavioralAssessment}</p>
                </div>
                <div className="structure-item">
                  <h5>Closing:</h5>
                  <p>{generatedQuestions.recommendedInterviewStructure.structure.closing}</p>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="result-section">
              <h3 className="section-title">Additional Notes</h3>
              <ul className="additional-notes">
                {generatedQuestions.additionalNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>

            {/* Questions */}
            <div className="result-section">
              <h3 className="section-title">Questions</h3>
              <div className="questions-list">
                {generatedQuestions.questions.map((question, index) => (
                  <div key={question.id} className="question-card">
                    <div className="question-header">
                      <h4 className="question-title">
                        Understanding of AI technologies and their application across industries
                      </h4>
                    </div>
                    <div className="question-content">
                      <p className="question-text"><strong>{question.question}</strong></p>
                      <span className="question-style">Style: {question.style}</span>

                      <button
                        onClick={() => toggleAnswer(question.id)}
                        className="btn btn-secondary show-answer-btn"
                      >
                        {expandedAnswers.has(question.id) ? "Hide Answer" : "Show Expected Answer"}
                      </button>

                      {expandedAnswers.has(question.id) && question.answer && (
                        <div className="answer-section">
                          <div className="answer-content">
                            <h5>Show Answer</h5>
                            <p>{question.answer}</p>
                            {question.evaluationTips && (
                              <div className="evaluation-tips">
                                <h6>Evaluation Tips:</h6>
                                <p><em>{question.evaluationTips}</em></p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-content">
              <span className="no-results-icon">🤖</span>
              <h3>No Questions Generated Yet</h3>
              <p>Fill out the form and click "Generate Questions" to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionGenerator