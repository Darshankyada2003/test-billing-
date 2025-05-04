import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { toWords } from 'number-to-words';
import logo from './assets/1.jpg';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
        lineHeight: 1.4,
    },
    header: {
        borderBottomWidth: 1,
        borderColor: '#333',
        paddingBottom: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,
    },
    companyName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F4E79',
        textAlign: 'center',
        flex: 1,
    },
    contactInfo: {
        fontSize: 8,
        textAlign: 'right',
    },
    sectionTitle: {
        backgroundColor: '#1F4E79',
        color: 'white',
        padding: 4,
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 10,
    },
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#333',
        marginTop: 5,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#DCE6F1',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 5,
        flex: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#333',
        fontSize: 9,
    },
    totalBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#333',
        padding: 10,
    },
    totalLeft: {
        width: '45%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalRight: {
        width: '45%',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    signatureBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    signatureSection: {
        width: '45%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const toWordsFormatted = (amount) => {
    const [intPart, decimalPart] = amount.toFixed(2).split('.')
    return `${toWords(parseInt(intPart))} ${decimalPart !== '00' ? `and ${decimalPart}/100` : ''}`.replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const InvoicePDF = ({ form, items }) => {
    const subTotal = items.reduce((sum, i) => sum + i.qty * i.rate, 0);
    const CGST = form.isInterState ? 0 : subTotal * 0.09;
    const SGST = form.isInterState ? 0 : subTotal * 0.09;
    const IGST = form.isInterState ? subTotal * 0.18 : 0;
    const total = subTotal + CGST + SGST + IGST;

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                <View style={styles.header}>
                    <View style={styles.leftHeader}>
                        <Image src={logo} style={styles.logo} />
                        <Text style={styles.gstinTopLeft}>GSTIN: 29ABBFG0549C1ZP</Text>
                    </View>
                    <View style={styles.centerHeader}>
                        <Text style={styles.companyName}>GANESH INFRA</Text>
                    </View>
                    <View style={styles.rightHeader}>
                        <Text style={styles.contactInfo}>
                            SY NO 183/2, 183/3,{"\n"}Mahadevako Digahalli (V), Jala Hobli,{"\n"}Yelahanka Taluk, Bengaluru Urban,{"\n"}Karnataka - 562149{"\n"}Mob: 97505 93505, 97250 13660
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Invoice Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 1 }]}>Invoice No: {form.invoiceNo}</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>Transportation Mode: {form.transportationMode}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 1 }]}>Invoice Date: {formatDate(form.invoiceDate)}</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>Vehicle No: {form.vehicleNo}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 1 }]}>State: {form.customerState} Code: 29</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>Date of supply: {formatDate(form.invoiceDate)}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Place of supply: {form.placeOfSupply}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Customer Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.tableHeader]}>Invoice To</Text>
                        <Text style={[styles.tableCell, styles.tableHeader]}>Consignee</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Name: {form.customerName}</Text>
                        <Text style={styles.tableCell}>Name: {form.customerName}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Address: {form.customerAddress}</Text>
                        <Text style={styles.tableCell}>Address: {form.customerAddress}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>State: {form.customerState}</Text>
                        <Text style={styles.tableCell}>State: {form.customerState}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>GSTIN: {form.customerGstin}</Text>
                        <Text style={styles.tableCell}>GSTIN: {form.customerGstin}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Itemized Details</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, { flex: 0.5 }]}>S.No</Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Description</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>HSN</Text>
                        <Text style={[styles.tableCell, { flex: 0.8 }]}>Qty</Text>
                        <Text style={[styles.tableCell, { flex: 0.8 }]}>Unit</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>Rate</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>Amount</Text>
                    </View>
                    {items.map((item, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 0.5 }]}>{i + 1}</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>{item.description}</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>{item.hsn}</Text>
                            <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.qty}</Text>
                            <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.unit}</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>{item.rate.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>{(item.qty * item.rate).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.totalBox}>
                    <View style={styles.totalLeft}>
                        <Text style={{ fontWeight: 'bold' }}>Total Invoice Amount in Words:</Text>
                        <Text style={{ marginTop: 10, textAlign: 'center' }}>{toWordsFormatted(total)}</Text>
                    </View>
                    <View style={styles.totalRight}>
                        <Text>Sub Total: {subTotal.toFixed(2)}</Text>
                        <Text>CGST (9%): {CGST.toFixed(2)}</Text>
                        <Text>SGST (9%): {SGST.toFixed(2)}</Text>
                        <Text>IGST (18%): {IGST.toFixed(2)}</Text>
                        <Text style={{ fontWeight: 'bold', marginTop: 5 }}>Total: {total.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.signatureBox}>
                    <View style={styles.signatureSection}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Customer's Signature</Text>
                        <View style={{ borderTopWidth: 1, borderColor: '#333', width: '100%', marginTop: 10 }} />
                    </View>
                    <View style={styles.signatureSection}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>For: GANESH INFRA</Text>
                        <Text style={{ textAlign: 'center', marginTop: 5 }}>Partner Signature</Text>
                        <View style={{ borderTopWidth: 1, borderColor: '#333', width: '100%', marginTop: 10 }} />
                    </View>
                </View>


            </Page>
        </Document>
    );
};

export default InvoicePDF;
