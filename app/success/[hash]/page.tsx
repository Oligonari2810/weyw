'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type PageProps = {
  params: {
    hash: string;
  };
};

export default function SuccessPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Datos del formulario
  const [form, setForm] = useState({
    applicantFirstName: '',
    applicantLastName: '',
    applicantPassport: '',
    applicantBirthDate: '',
    passengerCount: '4',
    guarantor1: '',
    guarantor2: '',
    guarantor3: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Primero intentamos update, si no existe la fila, hacemos upsert
      const { data: existingData, error: checkError } = await supabase
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
            // Datos del pasaporte (obligatorio para reserva aérea)
            first_name: form.applicantFirstName,
            last_name: form.applicantLastName,
            passport_number: form.applicantPassport,
            birth_date: form.applicantBirthDate,
            
            // Garantes comunitarios (validación social)
            community_guarantors: JSON.stringify([
              { email: form.guarantor1, name: 'Garante 1' },
              { email: form.guarantor2, name: 'Garante 2' },
              { email: form.guarantor3, name: 'Garante 3' },
            ]),
            
            // Estatus de verificación
            kyc_status: 'pending_guarantors', // Esperando validación
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
            community_guarantors: JSON.stringify([
              { email: form.guarantor1, name: 'Garante 1' },
              { email: form.guarantor2, name: 'Garante 2' },
              { email: form.guarantor3, name: 'Garante 3' },
            ]),
            kyc_status: 'pending_guarantors',
            deposit_paid: true,
          });
        error = insertError;
      }

      if (error) {
        console.error('Error:', error);
        alert(`Error al guardar datos: ${error.message}. Contacta soporte.`);
      } else {
        // Redirige a dashboard del usuario
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error inesperado:', err);
      alert('Error inesperado. Contacta soporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      {/* HEADER DE CONFIANZA */}
      <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded">
        <h1 className="text-2xl font-bold text-green-800">✅ Pago Confirmado: US$99</h1>
        <p className="text-green-700 mt-2">
          Tu depósito está seguro. Ahora necesitamos estos datos para bloquear tu vuelo.
        </p>
      </div>

      {/* INDICADOR DE PROGRESO */}
      <div className="flex mb-8">
        <div className="flex-1 text-center">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">1</div>
          <p className="text-sm">Pago</p>
        </div>
        <div className="flex-1 text-center border-t-2 border-blue-500 mt-4"></div>
        <div className="flex-1 text-center">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">2</div>
          <p className="text-sm font-bold">Datos</p>
        </div>
        <div className="flex-1 text-center border-t-2 border-gray-300 mt-4"></div>
        <div className="flex-1 text-center">
          <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">3</div>
          <p className="text-sm">Confirmación</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECCIÓN: DATOS DE PASAPORTE */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            📋 Datos para Reserva Aérea
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Exactamente como aparecen en tu pasaporte. Obligatorio por ley aérea.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre(s) *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                value={form.applicantFirstName}
                onChange={(e) => setForm({...form, applicantFirstName: e.target.value})}
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
                onChange={(e) => setForm({...form, applicantLastName: e.target.value})}
                required
                placeholder="GONZALEZ PEREZ"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Pasaporte *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                value={form.applicantPassport}
                onChange={(e) => setForm({...form, applicantPassport: e.target.value})}
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
                onChange={(e) => setForm({...form, applicantBirthDate: e.target.value})}
                required
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN: GARANTES COMUNITARIOS */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            👥 Comunidad de Garantes (3 personas)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Para validar tu identidad social. Tus garantes NO pagan nada, solo confirman que te conocen.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Garante 1 (familiar) *
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-3 py-2"
                value={form.guarantor1}
                onChange={(e) => setForm({...form, guarantor1: e.target.value})}
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
                value={form.guarantor2}
                onChange={(e) => setForm({...form, guarantor2: e.target.value})}
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
                value={form.guarantor3}
                onChange={(e) => setForm({...form, guarantor3: e.target.value})}
                required
                placeholder="vecina.ana@gmail.com"
              />
            </div>
          </div>

          {/* INFO DE SEGURIDAD */}
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              🔒 Todos los datos están encriptados. Tus garantes solo reciben un email de verificación.
            </p>
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando datos...' : '✅ Bloquear mi vuelo ahora'}
          </button>

          {/* MENSAJE DE URGENCIA */}
          <p className="text-center text-sm text-gray-600 mt-4">
            ⚠️ Completa en las próximas 24 horas o tu depósito será devuelto automáticamente
          </p>
        </div>
      </form>

      {/* FOOTER DE CONFIANZA */}
      <div className="mt-8 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="text-green-500 text-2xl">✓</div>
            <p className="text-sm text-gray-600 ml-2">Datos seguros</p>
          </div>
          <div className="flex items-center">
            <div className="text-green-500 text-2xl">✓</div>
            <p className="text-sm text-gray-600 ml-2">Autorizado por IATA</p>
          </div>
          <div className="flex items-center">
            <div className="text-green-500 text-2xl">✓</div>
            <p className="text-sm text-gray-600 ml-2">Reembolsable*</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          *Términos aplican según tu fecha de vuelo y estado de la ruta
        </p>
      </div>
    </div>
  );
}

