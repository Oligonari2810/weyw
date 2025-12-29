'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [d1Alerts, setD1Alerts] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
    fetchD1Alerts()
  }, [])

  const fetchStats = async () => {
    const { data: reservations } = await supabase
      .from('reservations')
      .select('*')

    const totalDeposits = reservations?.filter(r => r.deposit_paid).length || 0
    const byStatus = {
      active: reservations?.filter(r => r.status === 'active').length || 0,
      paid: reservations?.filter(r => r.status === 'paid').length || 0,
      bridge_initiated: reservations?.filter(r => r.status === 'bridge_initiated').length || 0,
    }

    setStats({ totalDeposits, byStatus })
  }

  const fetchD1Alerts = async () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const { data } = await supabase
      .from('reservations')
      .select('*, user_id (*) ')
      .eq('status', 'active')
      .lt('deadline', tomorrow.toISOString())

    setD1Alerts(data || [])
  }

  if (!stats) return <div>Cargando...</div>

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Dashboard Interno WEYW</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm text-gray-500 mb-2">Total Depósitos</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalDeposits}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm text-gray-500 mb-2">% Activas</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {((stats.byStatus.active / stats.totalDeposits) * 100).toFixed(1)}%
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm text-gray-500 mb-2">% Puente</h3>
            <p className="text-3xl font-bold text-green-600">
              {((stats.byStatus.bridge_initiated / stats.totalDeposits) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {d1Alerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-red-800 mb-4">
              🚨 Alertas D-1 sin pagar ni puente ({d1Alerts.length})
            </h3>
            {d1Alerts.map(alert => (
              <div key={alert.id} className="bg-white rounded-lg p-4 mb-2">
                <p className="font-semibold">{alert.user_id.name}</p>
                <p className="text-sm text-gray-600">{alert.user_id.phone}</p>
                <p className="text-sm text-gray-600">{alert.user_id.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

