'use client';
import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { planSchema } from '@psyplan/shared';
import { Button, Input, Textarea, Select, Checkbox, ImagePicker, Card } from '@psyplan/ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {  plan } = useQuery({ queryKey: ['plan', id], queryFn: () => api.get(`/plans/${id}`) });
  const {  images } = useQuery({ queryKey: ['images'], queryFn: () => api.get('/images') });
  const [selectedImages, setSelectedImages] = useState<string[]>(plan?.content?.images || []);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: plan
  });

  const updateMutation = useMutation({
    mutationFn: ( any) => api.put(`/plans/${id}`, { ...data, images: selectedImages }),
    onSuccess: () => { toast.success('Planeación actualizada'); window.location.href = '/plans'; }
  });

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Planeación #{id}</h1>
      <form onSubmit={handleSubmit(data => updateMutation.mutate(data))} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Select label="Tipo" {...register('type')}>
            <option value="DAILY">Diaria</option>
            <option value="WEEKLY">Semanal</option>
          </Select>
          <Input label="Grado" {...register('grade')} />
        </div>

        <Checkbox label="Adecuaciones por N.E.E." {...register('specialNeeds')} />
        {watch('specialNeeds') && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
            <Textarea label="Diagnóstico / Perfil" {...register('diagnosis')} />
            <Textarea label="Adecuaciones Curriculares" {...register('accommodations')} />
            <Textarea label="Objetivos IEP" {...register('iepGoals')} />
          </div>
        )}

        <Textarea label="Contenidos y Actividades" rows={6} {...register('content')} />

        <div className="space-y-2">
          <label className="text-sm font-medium">Imágenes y Soportes Visuales</label>
          <ImagePicker 
            images={images} 
            selected={selectedImages} 
            onToggle={id => setSelectedImages(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} 
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancelar</Button>
        </div>
      </form>
    </Card>
  );
}