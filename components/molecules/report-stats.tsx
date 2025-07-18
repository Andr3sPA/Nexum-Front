import React from "react"
import { ReportStatCard } from "@/components/atoms/report-stat-card"
import { GraduateReportResponse } from "@/lib/services/profile/report.service"

export interface ReportStatsProps {
  data: GraduateReportResponse
  className?: string
}

export const ReportStats: React.FC<ReportStatsProps> = ({ data, className }) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 ${className}`}>
      <ReportStatCard
        title="Total Egresados"
        value={data.totalGraduates}
        variant="primary"
      />
      <ReportStatCard
        title="Mujeres"
        value={data.womanCount}
        subtitle={`${data.womanPercentage.toFixed(1)}%`}
        variant="info"
      />
      <ReportStatCard
        title="Hombres"
        value={data.manCount}
        subtitle={`${data.manPercentage.toFixed(1)}%`}
        variant="primary"
      />
      <ReportStatCard
        title="No Binario"
        value={data.nonBinaryCount}
        subtitle={`${data.nonBinaryPercentage.toFixed(1)}%`}
        variant="secondary"
      />
      <ReportStatCard
        title="Otro"
        value={data.otherCount}
        subtitle={`${data.otherPercentage.toFixed(1)}%`}
        variant="warning"
      />
    </div>
  )
} 