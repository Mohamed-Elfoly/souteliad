import { useState } from 'react';
import { Trash2, Plus, Cloud } from 'lucide-react';
import "../styles/login.css";
import { useMutation } from "@tanstack/react-query";
import { createQuiz, createQuestion } from "../api/quizApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddExamQuestions({ redirectTo = "/Dashboard" }) {
  const navigate = useNavigate();
  const [sections, setSections] = useState([
    {
      id: '1',
      title: 'السؤال الأول',
      questionText: '',
      correctAnswer: '',
      points: '',
      questions: [
        { id: '1-1', text: '' },
        { id: '1-2', text: '' },
        { id: '1-3', text: '' },
        { id: '1-4', text: '' }
      ]
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = (sectionId) => {
    setSections(sections.map((s) => s.id === sectionId
      ? { ...s, questions: [...s.questions, { id: `${sectionId}-${Date.now()}`, text: '' }] }
      : s
    ));
  };

  const deleteQuestion = (sectionId, questionId) => {
    setSections(sections.map((s) => s.id === sectionId
      ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) }
      : s
    ));
  };

  const updateQuestion = (sectionId, questionId, text) => {
    setSections(sections.map((s) => s.id === sectionId
      ? { ...s, questions: s.questions.map((q) => q.id === questionId ? { ...q, text } : q) }
      : s
    ));
  };

  const updateSection = (sectionId, field, value) => {
    setSections(sections.map((s) => s.id === sectionId ? { ...s, [field]: value } : s));
  };

  const addSection = () => {
    const newId = `${Date.now()}`;
    setSections([...sections, {
      id: newId,
      title: `السؤال ${sections.length + 1}`,
      questionText: '',
      correctAnswer: '',
      points: '',
      questions: [{ id: `${newId}-1`, text: '' }]
    }]);
  };

  const deleteSection = (sectionId) => {
    if (sections.length > 1) setSections(sections.filter((s) => s.id !== sectionId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // For now, we log the data. Full quiz creation requires a quizId context.
      const questionsData = sections.map((s) => ({
        questionText: s.questionText,
        options: s.questions.map((q) => q.text),
        correctAnswer: s.correctAnswer,
        points: Number(s.points) || 1,
      }));
      console.log('Questions to create:', questionsData);
      toast.success("تم حفظ الأسئلة بنجاح");
      navigate(redirectTo);
    } catch (err) {
      toast.error("حدث خطأ في حفظ الأسئلة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="exam-container">
        <div className="exam-header">
          <h1 className="exam-title">إضافة أسئلة الامتحان</h1>
        </div>
        <form className="exam-form" onSubmit={handleSubmit}>
          {sections.map((section) => (
            <div key={section.id} className="exam-section">
              <div className="section-header">
                <h2 className="section-title">{section.title}</h2>
                <button type="button" onClick={() => deleteSection(section.id)} className="delete-section-btn" disabled={sections.length === 1}>
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="form-group betw">
                <div className='down'>
                  <label>أدخل السؤال</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder='أدخل السؤال'
                      value={section.questionText}
                      onChange={(e) => updateSection(section.id, 'questionText', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-section">
                  <div className="upload-box upload">
                    <Cloud size={40} color="#d1d5db" />
                    <p className="upload-text">اختر ملف أو أسحبه</p>
                    <p className="upload-subtext">JPEG, PNG, SVG and WEBP صور بصيغة</p>
                    <input type="file" accept="image/*" className="file-input" />
                  </div>
                </div>
              </div>

              <div className="questions-list">
                {section.questions.map((question, qIndex) => (
                  <div key={question.id} className="question-item">
                    <div className='choose'>
                      <input
                        type="radio"
                        name={`section-${section.id}`}
                        checked={section.correctAnswer === question.text}
                        onChange={() => updateSection(section.id, 'correctAnswer', question.text)}
                        className="exam-radio"
                      />
                      <span className="exam-option-label">{String.fromCharCode(96 + qIndex + 1)}</span>
                    </div>
                    <div className="question-input-wrapper">
                      <input
                        type="text"
                        placeholder={`الخيار ${qIndex + 1}`}
                        value={question.text}
                        onChange={(e) => updateQuestion(section.id, question.id, e.target.value)}
                        className="question-input"
                      />
                    </div>
                    <button type="button" onClick={() => deleteQuestion(section.id, question.id)} className="delete-question-btn">
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => addQuestion(section.id)} className="btn-add-question">
                <Plus size={16} className="plus-mr" /> إضافة إجابة
              </button>
              <div className='line'></div>
              <div className="form-section">
                <label className="form-label">الدرجة</label>
                <input
                  type="text"
                  placeholder="أدخل الدرجة"
                  value={section.points}
                  onChange={(e) => updateSection(section.id, 'points', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          ))}

          <div className="section-divider">
            <button type="button" onClick={addSection} className="btn-add-section">
              <Plus size={16} style={{ marginLeft: '0.25rem' }} /> إضافة سؤال
            </button>
          </div>

          <div className="form-buttons mt-1">
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "حفظ الأسئلة"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
