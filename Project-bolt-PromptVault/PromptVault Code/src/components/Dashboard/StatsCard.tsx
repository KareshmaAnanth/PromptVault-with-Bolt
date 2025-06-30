import React from 'react'
import { DivideIcon as LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  description: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-teal-600/20 rounded-lg">
            <Icon className="w-6 h-6 text-teal-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.isPositive ? '+' : '-'}{trend.value}%
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold text-white">{value}</div>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  )
}