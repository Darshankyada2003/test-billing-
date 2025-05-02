import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { toWords } from 'number-to-words';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    textCenter: {
        textAlign: 'center',
    },
    textBold: {
        fontWeight: 'bold',
    },
    textSm: {
        fontSize: 8,
    },
    textLg: {
        fontSize: 16,
    },
    border: {
        borderColor: 'black',
    },
    table: {
        display: 'table',
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tableCell: {
        padding: 4,
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        fontSize: 10,
    },
    header: {
        fontSize: 16,
        marginBottom: 4,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 8,
        textAlign: 'center',
    },
    label: {
        width: '25%',
        padding: 4,
    },
    value: {
        width: '75%',
        padding: 4,
    },
    footerRow: {
        flexDirection: 'row',
        marginTop: 30,
    },
    half: {
        width: '50%',
        padding: 10,
    },
});

const toWordsFormatted = (amount) => {
    const [intPart, decimalPart] = amount.toFixed(2).split('.');
    return `${toWords(parseInt(intPart))} ${decimalPart !== '00' ? `and ${decimalPart}/100` : ''} only`
        .replace(/\b\w/g, (l) => l.toUpperCase());
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
                {/* Header */}
                <Text style={[styles.subText, styles.textCenter]}>GSTIN: 29ABBFG0549C1ZP || Jay Sri Krishna ||</Text>
                <Text style={[styles.header, styles.textCenter]}>GANESH INFRA</Text>
                <Text style={[styles.subText, styles.textCenter]}>
                    SY NO 183/2,183/3, MahadevakoDigahalli (V), Jala Hobli, Yelahanka Taluk, Bengaluru Urban, Karnataka - 562149
                </Text>
                <Text style={[styles.subText, styles.textCenter]}>Mob: 97505 93505, 97250 13660</Text>

                {/* Title */}
                <Text style={[styles.header, styles.textCenter, { textDecoration: 'underline' }]}>TAX INVOICE</Text>

                {/* Invoice Meta */}
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '50%' }]}>Invoice No: {form.invoiceNo}</Text>
                        <Text style={[styles.tableCell, { width: '50%' }]}>Transportation Mode: {form.transportationMode}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '50%' }]}>Invoice Date: {form.invoiceDate}</Text>
                        <Text style={[styles.tableCell, { width: '50%' }]}>Vehicle No: {form.vehicleNo}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '50%' }]}>State: {form.customerState} Code: Gujarat</Text>
                        <Text style={[styles.tableCell, { width: '50%' }]}>Date of supply: {form.invoiceDate}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '100%' }]}>Place of supply: {form.placeOfSupply}</Text>
                    </View>
                </View>

                {/* Customer Info Table */}
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '50%', fontWeight: 'bold' }]}>Invoice To (Details of Receiver)</Text>
                        <Text style={[styles.tableCell, { width: '50%', fontWeight: 'bold' }]}>Consignee (Details of Deliver To)</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '50%' }]}>Name: {form.customerName}</Text>
                        <Text style={[styles.tableCell, { width: '50%' }]}>Name: {form.customerName}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '50%' }]}>Address: {form.customerAddress}</Text>
                        <Text style={[styles.tableCell, { width: '50%' }]}>Address: {form.customerAddress}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '50%' }]}>State: {form.customerState} Code: Gujarat</Text>
                        <Text style={[styles.tableCell, { width: '50%' }]}>State: {form.customerState} Code: Gujarat</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '50%' }]}>GSTIN: {form.customerGstin}</Text>
                        <Text style={[styles.tableCell, { width: '50%' }]}>GSTIN: {form.customerGstin}</Text>
                    </View>
                </View>

                {/* Product Table */}
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { width: '10%' }]}>S.No</Text>
                        <Text style={[styles.tableCell, { width: '40%' }]}>Description Of Product</Text>
                        <Text style={[styles.tableCell, { width: '10%' }]}>HSN</Text>
                        <Text style={[styles.tableCell, { width: '10%' }]}>Qty</Text>
                        <Text style={[styles.tableCell, { width: '10%' }]}>Unit</Text>
                        <Text style={[styles.tableCell, { width: '10%' }]}>Rate</Text>
                        <Text style={[styles.tableCell, { width: '10%' }]}>Amount</Text>
                    </View>
                    {items.map((item, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{i + 1}</Text>
                            <Text style={[styles.tableCell, { width: '40%' }]}>{item.description}</Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{item.hsn}</Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{item.qty}</Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{item.Unit}</Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{item.rate.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{(item.qty * item.rate).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Total In Words + Tax Table */}
                <View style={[styles.tableRow, { marginTop: 10, borderWidth: 1, borderColor: 'black', flexDirection: 'row' }]}>
                    {/* Left Side: Amount in words */}
                    <View style={{ width: '50%', borderRightWidth: 1, borderColor: 'black', justifyContent: 'center', padding: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>Total Invoice Amount in words:</Text>
                        <Text style={{ marginTop: 30, textAlign: 'center' }}>{toWordsFormatted(total)}</Text>
                    </View>

                    {/* Right Side: Tax breakdown */}
                    <View style={{ width: '50%' }}>
                        <View style={[styles.tableRow,]}>
                            <Text style={styles.tableCell}>Sub Total</Text>
                            <Text style={styles.tableCell}>{subTotal.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.tableRow,]}>
                            <Text style={styles.tableCell}>CGST (9%)</Text>
                            <Text style={styles.tableCell}>{CGST.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.tableRow,]}>
                            <Text style={styles.tableCell}>SGST (9%)</Text>
                            <Text style={styles.tableCell}>{SGST.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.tableRow,]}>
                            <Text style={styles.tableCell}>IGST (18%)</Text>
                            <Text style={styles.tableCell}>{IGST.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.tableRow,]}>
                            <Text style={[styles.tableCell, styles.textBold]}>Grand Total</Text>
                            <Text style={[styles.tableCell, styles.textBold]}>{total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Footer Signatures */}
                <View style={styles.footerRow}>
                    <View style={styles.half}>
                        <Text>Customer's Signature</Text>
                    </View>
                    <View style={styles.half}>
                        <Text style={{ textAlign: 'right' }}>For: GANESH INFRA</Text>
                        <Text style={{ textAlign: 'right' }}>Partner Signature</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;
