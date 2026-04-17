import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#f8fafc' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#0f172a' },
  section: { marginBottom: 16, padding: 16, backgroundColor: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#334155' },
  text: { fontSize: 11, lineHeight: 1.5, color: '#475569' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  image: { width: 80, height: 80, objectFit: 'contain', borderRadius: 4 }
});

const PlanDocument = ({ data, images }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>Planeación {data.type === 'DAILY' ? 'Diaria' : 'Semanal'} - {data.grade}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.title}>Información del Estudiante</Text>
        <Text style={styles.text}>Nombre: {data.student?.fullName || 'Grupal'}</Text>
        {data.specialNeeds && (
          <>
            <Text style={styles.text}>Diagnóstico: {data.diagnosis}</Text>
            <Text style={styles.text}>Adecuaciones: {data.accommodations}</Text>
            <Text style={styles.text}>IEP Goals: {data.iepGoals}</Text>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Contenidos y Actividades</Text>
        <Text style={styles.text}>{data.content}</Text>
      </View>

      {images && images.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.title}>Soportes Visuales y Recursos</Text>
          <View style={styles.imageGrid}>
            {images.map(img => (
              <Image key={img.id} style={styles.image} src={img.url} />
            ))}
          </View>
        </View>
      )}

      <View style={{ marginTop: 30, borderTop: '1px solid #cbd5e1', paddingTop: 10 }}>
        <Text style={{ fontSize: 9, color: '#64748b' }}>Generado por PsyPlan Pro | {new Date().toLocaleDateString()}</Text>
      </View>
    </Page>
  </Document>
);

export const generatePDF = async (data, images) => {
  const blob = await pdf(<PlanDocument data={data} images={images} />).toBlob();
  return blob;
};