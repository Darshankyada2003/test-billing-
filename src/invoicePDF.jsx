import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { toWords } from 'number-to-words';

// Define styles
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

// Function to convert numbers to words
const toWordsFormatted = (amount) => {
    const [intPart, decimalPart] = amount.toFixed(2).split('.');
    return `${toWords(parseInt(intPart))} ${decimalPart !== '00' ? `and ${decimalPart}/100` : ''}`
        .replace(/\b\w/g, (l) => l.toUpperCase());
};

// Main InvoicePDF component
const InvoicePDF = ({ form, items }) => {
    const subTotal = items.reduce((sum, i) => sum + i.qty * i.rate, 0);
    const CGST = form.isInterState ? 0 : subTotal * 0.09;
    const SGST = form.isInterState ? 0 : subTotal * 0.09;
    const IGST = form.isInterState ? subTotal * 0.18 : 0;
    const total = subTotal + CGST + SGST + IGST;

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                <View style={{ marginBottom: 10 }}>
                    {/* Top Centered Line */}
                    <View style={{ alignItems: 'center', marginBottom: 5 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>|| Jay Shree Krishna ||</Text>
                    </View>

                    {/* GST Left, Name Center-Left, Address Right */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* Left Side: GST and Company Name */}
                        <View style={{ width: '60%' }}>
                            <Text style={{ fontSize: 8 }}>GSTIN: 29ABBFG0549C1ZP</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 2 }}>GANESH INFRA</Text>
                        </View>

                        {/* Right Side: Address */}
                        <View style={{ width: '40%' }}>
                            <Text style={{ fontSize: 8, textAlign: 'right' }}>
                                SY NO 183/2,183/3,{'\n'}
                                MahadevakoDigahalli (V), Jala Hobli,{'\n'}
                                Yelahanka Taluk, Bengaluru Urban,{'\n'}
                                Karnataka - 562149{'\n'}
                                Mob: 97505 93505, 97250 13660
                            </Text>
                        </View>
                    </View>
                </View>

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

                {/* Receiver and Consignee Details */}
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

                {/* Invoice Item Details */}
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
                            <Text style={[styles.tableCell, { width: '10%' }]}>{item.unit}</Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{item.rate.toFixed(2)}</Text>
                            <Text style={[styles.tableCell, { width: '10%' }]}>{(item.qty * item.rate).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Total Summary Section */}
                <View style={[styles.tableRow, { marginTop: 10, borderWidth: 1, borderColor: 'black' }]}>
                    <View style={{ width: '50%', borderRightWidth: 1, borderColor: 'black', justifyContent: 'center', padding: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>Total Invoice Amount in words:</Text>
                        <Text style={{ marginTop: 30, textAlign: 'center' }}>{toWordsFormatted(total)}</Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <View style={styles.tableRow}><Text style={styles.tableCell}>Sub Total</Text><Text style={styles.tableCell}>{subTotal.toFixed(2)}</Text></View>
                        <View style={styles.tableRow}><Text style={styles.tableCell}>CGST (9%)</Text><Text style={styles.tableCell}>{CGST.toFixed(2)}</Text></View>
                        <View style={styles.tableRow}><Text style={styles.tableCell}>SGST (9%)</Text><Text style={styles.tableCell}>{SGST.toFixed(2)}</Text></View>
                        <View style={styles.tableRow}><Text style={styles.tableCell}>IGST (18%)</Text><Text style={styles.tableCell}>{IGST.toFixed(2)}</Text></View>
                        <View style={styles.tableRow}><Text style={[styles.tableCell, styles.textBold]}>Total</Text><Text style={[styles.tableCell, styles.textBold]}>{total.toFixed(2)}</Text></View>
                    </View>
                </View>

                <View style={[styles.tableRow, { marginTop: 10, borderWidth: 1, borderColor: 'black', height: 100 }]}>
                    {/* Customer Signature Box */}
                    <View style={{ width: '50%', borderRightWidth: 1, borderColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[styles.textBold]}>Customer's Signature</Text>
                    </View>

                    {/* Ganesh Infra + Partner Signature Box */}
                    <View style={{ width: '50%', justifyContent: 'space-between', paddingVertical: 8 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[styles.textBold]}>For: GANESH INFRA</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text>Partner Signature</Text>
                        </View>
                    </View>
                </View>

            </Page>
        </Document>
    );
};

export default InvoicePDF;