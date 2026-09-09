'use client'
import { useState } from 'react'
import { CompareResult } from '@/lib/types'

export default function Compare() {
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [selectedField, setSelectedField] = useState<string>('')
  const [result, setResult] = useState<CompareResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCompare = async () => {
    if (!file1 || !file2) {
      setError('Please upload both policy files')
      return
    }

    if (file1.name === file2.name && file1.size === file2.size) {
      setError('You uploaded the same policy twice! Please upload two different policy documents.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file1', file1)
      form.append('file2', file2)

      const res = await fetch('http://localhost:8000/compare', {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }
      setResult(data)
      setSelectedField(data.common_fields[0])
    } catch (err) {
      setError('Could not connect to backend.')
    }
    setLoading(false)
  }

  const field = result && selectedField ? result.comparison[selectedField] : null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Compare Policies</h1>
        <p className="text-slate-500 mb-8">Upload two policy documents to compare them field by field</p>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Policy 1 */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <p className="text-slate-900 font-semibold mb-3">Policy 1</p>
            <label className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
              ${file1 ? 'border-indigo-500 bg-indigo-50/40' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}>
              {file1 ? (
                <div>
                  <p className="text-2xl mb-2">✅</p>
                  <p className="text-indigo-600 font-medium text-sm">{file1.name}</p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl mb-2">📄</p>
                  <p className="text-slate-500 text-sm">Click to upload PDF / DOCX / TXT</p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files && setFile1(e.target.files[0])}
              />
            </label>
          </div>

          {/* Policy 2 */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
            <p className="text-slate-900 font-semibold mb-3">Policy 2</p>
            <label className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
              ${file2 ? 'border-purple-500 bg-purple-50/40' : 'border-slate-300 hover:border-purple-400 hover:bg-slate-50'}`}>
              {file2 ? (
                <div>
                  <p className="text-2xl mb-2">✅</p>
                  <p className="text-purple-600 font-medium text-sm">{file2.name}</p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl mb-2">📄</p>
                  <p className="text-slate-500 text-sm">Click to upload PDF / DOCX / TXT</p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files && setFile2(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Compare Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleCompare}
            disabled={loading || !file1 || !file2}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white px-10 py-3 rounded-xl font-semibold transition shadow-sm"
          >
            {loading ? 'Analysing...' : 'Compare Policies →'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            {/* Policy Titles */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 text-center">
                <p className="text-indigo-700 text-xs uppercase font-bold mb-1">Policy 1</p>
                <p className="text-slate-900 font-bold">{result.policy1_title}</p>
              </div>
              <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-4 text-center">
                <p className="text-purple-700 text-xs uppercase font-bold mb-1">Policy 2</p>
                <p className="text-slate-900 font-bold">{result.policy2_title}</p>
              </div>
            </div>

            {/* Field Selector */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-6">
              <p className="text-slate-900 font-semibold mb-4">Select a field to compare:</p>
              <div className="flex flex-wrap gap-3">
                {result.common_fields.map((field) => (
                  <button
                    key={field}
                    onClick={() => setSelectedField(field)}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition
                      ${selectedField === field
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>

            {/* Field Comparison */}
            {field && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6 text-center">
                  {selectedField} — Head to Head
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {/* Policy 1 */}
                  <div className={`rounded-xl p-5 border ${field.winner === 'policy1' ? 'border-indigo-500 bg-indigo-50/40' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-indigo-600 font-semibold text-sm">Policy 1</p>
                      {field.winner === 'policy1' && (
                        <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full border border-indigo-200 font-bold">
                          ✓ Better
                        </span>
                      )}
                    </div>
                    <p className="text-4xl font-bold text-slate-900 mb-3">{field.policy1_score}<span className="text-slate-400 text-lg">/100</span></p>
                    <div className="bg-slate-200 rounded-full h-2 mb-3">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${field.policy1_score}%` }} />
                    </div>
                    <p className="text-slate-600 text-sm">{field.policy1_summary}</p>
                  </div>

                  {/* Policy 2 */}
                  <div className={`rounded-xl p-5 border ${field.winner === 'policy2' ? 'border-purple-500 bg-purple-50/40' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-purple-600 font-semibold text-sm">Policy 2</p>
                      {field.winner === 'policy2' && (
                        <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-0.5 rounded-full border border-purple-200 font-bold">
                          ✓ Better
                        </span>
                      )}
                    </div>
                    <p className="text-4xl font-bold text-slate-900 mb-3">{field.policy2_score}<span className="text-slate-400 text-lg">/100</span></p>
                    <div className="bg-slate-200 rounded-full h-2 mb-3">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${field.policy2_score}%` }} />
                    </div>
                    <p className="text-slate-600 text-sm">{field.policy2_summary}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Overall Winner */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-slate-200 shadow-sm rounded-2xl p-6 text-center">
              <p className="text-slate-500 text-sm mb-1 font-medium">Overall Winner</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">
                🏆 {result.overall_winner === 'policy1' ? result.policy1_title : result.policy2_title}
              </p>
              <p className="text-slate-600 text-sm">{result.overall_winner_reason}</p>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}