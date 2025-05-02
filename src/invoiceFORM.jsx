// InvoiceForm.jsx
import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from './invoicePDF';

const InvoiceForm = () => {
    const [form, setForm] = useState({
        invoiceNo: '',
        invoiceDate: '',
        vehicleNo: '',
        transportationMode: '',
        placeOfSupply: '',
        customerName: '',
        customerAddress: '',
        customerState: '',
        customerGstin: '',
        isInterState: false,
    });

    const [items, setItems] = useState([{ description: '', hsn: '', Unit: '', qty: 1, rate: 0 }]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...items];
updated[index][name] = ['description', 'Unit'].includes(name) ? value : parseFloat(value);
        setItems(updated);
    };

    const addItem = () => {
        setItems([...items, { description: '', hsn: '', Unit: '', qty: 1, rate: 0 }]);
    };

    const generatePDF = async (e) => {
        e.preventDefault();
        const blob = await pdf(<InvoicePDF form={form} items={items} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice_${form.invoiceNo || 'generated'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <form onSubmit={generatePDF} className="max-w-4xl mx-auto p-6 bg-white shadow rounded space-y-6">
            <h2 className="text-2xl font-bold">Create Invoice</h2>

            <div className="grid grid-cols-2 gap-4">
                <input name="invoiceNo" placeholder="Invoice No" onChange={handleChange} required className="input" />
                <input name="invoiceDate" type="date" onChange={handleChange} required className="input" />
                <input name="vehicleNo" placeholder="Vehicle No" onChange={handleChange} required className="input" />
                <input name="transportationMode" placeholder="Transportation Mode" onChange={handleChange} required className="input" />
                <input name="placeOfSupply" placeholder="Place of Supply" onChange={handleChange} required className="input" />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <h3 className="text-xl font-semibold">Customer Details</h3>
                <input name="customerName" placeholder="Customer Name" onChange={handleChange} required className="input" />
                <textarea name="customerAddress" placeholder="Address" onChange={handleChange} required className="input" />
                <input name="customerState" placeholder="State" onChange={handleChange} required className="input" />
                <input name="customerGstin" placeholder="GSTIN" onChange={handleChange} className="input" />
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">Items</h3>
                {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                        <input name="description" placeholder="Description" onChange={(e) => handleItemChange(idx, e)} required className="input" />
                        <input name="hsn" placeholder="HSN" onChange={(e) => handleItemChange(idx, e)} required className="input" />
                        <input name="Unit" placeholder="Unit" onChange={(e) => handleItemChange(idx, e)} required className="input" />
                        <input name="qty" type="number" placeholder="Qty" onChange={(e) => handleItemChange(idx, e)} required className="input" />
                        <input name="rate" type="number" placeholder="Rate" onChange={(e) => handleItemChange(idx, e)} required className="input" />
                    </div>
                ))}
                <button type="button" onClick={addItem} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">+ Add Item</button>
            </div>

            <button type="submit" className="mt-4 px-6 py-2 bg-green-600 text-white rounded">Generate & Download Invoice PDF</button>
        </form>
    );
};

export default InvoiceForm;
