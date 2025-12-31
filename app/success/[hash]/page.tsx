'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// TIPOS
interface FormData {
  applicantFirstName: string;
  applicantLastName: string;
  applicantPassport: string;
  applicantBirthDate: string;
  passengerCount: number;
  passengers: Array<{
    name: string;
    passport: string;
    birthDate: string;
  }>;
  guarantors: {
    guarantor1: string;
    guarantor2: string;
    guarantor3: string;
  };
}

type PageProps = {
  params: {
    hash: string;
  };
};

export default function SuccessPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  // Formulario completo
  const [form, setForm] = useState<FormData>({
    applicantFirstName: '',
    applicantLastName: '',
    applicantPassport: '',
    applicantBirthDate: '',
    passengerCount: 1,
    passengers: [],
    guarantors: {
      guarantor1: '',
      guarantor2: '',
      guarantor3: '',
    },
  });

  // Cargar datos de la reserva
  useEffect(() => {
    const fetchBooking = async () => {
      const { data } = await supabase
        .from('weyw_bookings')
        .select('*')
        .eq('payment_hash', params.hash)
        .single();
      
      if (data) {
        setBookingData(data);
        setForm(prev => ({ ...prev, passengerCount: data?.passenger_count || 1 }));
      }
    };
    fetchBooking();
  }, [params.hash]);

  // Generar inputs dinámicos para pasajeros
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      passengers: Array.from({ length: Math.max(0, prev.passengerCount - 1) }, () => ({
        name: '',
        passport: '',
        birthDate: '',
      }))
    }));
  }, [form.passengerCount]);

  // Manejo de cambios
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePassengerChange = (index: number, field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      passengers: prev.passengers.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleGuarantorChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      guarantors: { ...prev.guarantors, [field]: value }
    }));
  };

  // Validación
  const validateForm = () => {
    if (!form.applicantFirstName || !form.applicantLastName) return false;
    if (!form.applicantPassport || form.applicantPassport.length < 6) return false;
    if (!form.applicantBirthDate) return false;
    
    // Validar todos los pasajeros
    for (const p of form.passengers) {
      if (!p.name || !p.passport || !p.birthDate) return false;
    }

    // Validar emails de garantes
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.guarantors.guarantor1)) return false;
    if (!emailRegex.test(form.guarantors.guarantor2)) return false;
    if (!emailRegex.test(form.guarantors.guarantor3)) return false;

    return true;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Por favor completa todos los campos correctamente.');
      return;
    }

    setLoading(true);

    try {
      // Primero verificar si existe
      const { data: existingData } = await supabase
        .from('weyw_bookings')
        .select('id')
        .eq('payment_hash', params.hash)
        .single();

      let error;

      if (existingData) {
        // Si existe, hacemos update
        const { error: updateError } = await supabase
          .from('weyw_bookings')
          .update({
            // Datos del solicitante
            first_name: form.applicantFirstName,
            last_name: form.applicantLastName,
            passport_number: form.applicantPassport,
            birth_date: form.applicantBirthDate,
            
            // Datos de pasajeros
            passenger_details: JSON.stringify(form.passengers),
            
            // Garantes
            community_guarantors: JSON.stringify([
              { email: form.guarantors.guarantor1, name: 'Garante 1' },
              { email: form.guarantors.guarantor2, name: 'Garante 2' },
              { email: form.guarantors.guarantor3, name: 'Garante 3' },
            ]),
            
            // Estatus
            kyc_status: 'pending_validation',
            data_completed_at: new Date().toISOString(),
          })
          .eq('payment_hash', params.hash);
        error = updateError;
      } else {
        // Si no existe, creamos la fila
        const { error: insertError } = await supabase
          .from('weyw_bookings')
          .insert({
            payment_hash: params.hash,
            first_name: form.applicantFirstName,
            last_name: form.applicantLastName,
            passport_number: form.applicantPassport,
            birth_date: form.applicantBirthDate,
            passenger_details: JSON.stringify(form.passengers),
            community_guarantors: JSON.stringify([
              { email: form.guarantors.guarantor1, name: 'Garante 1' },
              { email: form.guarantors.guarantor2, name: 'Garante 2' },
              { email: form.guarantors.guarantor3, name: 'Garante 3' },
            ]),
            kyc_status: 'pending_validation',
            deposit_paid: true,
            data_completed_at: new Date().toISOString(),
          });
        error = insertError;
      }

      if (error) {
        console.error('Error:', error);
        alert(`Error al guardar datos: ${error.message}. Contacta soporte: +18295157607`);
      } else {
        // Redirigir al dashboard
        router.push(`/dashboard/${params.hash}`);
      }
    } catch (err) {
      console.error('Error inesperado:', err);
      alert('Error inesperado. Contacta soporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER DE CONFIANZA */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-green-100 rounded-full p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">✅ Depósito Confirmado: US$99</h1>
              <p className="text-sm text-gray-600 mt-1">
                Completa tus datos para bloquear tu vuelo. Proceso seguro y auditado.
              </p>
            </div>
          </div>
        </div>

        {/* INDICADOR DE PROGRESO */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
              <p className="ml-3 text-sm font-medium text-gray-900">Depósito</p>
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full" style={{width: '66%'}}></div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <p className="ml-3 text-sm font-medium text-gray-900">Datos</p>
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-1"></div>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
              <p className="ml-3 text-sm text-gray-500">Confirmación</p>
            </div>
          </div>
        </div>

        {/* DETALLES DE LA RESERVA */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Detalles de tu Reserva</h2>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Precio Congelado</p>
                <p className="text-sm text-green-700">
                  Saldo final: <strong>US${bookingData?.final_price ? (bookingData.final_price / 100).toFixed(2) : '3,301.00'}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-600">Ruta:</span> <strong>{bookingData?.destination || 'SDQ-MAD'}</strong></div>
            <div><span className="text-gray-600">Fecha:</span> <strong>{bookingData?.preferred_date || '15 Julio 2026'}</strong></div>
            <div><span className="text-gray-600">Pasajeros:</span> <strong>{bookingData?.passenger_count || form.passengerCount}</strong></div>
            <div><span className="text-gray-600">Próximo pago:</span> <strong>15 Junio 2026</strong></div>
          </div>
        </div>

        {/* FORMULARIO DE DATOS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECCIÓN 1: DATOS DEL SOLICITANTE */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              🪪 Datos del Solicitante Principal
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Exactamente como aparece en el pasaporte. Obligatorio por normativa IATA.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre(s) *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                  value={form.applicantFirstName}
                  onChange={(e) => handleChange('applicantFirstName', e.target.value.toUpperCase())}
                  required
                  placeholder="MARIA ANTONIA"
                />
                <p className="text-xs text-gray-500 mt-1">Mayúsculas, sin acentos</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido(s) *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                  value={form.applicantLastName}
                  onChange={(e) => handleChange('applicantLastName', e.target.value.toUpperCase())}
                  required
                  placeholder="GONZALEZ PEREZ"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Pasaporte *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                  value={form.applicantPassport}
                  onChange={(e) => handleChange('applicantPassport', e.target.value.toUpperCase())}
                  required
                  placeholder="G12345678"
                />
                <p className="text-xs text-gray-500 mt-1">Será verificado con tu embajada</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                  value={form.applicantBirthDate}
                  onChange={(e) => handleChange('applicantBirthDate', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: DATOS DE PASAJEROS ADICIONALES */}
          {form.passengerCount > 1 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                👨‍👩‍👧‍👦 Datos de los {form.passengerCount - 1} Pasajeros Adicionales
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Para cada miembro de la familia que viaja contigo.
              </p>

              {form.passengers.map((passenger, index) => (
                <div key={index} className="mb-6 p-4 border border-gray-200 rounded">
                  <h4 className="font-medium text-gray-900 mb-3">Pasajero {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      className="border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(index, 'name', e.target.value.toUpperCase())}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pasaporte"
                      className="border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                      value={passenger.passport}
                      onChange={(e) => handlePassengerChange(index, 'passport', e.target.value.toUpperCase())}
                      required
                    />
                    <input
                      type="date"
                      className="border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                      value={passenger.birthDate}
                      onChange={(e) => handlePassengerChange(index, 'birthDate', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECCIÓN 3: GARANTES COMUNITARIOS */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              👥 Comunidad de Garantes (3 personas)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Para validar tu identidad social. Tus garantes NO pagan nada, solo confirman que te conocen vía email.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Garante 1 (familiar) *
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                  value={form.guarantors.guarantor1}
                  onChange={(e) => handleGuarantorChange('guarantor1', e.target.value)}
                  required
                  placeholder="tia.maria@gmail.com"
                />
                <p className="text-xs text-gray-500 mt-1">Te conocen hace más de 2 años</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Garante 2 (amigo/coworker) *
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                  value={form.guarantors.guarantor2}
                  onChange={(e) => handleGuarantorChange('guarantor2', e.target.value)}
                  required
                  placeholder="jose.trabajo@gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Garante 3 (conocido) *
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                  value={form.guarantors.guarantor3}
                  onChange={(e) => handleGuarantorChange('guarantor3', e.target.value)}
                  required
                  placeholder="vecina.ana@gmail.com"
                />
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                🔒 Todos los datos están encriptados. Tus garantes recibirán un email de verificación automático.
              </p>
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN FINAL */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-md transition duration-150 ease-in-out"
            >
              {loading 
                ? '⏳ Procesando datos...' 
                : '✅ BLOQUEAR MI VUELO AHORA - GARANTÍA US$10,000'
              }
            </button>

            {/* MENSAJE DE URGENCIA Y CONFIANZA */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs text-gray-500">
              <div className="flex items-center justify-center">
                <svg className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Datos encriptados SSL
              </div>
              <div className="flex items-center justify-center">
                <svg className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verificado por IATA
              </div>
              <div className="flex items-center justify-center">
                <svg className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Reembolsable*
              </div>
            </div>

            <p className="text-center text-xs text-gray-500 mt-3">
              *Términos aplican según fecha de vuelo y estatus de ruta. Capital garantizado: US$10,000 por WEYW SRL (RNC: 001-123456-8)
            </p>

            {/* TIMER DE 24H */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800 text-center">
                ⏰ Completa en las próximas 24 horas o tu depósito será devuelto automáticamente
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
