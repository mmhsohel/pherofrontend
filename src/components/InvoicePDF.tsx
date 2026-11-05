"use client";
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from "@react-pdf/renderer";

// Put your logo in /public (e.g. public/logo.png) or use a full URL
const LOGO_SRC = "/logo.png";

const C = {
  brand: "#E8590C",
  ink: "#1C1917",
  muted: "#78716C",
  line: "#E7E5E4",
  soft: "#FAF8F5",
  success: "#15803D",
  successBg: "#DCFCE7",
};

const s = StyleSheet.create({
  page: {
    paddingBottom: 60,
    fontSize: 10,
    color: C.ink,
    fontFamily: "Helvetica",
  },

  // Header
  band: {
    backgroundColor: C.ink,
    paddingVertical: 22,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 32, height: 32, objectFit: "contain" },
  brand: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#FFFFFF" },
  brandAccent: { color: C.brand },
  docTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#FFFFFF", textAlign: "right" },
  docSub: { fontSize: 9, color: "#A8A29E", textAlign: "right", marginTop: 2 },
  accentBar: { height: 3, backgroundColor: C.brand },

  body: { paddingHorizontal: 40, paddingTop: 24 },

  // Meta
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  metaBox: { width: "31%" },
  label: {
    fontSize: 7.5,
    color: C.muted,
    letterSpacing: 0.8,
    marginBottom: 3,
    fontFamily: "Helvetica-Bold",
  },
  value: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  valueLight: { fontSize: 9, color: C.muted, marginTop: 2 },

  // Parties
  parties: { flexDirection: "row", marginBottom: 20, gap: 12 },
  party: { flex: 1, padding: 12, backgroundColor: C.soft, borderRadius: 4 },

  // Session
  sessionCard: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sessionCol: { width: "24%" },

  // Table
  th: {
    flexDirection: "row",
    backgroundColor: C.ink,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  thText: { color: "#FFFFFF", fontSize: 8, fontFamily: "Helvetica-Bold", letterSpacing: 0.6 },
  tr: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  cDesc: { width: "46%" },
  cQty: { width: "14%", textAlign: "right" },
  cRate: { width: "20%", textAlign: "right" },
  cAmt: { width: "20%", textAlign: "right" },
  itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  itemSub: { fontSize: 8.5, color: C.muted, marginTop: 2 },

  // Totals
  totalsWrap: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  totals: { width: "46%" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  grand: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: C.brand,
    borderRadius: 4,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  grandText: { color: "#FFFFFF", fontFamily: "Helvetica-Bold", fontSize: 11 },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: C.successBg,
    color: C.success,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  // Notes + footer
  notes: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line },
  noteText: { fontSize: 8.5, color: C.muted, lineHeight: 1.45 },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: C.line,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footText: { fontSize: 8, color: C.muted },
});

const money = (n: number) =>
  `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const fmtSession = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const Invoice = ({ b }: { b: any }) => {
  const hours = Number(b.hours) || 0;
  const total = Number(b.totalPrice) || 0;
  const hasBreakdown = b.hourlyRate !== undefined && b.deposit !== undefined;
  const rate = Number(b.hourlyRate) || 0;
  const deposit = Number(b.deposit) || 0;
  const rental = hasBreakdown ? hours * rate : total;

  const invoiceNo = `INV-${String(b._id).slice(-8).toUpperCase()}`;
  const issued = fmtDate(b.createdAt || new Date());

  return (
    <Document title={invoiceNo} author="StudioSpace" subject={`Booking invoice for ${b.studioTitle}`}>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.band}>
          <View style={s.logoRow}>
            <Image src={"/logo-mark-512.jpg"} style={s.logo} />
            <Text style={s.brand}>
              Studio<Text style={s.brandAccent}>Space</Text>
            </Text>
          </View>
          <View>
            <Text style={s.docTitle}>INVOICE</Text>
            <Text style={s.docSub}>{invoiceNo}</Text>
          </View>
        </View>
        <View style={s.accentBar} />

        <View style={s.body}>
          {/* Meta */}
          <View style={s.metaRow}>
            <View style={s.metaBox}>
              <Text style={s.label}>INVOICE NUMBER</Text>
              <Text style={s.value}>{invoiceNo}</Text>
            </View>
            <View style={s.metaBox}>
              <Text style={s.label}>DATE ISSUED</Text>
              <Text style={s.value}>{issued}</Text>
            </View>
            <View style={s.metaBox}>
              <Text style={s.label}>PAYMENT STATUS</Text>
              <Text style={s.badge}>{String(b.status || "Confirmed").toUpperCase()}</Text>
            </View>
          </View>

          {/* Parties */}
          <View style={s.parties}>
            <View style={s.party}>
              <Text style={s.label}>BILLED TO</Text>
              <Text style={s.value}>{b.userName}</Text>
              <Text style={s.valueLight}>{b.userEmail}</Text>
            </View>
            <View style={s.party}>
              <Text style={s.label}>HOSTED BY</Text>
              <Text style={s.value}>{b.studioTitle}</Text>
              <Text style={s.valueLight}>{b.hostEmail || "StudioSpace verified host"}</Text>
            </View>
          </View>

          {/* Session */}
          <View style={s.sessionCard}>
            <View style={s.sessionCol}>
              <Text style={s.label}>SESSION DATE</Text>
              <Text style={s.value}>{fmtSession(b.date)}</Text>
            </View>
            <View style={s.sessionCol}>
              <Text style={s.label}>START</Text>
              <Text style={s.value}>{b.startTime}</Text>
            </View>
            <View style={s.sessionCol}>
              <Text style={s.label}>END</Text>
              <Text style={s.value}>{b.endTime}</Text>
            </View>
            <View style={s.sessionCol}>
              <Text style={s.label}>DURATION</Text>
              <Text style={s.value}>{hours.toFixed(1)} hrs</Text>
            </View>
          </View>

          {/* Line items */}
          <View style={s.th}>
            <Text style={[s.thText, s.cDesc]}>DESCRIPTION</Text>
            <Text style={[s.thText, s.cQty]}>QTY</Text>
            <Text style={[s.thText, s.cRate]}>RATE</Text>
            <Text style={[s.thText, s.cAmt]}>AMOUNT</Text>
          </View>

          <View style={s.tr}>
            <View style={s.cDesc}>
              <Text style={s.itemTitle}>{hasBreakdown ? "Studio rental" : "Studio session"}</Text>
              <Text style={s.itemSub}>{b.studioTitle}</Text>
            </View>
            <Text style={s.cQty}>{hasBreakdown ? `${hours.toFixed(1)} hrs` : "1"}</Text>
            <Text style={s.cRate}>{hasBreakdown ? money(rate) : "-"}</Text>
            <Text style={s.cAmt}>{money(rental)}</Text>
          </View>

          {hasBreakdown && (
            <View style={s.tr}>
              <View style={s.cDesc}>
                <Text style={s.itemTitle}>Security deposit</Text>
                <Text style={s.itemSub}>Refundable against accidental damage</Text>
              </View>
              <Text style={s.cQty}>1</Text>
              <Text style={s.cRate}>{money(deposit)}</Text>
              <Text style={s.cAmt}>{money(deposit)}</Text>
            </View>
          )}

          {/* Totals */}
          <View style={s.totalsWrap}>
            <View style={s.totals}>
              {hasBreakdown && (
                <>
                  <View style={s.totalRow}>
                    <Text>Studio rental</Text>
                    <Text>{money(rental)}</Text>
                  </View>
                  <View style={s.totalRow}>
                    <Text>Security deposit</Text>
                    <Text>{money(deposit)}</Text>
                  </View>
                </>
              )}
              <View style={s.grand}>
                <Text style={s.grandText}>Total</Text>
                <Text style={s.grandText}>{money(total)}</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          <View style={s.notes}>
            <Text style={[s.label, { marginBottom: 5 }]}>TERMS & NOTES</Text>
            <Text style={s.noteText}>
              This invoice confirms your reserved session. The security deposit is refundable by the host after the session if no
              damage is reported. Arrive on time and leave the space as found. Questions? Contact your host or StudioSpace support.
            </Text>
          </View>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footText}>StudioSpace — creative workspace marketplace</Text>
          <Text
            style={s.footText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};

export const InvoiceButton = ({ b }: { b: any }) => (
  <PDFDownloadLink
    document={<Invoice b={b} />}
    fileName={`invoice-${b._id}.pdf`}
    className="btn btn-sm btn-outline"
  >
    {({ loading }) => (loading ? "Preparing..." : "Download Invoice")}
  </PDFDownloadLink>
);