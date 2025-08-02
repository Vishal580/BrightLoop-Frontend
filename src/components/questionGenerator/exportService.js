import jsPDF from "jspdf";

export const exportQuestionsToPDF = async (generatedQuestions, getAnswerFunction) => {
  if (!generatedQuestions) {
    throw new Error("No questions data provided");
  }

  // Load all answers first if getAnswerFunction is provided
  if (getAnswerFunction) {
    for (let question of generatedQuestions.questions) {
      if (!question.answer) {
        try {
          const response = await getAnswerFunction(question.id);
          question.answer = response.data.answer;
          question.evaluationTips = response.data.evaluationTips;
        } catch (error) {
          console.warn(`Failed to load answer for question ${question.id}`);
        }
      }
    }
  }

  const doc = new jsPDF();
  let yPosition = 20;
  const lineHeight = 6;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // Helper function to add text with word wrapping and page breaks
  const addTextWithWrapping = (text, fontSize = 12, isBold = false) => {
    doc.setFontSize(fontSize);
    if (isBold) doc.setFont(undefined, 'bold');
    else doc.setFont(undefined, 'normal');

    const lines = doc.splitTextToSize(text, 170);
    
    lines.forEach(line => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
    yPosition += 3; // Extra spacing after paragraphs
  };

  // Title
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('AI Job Interview Questions', 105, yPosition, { align: 'center' });
  yPosition += 15;

  // Job Summary
  addTextWithWrapping('Job Summary', 16, true);
  addTextWithWrapping(`Job Title: ${generatedQuestions.jobSummary.jobTitle}`);
  addTextWithWrapping(`Industry: ${generatedQuestions.jobSummary.industry}`);
  addTextWithWrapping(`Experience Level: ${generatedQuestions.jobSummary.experienceLevel}`);
  yPosition += 5;

  // Key Skills & Competencies
  addTextWithWrapping('Key Skills & Competencies', 16, true);
  addTextWithWrapping(`Personal Skills: ${generatedQuestions.keySkillsAndCompetencies.personalSkills.join(', ')}`);
  addTextWithWrapping(`Technical Skills: ${generatedQuestions.keySkillsAndCompetencies.technicalSkills.join(', ')}`);
  addTextWithWrapping(`Certifications: ${generatedQuestions.keySkillsAndCompetencies.certifications.join(', ')}`);
  addTextWithWrapping(`Core Competencies: ${generatedQuestions.keySkillsAndCompetencies.coreCompetencies.join(', ')}`);
  addTextWithWrapping(`Total Questions: ${generatedQuestions.keySkillsAndCompetencies.totalQuestions}`);
  yPosition += 5;

  // Interview Structure
  addTextWithWrapping('Recommended Interview Structure', 16, true);
  addTextWithWrapping(`Estimated Duration: ${generatedQuestions.recommendedInterviewStructure.estimatedDuration}`);
  addTextWithWrapping('Structure:', 14, true);
  addTextWithWrapping(`Introduction: ${generatedQuestions.recommendedInterviewStructure.structure.introduction}`);
  addTextWithWrapping(`Technical Assessment: ${generatedQuestions.recommendedInterviewStructure.structure.technicalAssessment}`);
  addTextWithWrapping(`Behavioral Assessment: ${generatedQuestions.recommendedInterviewStructure.structure.behavioralAssessment}`);
  addTextWithWrapping(`Closing: ${generatedQuestions.recommendedInterviewStructure.structure.closing}`);
  yPosition += 5;

  // Additional Notes
  addTextWithWrapping('Additional Notes', 16, true);
  generatedQuestions.additionalNotes.forEach((note, index) => {
    addTextWithWrapping(`${index + 1}. ${note}`);
  });
  yPosition += 5;

  // Questions
  addTextWithWrapping('Interview Questions', 16, true);
  generatedQuestions.questions.forEach((question, index) => {
    addTextWithWrapping(`Question ${index + 1}:`, 14, true);
    addTextWithWrapping(question.question, 12, true);
    addTextWithWrapping(`Style: ${question.style}`, 10);
    
    // Always include answer and evaluation tips if available
    if (question.answer) {
      yPosition += 2;
      addTextWithWrapping('Expected Answer:', 12, true);
      addTextWithWrapping(question.answer);
      
      if (question.evaluationTips) {
        yPosition += 2;
        addTextWithWrapping('Evaluation Tips:', 12, true);
        addTextWithWrapping(question.evaluationTips);
      }
    }
    yPosition += 8; // More spacing between questions
  });

  // Save the PDF
  doc.save('AI Job Interview Questions.pdf');
};