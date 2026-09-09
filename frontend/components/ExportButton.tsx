'use client'
import { SimulationResult } from '@/lib/types'
import jsPDF from 'jspdf'

export default function ExportButton({ data }: { data: SimulationResult }) {
  const handleExport = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20

    // ── Header ──
    doc.setFillColor(15, 23, 42)
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('PolicySim — Analysis Report', 14, 25)

    y = 55

    // ── Policy Title ──
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(data.policy_title, 14, y)
    y += 10

    // ── Simulation ID ──
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(`Simulation ID: ${data.id}`, 14, y)
    y += 15

    // ── Risk Score ──
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 30)
    doc.text('Overall Risk Score', 14, y)
    y += 8

    const riskColor = data.overall_risk_score > 70
      ? [239, 68, 68]
      : data.overall_risk_score > 40
      ? [234, 179, 8]
      : [34, 197, 94]

    doc.setFillColor(riskColor[0], riskColor[1], riskColor[2])
    doc.roundedRect(14, y, 40, 14, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`${data.overall_risk_score} / 100`, 22, y + 9)
    y += 25

    // ── Sector Scores ──
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('Sector Impact Scores', 14, y)
    y += 8

    data.sectors.forEach((s) => {
      const barColor = s.sentiment === 'positive'
        ? [34, 197, 94]
        : s.sentiment === 'negative'
        ? [239, 68, 68]
        : [234, 179, 8]

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(50, 50, 50)
      doc.text(s.name, 14, y)

      // Bar background
      doc.setFillColor(220, 220, 220)
      doc.roundedRect(60, y - 5, 80, 7, 2, 2, 'F')

      // Bar fill
      doc.setFillColor(barColor[0], barColor[1], barColor[2])
      doc.roundedRect(60, y - 5, (80 * s.score) / 100, 7, 2, 2, 'F')

      // Score text
      doc.setTextColor(50, 50, 50)
      doc.text(`${s.score}/100`, 148, y)
      y += 12
    })

    y += 5

    // ── Stakeholders ──
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('Stakeholder Impact', 14, y)
    y += 8

    data.stakeholders.forEach((s) => {
      const severityColor = s.severity === 'high'
        ? [239, 68, 68]
        : s.severity === 'medium'
        ? [234, 179, 8]
        : [34, 197, 94]

      doc.setFillColor(severityColor[0], severityColor[1], severityColor[2])
      doc.circle(17, y - 2, 2, 'F')

      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 30, 30)
      doc.text(s.group, 22, y)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(80, 80, 80)
      const lines = doc.splitTextToSize(s.impact, 160)
      doc.text(lines, 22, y + 5)
      y += 10 + lines.length * 5
    })

    y += 5

    // ── Recommendations ──
    if (data.recommendations && data.recommendations.length > 0) {
      // Add new page if not enough space
      if (y > 220) {
        doc.addPage()
        y = 20
      }

      doc.setTextColor(30, 30, 30)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('AI Recommendations', 14, y)
      y += 8

      data.recommendations.forEach((r, i) => {
        if (y > 260) {
          doc.addPage()
          y = 20
        }

        const priorityColor = r.priority === 'high'
          ? [239, 68, 68]
          : r.priority === 'medium'
          ? [234, 179, 8]
          : [59, 130, 246]

        doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2])
        doc.roundedRect(14, y - 4, 18, 6, 2, 2, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(7)
        doc.setFont('helvetica', 'bold')
        doc.text(r.priority.toUpperCase(), 15.5, y)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(30, 30, 30)
        doc.text(`${i + 1}. ${r.title}`, 36, y)
        y += 6

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80, 80, 80)
        const lines = doc.splitTextToSize(r.description, 170)
        doc.text(lines, 14, y)
        y += lines.length * 5 + 6
      })
    }

    // ── State Impact ──
    if (y > 220) {
      doc.addPage()
      y = 20
    }

    doc.setTextColor(30, 30, 30)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('State-wise Impact', 14, y)
    y += 8

    data.states.forEach((s) => {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(50, 50, 50)
      doc.text(s.state, 14, y)

      doc.setFillColor(220, 220, 220)
      doc.roundedRect(60, y - 5, 80, 7, 2, 2, 'F')

      const stateColor = s.impact_score > 70
        ? [239, 68, 68]
        : s.impact_score > 40
        ? [234, 179, 8]
        : [34, 197, 94]

      doc.setFillColor(stateColor[0], stateColor[1], stateColor[2])
      doc.roundedRect(60, y - 5, (80 * s.impact_score) / 100, 7, 2, 2, 'F')

      doc.setTextColor(50, 50, 50)
      doc.text(`${s.impact_score}/100`, 148, y)
      y += 12
    })

    // ── Footer ──
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Generated by PolicySim • Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }

    // ── Save ──
    doc.save(`${data.policy_title.replace(/\s+g/, '_')}_analysis.pdf`)
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:shadow-lg hover:shadow-green-500/25"
    >
      <span>⬇</span> Export PDF
    </button>
  )
}