// components/Sections/Matricula.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Phone, Mail, MapPin, Calendar, User, BookOpen, ChevronRight, MessageCircle, UserCheck, Home, FileText } from 'lucide-react';

// Esquema de validación con Zod - ACTUALIZADO
const formSchema = z.object({
  // Información del estudiante
  nombreEstudiante: z.string()
    .min(2, "Nombre debe tener al menos 2 caracteres")
    .regex(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, "El nombre solo puede contener letras"),
  
  fechaNacimiento: z.string()
    .min(1, "Fecha de nacimiento requerida")
    .refine((fecha) => {
      const nacimiento = new Date(fecha);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      
      return edad >= 5 && edad <= 25;
    }, "El estudiante debe tener entre 5 y 25 años"),
  
  direccion: z.string()
    .min(5, "Dirección requerida (mínimo 5 caracteres)"),
  
  // Información del encargado
  nombreEncargado: z.string()
    .min(2, "Nombre del encargado requerido")
    .regex(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, "El nombre solo puede contener letras"),
  
  telefono: z.string()
    .min(8, "Teléfono requerido")
    .regex(/^\+?504\s?\d{4}-?\d{4}$/, "Formato inválido. Use: +504 0000-0000"),
  
  email: z.string()
    .email("Email inválido")
    .optional()
    .or(z.literal('')),
  
  // Información académica
  carrera: z.string().min(1, "Selecciona una carrera"),
  grado: z.string().min(1, "Selecciona un grado"),
  mensaje: z.string().optional()
});type FormData = z.infer<typeof formSchema>;

const carreras = [
  { id: 'btp', nombre: 'BTP en Informática', grados: ['10mo Grado', '11vo Grado', '12vo Grado'] },
  { id: 'bch', nombre: 'Bachillerato en Ciencias y Humanidades (BCH)', grados: ['10mo Grado', '11vo Grado'] },
  { id: 'ciclo', nombre: 'Ciclo Común (7mo - 8vo - 9no)', grados: ['7mo Grado', '8vo Grado', '9no Grado'] }
];

