'use client'
import { useState } from 'react'

export default function FileUpload({ onUpload, disabled }: { onUpload: (file: File) => void, disabled?: boolean }) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')

  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]

  const handleFile = (file: File) => {
    if (disabled) return

    if (!validTypes.includes(file.type)) {
      setError('Only PDF, DOCX, or TXT files allowed')
      return
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File is too large! Maximum size is 10MB')
      return
    }

    setError('')
    onUpload(file)
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
        className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 shadow-sm
          ${disabled
            ? 'border-slate-200 bg-slate-100/50 cursor-not-allowed opacity-60'
            : dragOver
            ? 'border-indigo-500 bg-indigo-50/60 scale-[1.01] cursor-pointer'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/80 cursor-pointer'
          }`}
      >
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-3xl">
            📄
          </div>
        </div>

        <p className="text-slate-900 font-semibold text-lg mb-1">
          {dragOver ? 'Drop it here!' : 'Drag & drop your file here'}
        </p>
        <p className="text-slate-500 text-sm mb-6">or click to browse from your computer</p>

        <label className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200
          ${disabled
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer hover:shadow-lg hover:shadow-indigo-500/25'
          }`}>
          <span>Browse File</span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt"
            disabled={disabled}
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
        </label>

        <p className="text-slate-400 text-xs mt-4">Maximum file size: 10MB</p>
      </div>

      {error && (
        <div className="mt-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}