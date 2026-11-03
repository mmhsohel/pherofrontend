// components/InvoicePDF.tsx
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
const s = StyleSheet.create({ page: { padding: 36, fontSize: 12 }, h: { fontSize: 20, marginBottom: 12 }, row: { marginBottom: 6 } });

export const Invoice = ({ b }: { b: any }) => (
  <Document><Page style={s.page}>
    <Text style={s.h}>StudioSpace Invoice</Text>
    <View style={s.row}><Text>Studio: {b.studioTitle}</Text></View>
    <View style={s.row}><Text>Guest: {b.userName} ({b.userEmail})</Text></View>
    <View style={s.row}><Text>Date: {b.date}, {b.startTime}–{b.endTime}</Text></View>
    <View style={s.row}><Text>Total paid: ${b.totalPrice}</Text></View>
  </Page></Document>
);

export const InvoiceButton = ({ b }: { b: any }) => (
  <PDFDownloadLink document={<Invoice b={b} />} fileName={`invoice-${b._id}.pdf`} className="btn btn-sm btn-outline">
    Download Invoice
  </PDFDownloadLink>
);