export default function Matricula() {
  // ✅ LOS HOOKS DEBEN ESTAR DENTRO DEL COMPONENTE
  const [selectedCarrera, setSelectedCarrera] = useState('');
  const [gradosDisponibles, setGradosDisponibles] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const handleCarreraChange = (carreraId: string) => {
    setSelectedCarrera(carreraId);
    const carrera = carreras.find(c => c.id === carreraId);
    setGradosDisponibles(carrera?.grados || []);
    setValue('grado', ''); // Resetear grado al cambiar carrera
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      console.log('📝 Enviando datos al servidor...', data);
      
      // Enviar a la API route
      const response = await fetch('/api/matriculas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Mostrar pantalla de éxito
        setShowSuccess(true);
        console.log('🎉 Formulario enviado exitosamente');
      } else {
        setSubmitError(result.error || 'Error al guardar los datos. Por favor intenta nuevamente.');
        console.error('❌ Error del servidor:', result.error);
      }
    } catch (error) {
      console.error('💥 Error en el formulario:', error);
      setSubmitError('Error de conexión. Por favor contacta al instituto directamente por WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const enviarWhatsApp = (data: FormData) => {
    const carreraNombre = carreras.find(c => c.id === data.carrera)?.nombre;
    const mensaje = `*SOLICITUD DE MATRÍCULA - INSTITUTO POMPILIO ORTEGA*%0A%0A` +
                   `*ESTUDIANTE:*%0A` +
                   `👤 ${data.nombreEstudiante}%0A` +
                   `📅 Fecha Nacimiento: ${data.fechaNacimiento}%0A` +
                   `🏠 Dirección: ${data.direccion}%0A%0A` +
                   `*ENCARGADO:*%0A` +
                   `👨‍💼 ${data.nombreEncargado}%0A` +
                   `📞 ${data.telefono}%0A` +
                   `📧 ${data.email || 'No proporcionado'}%0A%0A` +
                   `*INFORMACIÓN ACADÉMICA:*%0A` +
                   `🎓 ${carreraNombre}%0A` +
                   `📚 ${data.grado}%0A` +
                   `💬 ${data.mensaje || 'Sin mensaje adicional'}`;

    window.open(`https://wa.me/504TU_NUMERO?text=${mensaje}`, '_blank');
  };

  const contactoDirecto = () => {
    const mensaje = `Hola, me interesa matricular a mi hijo/hija en el Instituto Pompilio Ortega. ¿Podrían ayudarme con el proceso?`;
    window.open(`https://wa.me/504TU_NUMERO?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const resetForm = () => {
    setShowForm(false);
    setShowSuccess(false);
    setSelectedCarrera('');
    setGradosDisponibles([]);
    reset();
  };

  return (
    <section id="matricula" className="py-24 bg-gradient-to-br from-white via-[#F9F7F4] to-[#F4F1EA] relative overflow-hidden">
      {/* Grid decorativo de fondo */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="matricula-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#434343" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#matricula-grid)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-[2px] bg-gradient-to-r from-transparent to-[#9CA98C]"
            />
            <div className="w-2 h-2 bg-[#9CA98C] rotate-45" />
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-[2px] bg-gradient-to-l from-transparent to-[#9CA98C]"
            />
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-[#434343] mb-6 font-serif">
            Proceso de Matrícula
          </h2>
          <p className="text-xl text-[#434343]/70 max-w-3xl mx-auto font-sans leading-relaxed">
            Elige la opción que mejor se adapte a tus necesidades
          </p>
        </motion.div>

        {/* Pantalla de Elección Inicial */}
        {!showForm && !showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8 mb-8"
          >
            {/* Opción 1: Formulario Completo */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white border-2 border-[#9CA98C]/30 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              style={{ 
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
              }}
              onClick={() => setShowForm(true)}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#434343] to-[#666666] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-[#9CA98C] group-hover:to-[#7D8A6E] transition-all duration-300">
                  <FileText className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-[#434343] mb-4 font-serif">
                  Formulario Completo
                </h3>
                <p className="text-[#434343]/70 mb-6 font-sans leading-relaxed">
                  Completa toda la información requerida para una pre-matrícula formal. Ideal para usuarios que prefieren el proceso digital.
                </p>
                <div className="flex items-center justify-center gap-2 text-[#9CA98C] font-bold font-sans">
                  <span>Iniciar Formulario</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Opción 2: WhatsApp Directo */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              style={{ 
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
              }}
              onClick={contactoDirecto}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-all duration-300">
                  <MessageCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                  WhatsApp Directo
                </h3>
                <p className="text-white/90 mb-6 font-sans leading-relaxed">
                  Contacta directamente con nuestro equipo para atención personalizada. Perfecto para padres que prefieren asistencia inmediata.
                </p>
                <div className="flex items-center justify-center gap-2 text-white font-bold font-sans">
                  <span>Contactar Ahora</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Formulario Principal */}
        {showForm && !showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border-2 border-[#9CA98C]/30 p-8 shadow-2xl rounded-2xl"
            style={{ 
              clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
            }}
          >
            {/* Header del Formulario */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-[#434343] font-serif flex items-center gap-3">
                <FileText className="w-7 h-7 text-[#9CA98C]" />
                Formulario de Matrícula
              </h3>
              <motion.button
                onClick={resetForm}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 border border-[#9CA98C] text-[#9CA98C] hover:bg-[#9CA98C] hover:text-white transition-all duration-300 rounded-lg font-sans text-sm"
              >
                Volver
              </motion.button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Información del Estudiante */}
<div className="border-b border-[#9CA98C]/20 pb-6">
  <h3 className="text-xl font-bold text-[#434343] mb-4 font-serif flex items-center gap-3">
    <User className="w-6 h-6 text-[#9CA98C]" />
    Información del Estudiante
  </h3>
  
  <div className="grid md:grid-cols-2 gap-4">
    {/* Nombre Estudiante - Solo letras */}
    <div>
      <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
        Nombre Completo del Estudiante *
      </label>
      <input
        {...register('nombreEstudiante')}
        className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 focus:border-[#9CA98C] focus:outline-none transition-all duration-300 font-sans text-[#434343] placeholder:text-[#434343]/40 bg-white rounded-lg"
        placeholder="Nombre y apellido del estudiante"
        pattern="[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+"
        title="Solo se permiten letras"
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-zÁáÉéÍíÓóÚúÑñ\s]/g, '');
        }}
      />
      {errors.nombreEstudiante && (
        <p className="text-red-500 text-sm mt-1">{errors.nombreEstudiante.message}</p>
      )}
    </div>

    {/* Fecha Nacimiento - Validación de edad */}
    <div>
      <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
        Fecha de Nacimiento *
      </label>
      <input
        type="date"
        {...register('fechaNacimiento')}
        className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 focus:border-[#9CA98C] focus:outline-none transition-all duration-300 font-sans text-[#434343] bg-white rounded-lg"
        max={new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split('T')[0]}
        min={new Date(new Date().setFullYear(new Date().getFullYear() - 25)).toISOString().split('T')[0]}
      />
      {errors.fechaNacimiento && (
        <p className="text-red-500 text-sm mt-1">{errors.fechaNacimiento.message}</p>
      )}
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-bold text-[#434343] mb-2 font-sans flex items-center gap-2">
        <Home className="w-4 h-4" />
        Dirección de Residencia *
      </label>
      <input
        {...register('direccion')}
        className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 focus:border-[#9CA98C] focus:outline-none transition-all duration-300 font-sans text-[#434343] placeholder:text-[#434343]/40 bg-white rounded-lg"
        placeholder="Dirección completa donde reside el estudiante"
      />
      {errors.direccion && (
        <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>
      )}
    </div>
  </div>
</div>

            {/* Información del Encargado */}
<div className="border-b border-[#9CA98C]/20 pb-6">
  <h3 className="text-xl font-bold text-[#434343] mb-4 font-serif flex items-center gap-3">
    <UserCheck className="w-6 h-6 text-[#9CA98C]" />
    Información del Encargado
  </h3>
  
  <div className="grid md:grid-cols-2 gap-4">
    {/* Nombre Encargado - Solo letras */}
    <div>
      <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
        Nombre del Encargado *
      </label>
      <input
        {...register('nombreEncargado')}
        className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 focus:border-[#9CA98C] focus:outline-none transition-all duration-300 font-sans text-[#434343] placeholder:text-[#434343]/40 bg-white rounded-lg"
        placeholder="Nombre completo del padre/madre/tutor"
        pattern="[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+"
        title="Solo se permiten letras"
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-zÁáÉéÍíÓóÚúÑñ\s]/g, '');
        }}
      />
      {errors.nombreEncargado && (
        <p className="text-red-500 text-sm mt-1">{errors.nombreEncargado.message}</p>
      )}
    </div>

    {/* Teléfono - Solo números formato Honduras */}
    <div>
      <label className="block text-sm font-bold text-[#434343] mb-2 font-sans flex items-center gap-2">
        <Phone className="w-4 h-4" />
        Teléfono *
      </label>
      <input
        {...register('telefono')}
        className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 focus:border-[#9CA98C] focus:outline-none transition-all duration-300 font-sans text-[#434343] placeholder:text-[#434343]/40 bg-white rounded-lg"
        placeholder="+504 0000-0000"
        pattern="\+?504\s?\d{4}-?\d{4}"
        title="Formato: +504 0000-0000"
        onInput={(e) => {
          // Permitir solo números, +, espacios y guiones
          e.currentTarget.value = e.currentTarget.value.replace(/[^\d+\s-]/g, '');
        }}
      />
      {errors.telefono && (
        <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
      )}
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-bold text-[#434343] mb-2 font-sans flex items-center gap-2">
        <Mail className="w-4 h-4" />
        Correo Electrónico (Opcional)
      </label>
      <input
        type="email"
        {...register('email')}
        className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 focus:border-[#9CA98C] focus:outline-none transition-all duration-300 font-sans text-[#434343] placeholder:text-[#434343]/40 bg-white rounded-lg"
        placeholder="encargado@email.com"
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
      )}
    </div>
  </div>
</div>

              {/* Información Académica */}
              <div className="pb-6">
                <h3 className="text-xl font-bold text-[#434343] mb-4 font-serif flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-[#9CA98C]" />
                  Información Académica
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
                      Carrera de Interés *
                    </label>
                    <select
                      {...register('carrera')}
                      onChange={(e) => handleCarreraChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 focus:border-[#9CA98C] focus:outline-none transition-all duration-300 font-sans text-[#434343] bg-white rounded-lg"
                    >
                      <option value="">Selecciona una carrera</option>
                      {carreras.map((carrera) => (
                        <option key={carrera.id} value={carrera.id}>{carrera.nombre}</option>
                      ))}
                    </select>
                    {errors.carrera && (
                      <p className="text-red-500 text-sm mt-1">{errors.carrera.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
                      Grado *
                    </label>
                    <select
                      {...register('grado')}
                      disabled={!selectedCarrera}
                      className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 focus:border-[#9CA98C] focus:outline-none transition-all duration-300 font-sans text-[#434343] bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{selectedCarrera ? 'Selecciona un grado' : 'Primero selecciona carrera'}</option>
                      {gradosDisponibles.map((grado) => (
                        <option key={grado} value={grado}>{grado}</option>
                      ))}
                    </select>
                    {errors.grado && (
                      <p className="text-red-500 text-sm mt-1">{errors.grado.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#434343] mb-2 font-sans">
                      Mensaje Adicional (Opcional)
                    </label>
                    <textarea
                      {...register('mensaje')}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-[#9CA98C]/30 focus:border-[#9CA98C] focus:outline-none transition-all duration-300 font-sans text-[#434343] placeholder:text-[#434343]/40 bg-white rounded-lg resize-none"
                      placeholder="Información adicional que consideres importante..."
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`flex-1 py-4 font-bold transition-all duration-300 font-sans rounded-lg flex items-center justify-center gap-3 shadow-lg ${
                    isSubmitting 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[#434343] to-[#666666] text-white hover:from-[#9CA98C] hover:to-[#7D8A6E]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Guardando en sistema...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Solicitud
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={contactoDirecto}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-4 border-2 border-[#25D366] text-[#25D366] font-bold hover:bg-[#25D366] hover:text-white transition-all duration-300 font-sans rounded-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Directo
                </motion.button>
              </div>

              {/* Mensaje de error */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>{submitError}</span>
                  </div>
                  <p className="text-sm mt-2">
                    Puedes contactarnos directamente por WhatsApp para asistencia inmediata.
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>
        )}

        {/* Pantalla de Éxito */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-[#9CA98C]/30 p-8 shadow-2xl rounded-2xl text-center"
            style={{ 
              clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Send className="w-10 h-10 text-white" />
            </motion.div>
            
            <h3 className="text-2xl font-bold text-[#434343] mb-4 font-serif">
              ¡Formulario Completado!
            </h3>
            
            <p className="text-[#434343]/70 mb-6 font-sans max-w-md mx-auto">
              Tu información ha sido guardada exitosamente. Ahora puedes enviar los detalles por WhatsApp para finalizar el proceso de matrícula.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={resetForm}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 border-2 border-[#9CA98C] text-[#9CA98C] font-bold rounded-full font-sans"
              >
                Nuevo Formulario
              </motion.button>
              
              <motion.button
                onClick={() => enviarWhatsApp(watch())}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-[#25D366] text-white font-bold rounded-full font-sans flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Enviar por WhatsApp
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}