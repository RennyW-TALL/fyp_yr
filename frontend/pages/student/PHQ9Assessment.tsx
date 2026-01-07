import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import StudentHeader from '../../components/StudentHeader';

const PHQ9Assessment = () => {
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1));
  const [totalScore, setTotalScore] = useState(0);

  const questions = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
    "Trouble concentrating on things, such as reading the newspaper or watching television?",
    "Moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving a lot more than usual?",
    "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way?"
  ];

  const options = [
    { label: "Not at all (+0)", score: 0 },
    { label: "Several days (+1)", score: 1 },
    { label: "More than half the days (+2)", score: 2 },
    { label: "Nearly every day (+3)", score: 3 }
  ];

  const handleAnswerChange = (questionIndex: number, score: number) => {
    const newAnswers = [...answers];
    const oldScore = newAnswers[questionIndex] === -1 ? 0 : newAnswers[questionIndex];
    newAnswers[questionIndex] = score;
    setAnswers(newAnswers);
    setTotalScore(prev => prev - oldScore + score);
  };

  const resetAssessment = () => {
    setAnswers(new Array(9).fill(-1));
    setTotalScore(0);
  };

  const getResultMessage = () => {
    if (totalScore <= 4) return { level: "Minimal depression", color: "text-green-700", bg: "bg-green-50" };
    if (totalScore <= 9) return { level: "Mild depression", color: "text-yellow-700", bg: "bg-yellow-50" };
    if (totalScore <= 14) return { level: "Moderate depression", color: "text-orange-700", bg: "bg-orange-50" };
    if (totalScore <= 19) return { level: "Moderately severe depression", color: "text-red-700", bg: "bg-red-50" };
    return { level: "Severe depression", color: "text-red-800", bg: "bg-red-100" };
  };

  const result = getResultMessage();
  const allAnswered = answers.every(answer => answer !== -1);

  return (
    <>
      <StudentHeader />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to="/student/dashboard" className="flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">PHQ-9 Assessment</h1>
          <div className="mb-4">
            <p className="text-slate-600 text-sm mb-1">
              <strong>Purpose:</strong> Measures the severity of depressive symptoms.
            </p>
            <p className="text-slate-600 text-sm">
              <strong>Focus:</strong> Specifically assesses depression based on the DSM-5 diagnostic criteria for major depressive disorder (MDD)
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Disclaimer:</strong> This is a screening tool and not a medical diagnosis. 
              Please consult with a healthcare professional for proper evaluation and treatment.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-blue-900 font-semibold mb-3">PHQ-9 Management Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="text-left py-2 text-blue-900 font-medium">Score</th>
                    <th className="text-left py-2 text-blue-900 font-medium">Depression severity</th>
                    <th className="text-left py-2 text-blue-900 font-medium">Comments</th>
                  </tr>
                </thead>
                <tbody className="text-blue-800">
                  <tr className="border-b border-blue-100">
                    <td className="py-1">0-4</td>
                    <td className="py-1">Minimal or none</td>
                    <td className="py-1"></td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-1">5-9</td>
                    <td className="py-1">Mild</td>
                    <td className="py-1"></td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-1">10-14</td>
                    <td className="py-1">Moderate</td>
                    <td className="py-1"></td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="py-1">15-19</td>
                    <td className="py-1">Moderately Severe</td>
                    <td className="py-1"></td>
                  </tr>
                  <tr>
                    <td className="py-1">20-27</td>
                    <td className="py-1">Severe</td>
                    <td className="py-1"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-2 text-blue-800 text-sm">
              <p><strong>Monitor;</strong> may not require treatment (0 to 4)</p>
              <p><strong>Use clinical judgment</strong> (symptom duration, functional impairment) to determine necessity of treatment (5 to 14)</p>
              <p><strong>Warrants active treatment</strong> with psychotherapy, medications, or combination (15 to 27)</p>
            </div>
          </div>
          <p className="text-slate-600">
            Ask yourself: <strong>How often have you been bothered by the following over the past 2 weeks?</strong>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={index} className="border-b border-slate-100 pb-6 last:border-b-0">
                <h3 className="text-slate-900 font-medium mb-4">
                  {index + 1}. {question}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {options.map((option) => (
                    <label
                      key={option.score}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        answers[index] === option.score
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option.score}
                        checked={answers[index] === option.score}
                        onChange={() => handleAnswerChange(index, option.score)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-slate-900 mb-2">
                  Total Score: {totalScore}/27
                </div>
                {allAnswered && (
                  <div className={`inline-block px-4 py-2 rounded-lg ${result.bg}`}>
                    <span className={`font-semibold ${result.color}`}>
                      {result.level}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={resetAssessment}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PHQ9Assessment;