'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FileUpload from '@/components/FileUpload'

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeoutWarning, setTimeoutWarning] = useState(false)

  const handleUpload = async (file: File) => {
    setLoading(true)
    setError('')
    setTimeoutWarning(false)

    // Show warning after 15 seconds
    const warningTimer = setTimeout(() => {
      setTimeoutWarning(true)
    }, 15000)

    // Cancel everything after 60 seconds
    const controller = new AbortController()
    const timeoutTimer = setTimeout(() => {
      controller.abort()
    }, 60000)

    try {
      const form = new FormData()
      form.append('file', file)

      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: form,
        signal: controller.signal
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      localStorage.setItem('simulationResult', JSON.stringify(data))
      router.push('/dashboard')

    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Groq is taking too long. Please try again.')
      } else {
        setError('Could not connect to backend. Make sure it is running on port 8000.')
      }
      setLoading(false)
    } finally {
      clearTimeout(warningTimer)
      clearTimeout(timeoutTimer)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center px-4">
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase">
            AI-Powered Analysis
          </span>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 text-center mb-3">
          Upload Policy Document
        </h1>
        <p className="text-slate-600 text-center mb-10">
          Drop any government policy file and get instant impact analysis across sectors and states.
        </p>

        {loading ? (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-16 text-center">
            <div className="relative mx-auto w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
            </div>
            <p className="text-slate-900 font-semibold text-lg mb-1">Analysing your policy...</p>
            {!timeoutWarning ? (
              <p className="text-slate-500 text-sm">Running AI models across 28 states and 5 sectors</p>
            ) : (
              <p className="text-amber-600 text-sm font-medium">⚠️ Taking longer than usual... Groq might be busy. Please wait.</p>
            )}
          </div>
        ) : (
          <>
            <FileUpload onUpload={handleUpload} disabled={loading} />
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl font-medium">
                ⚠️ {error}
              </div>
            )}
          </>
        )}

        <div className="flex justify-center gap-6 mt-8 text-xs text-slate-500">
          <span>✦ PDF supported</span>
          <span>✦ DOCX supported</span>
          <span>✦ TXT supported</span>
        </div>
      </div>
    </div>
  )
}