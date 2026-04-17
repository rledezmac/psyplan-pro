'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, Button, Table, Badge, ImagePreview } from '@psyplan/ui';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get('/plans')
  });

  const {  students } = useQuery({ queryKey: ['students'], queryFn: () => api.get('/students') });
  const {  images } = useQuery({ queryKey: ['images'], queryFn: () => api.get('/images?category=visual_support') });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <h2 className="text-xl font-bold mb-2">Planeaciones Recientes</h2>
        {isLoading ? <p>Cargando...</p> : (
          <Table>
            <thead>
              <tr><th>Estudiante</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id}>
                  <td>{plan.student?.fullName || 'General'}</td>
                  <td><Badge>{plan.type === 'DAILY' ? 'Diaria' : 'Semanal'}</Badge></td>
                  <td><Badge variant="success">PDF Listo</Badge></td>
                  <td>
                    <Button size="sm" asChild><Link href={`/plans/${plan.id}/edit`}>Editar</Link></Button>
                    <Button size="sm" variant="outline" onClick={() => window.open(plan.pdfUrl)}>Ver PDF</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-2">Biblioteca Visual</h2>
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 8).map(img => (
            <ImagePreview key={img.id} src={img.url} alt={img.altText} className="rounded hover:opacity-80 transition" />
          ))}
        </div>
        <Button className="mt-4 w-full" asChild><Link href="/images">Gestionar Imágenes</Link></Button>
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-2">Estudiantes</h2>
        <ul className="space-y-2">
          {students.map(stu => (
            <li key={stu.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
              <span>{stu.fullName} ({stu.grade})</span>
              {stu.specialNeeds && <Badge variant="warning">N.E.E.</Badge>}
            </li>
          ))}
        </ul>
        <Button className="mt-4 w-full" asChild><Link href="/students">Ver Todos</Link></Button>
      </Card>
    </div>
  );
}