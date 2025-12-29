'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { sendBridgeMessage } from '@/lib/whatsapp'

export default function BridgeForm({ reservationId, userId }: { reservationId: string, userId: string }) {
  const [contacts, setContacts] = useState([{ name: '', phone: '' }, { name: '', phone: '' }, { name: '', phone: '' }])
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [bridgePrepared, setBridgePrepared] = useState(false)

  useEffect(() => {
    // Verificar si bridge_prepared está activo
    const checkStatus = async () => {
      const { data } = await supabase
        .from('users')
        .select('bridge_prepared')
        .eq('id', userId)
        .single()
      setBridgePrepared(data?.bridge_prepared)
    }
    checkStatus()
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Obtener datos del usuario
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      const { data: reservation } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', reservationId)
        .single()

      // Actualizar bridge_requests
      await supabase
        .from('bridge_requests')
        .update({
          contact_1: `${contacts[0].name}|${contacts[0].phone}`,
          contact_2: `${contacts[1].name}|${contacts[1].phone}`,
          contact_3: `${contacts[2].name}|${contacts[2].phone}`,
          status: 'pending',
        })
        .eq('reservation_id', reservationId)

      // Enviar mensajes
      await Promise.all(
        contacts.map(contact => 
          sendBridgeMessage(contact.phone, user.name, user.destination_country, reservation.total_estimate)
        )
      )

      setSent(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800">✅ Mensajes enviados. Esperando respuestas...</p>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-yellow-800 mb-4">
        🌉 {bridgePrepared ? 'Tu Puente está preparado' : '¿Necesitas apoyo? Activa tu Puente Solidario'}
      </h3>
      <p className="text-yellow-700 mb-6">
        {bridgePrepared 
          ? 'Rellena los contactos de tu red de apoyo. Ellos recibirán el mensaje.' 
          : 'Si no puedes pagar el saldo, 3 personas pueden ayudarte con US$200 cada una — sin intereses.'}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <input
              placeholder="Nombre del contacto"
              value={contact.name}
              onChange={(e) => {
                const newContacts = [...contacts]
                newContacts[index].name = e.target.value
                setContacts(newContacts)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              placeholder="WhatsApp (+1234567890)"
              value={contact.phone}
              onChange={(e) => {
                const newContacts = [...contacts]
                newContacts[index].phone = e.target.value
                setContacts(newContacts)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Activando...' : bridgePrepared ? 'Activar Puente' : 'Solicitar Apoyo'}
        </button>
      </form>
    </div>
  )
}

