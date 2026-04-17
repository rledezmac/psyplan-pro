'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { planSchema, type PlanInput } from '@psyplan/shared'
import { Button, Select, Textarea, Checkbox, Card } from '@psyplan/ui'
import { usePlanStore } from '@/store'
import { generatePDF } from '@/lib/pdf'
import { toast } from 'sonner'
import { useEffect } from 'react'

export default function PlannerPage() {
  const { form, isLoading, saveOffline } = usePlanStore()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PlanInput>({
    resolver: zodResolver(planSchema),
    defaultValues: { type: 'daily', grade: '1', specialNeeds: false }
  })

  const specialNeeds = watch('specialNeeds')

  const onSubmit = async ( PlanInput) => {
    try {
      if (!navigator.onLine && form.offlineQueue) {
        await saveOffline(data)
        toast.info('Sin conexión. Planeación guardada localmente.')
        return
      }
      const blob = await generatePDF(data)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      toast.success('PDF generado correctamente')
    } catch (err) {
      toast.error('Error generando planeación')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Nueva Planeación Psicopedagógica</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Select label="Tipo" {...register('type')}>
              <option value="daily">Diaria</option>
              <option value="weekly">Semanal</option>
            </Select>
            <Select label="Grado" {...register('grade')}>
              {['Kínder 1','Kínder 2','Kínder 3','1°','2°','3°','4°','5°','6°'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Select>
          </div>

          <Checkbox label="¿Requiere adecuaciones por necesidades especiales?" {...register('specialNeeds')} />
          
          {specialNeeds && (
            <div className="space-y-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <Textarea label="Diagnóstico / Perfil" placeholder="TDAH, TEA nivel 1, Dislexia, etc." {...register('diagnosis')} />
              <Textarea label="Adecuaciones Curriculares" {...register('accommodations')} />
              <Textarea label="Objetivos IEP" {...register('iepGoals')} />
            </div>
          )}

          <Textarea label="Contenidos y Actividades" rows={6} {...register('content')} error={errors.content?.message} />
          
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isLoading} loading={isLoading}>
              Generar PDF
            </Button>
            <Button variant="outline" type="button" onClick={() => window.print()}>
              Vista Previa
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}