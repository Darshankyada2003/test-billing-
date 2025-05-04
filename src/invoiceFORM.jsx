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

    const [items, setItems] = useState([
        { description: '', hsn: '', unit: '', qty: 1, rate: 0 }
    ]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...items];
        updated[index][name] = ['description', 'unit', 'hsn'].includes(name) ? value : parseFloat(value);
        setItems(updated);
    };

    const addItem = () => {
        setItems([...items, { description: '', hsn: '', unit: '', qty: 1, rate: 0 }]);
    };

    const removeItem = (index) => {
        if (items.length === 1) return;
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
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
        <form onSubmit={generatePDF} className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-lg space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-700">Create Invoice</h2>

            <div className="grid grid-cols-2 gap-6">
                {[
                    { label: "Invoice No", name: "invoiceNo", type: "text" },
                    { label: "Invoice Date", name: "invoiceDate", type: "date" },
                    { label: "Vehicle No", name: "vehicleNo", type: "text" },
                    { label: "Transportation Mode", name: "transportationMode", type: "text" },
                    { label: "Place of Supply", name: "placeOfSupply", type: "text" },
                ].map(({ label, name, type }) => (
                    <div key={name}>
                        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                        <input
                            name={name}
                            type={type}
                            value={form[name]}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Customer Details</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Customer Name</label>
                    <input
                        name="customerName"
                        value={form.customerName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Customer Address</label>
                    <textarea
                        name="customerAddress"
                        value={form.customerAddress}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Customer State</label>
                        <input
                            name="customerState"
                            value={form.customerState}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Customer GSTIN</label>
                        <input
                            name="customerGstin"
                            value={form.customerGstin}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        name="isInterState"
                        checked={form.isInterState}
                        onChange={handleChange}
                        className="accent-blue-600"
                    />
                    <label className="text-gray-700">Inter-State Transaction (Enable IGST)</label>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Items</h3>
                {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-6 gap-2 items-end mb-2">
                        {[
                            { name: 'description', placeholder: 'Description' },
                            { name: 'hsn', placeholder: 'HSN' },
                            { name: 'unit', placeholder: 'unit' },
                            { name: 'qty', placeholder: 'Qty', type: 'number' },
                            { name: 'rate', placeholder: 'Rate', type: 'number' },
                        ].map(({ name, placeholder, type = 'text' }) => (
                            <input
                                key={name}
                                name={name}
                                type={type}
                                placeholder={placeholder}
                                value={item[name]}
                                onChange={(e) => handleItemChange(idx, e)}
                                required
                                className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            />
                        ))}

                        {items.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeItem(idx)}
                                className="text-red-500 hover:text-red-700 font-bold"
                                title="Remove item"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addItem}
                    className="mt-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                    + Add Item
                </button>
            </div>

            <div className="text-center">
                <button
                    type="submit"
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg font-semibold"
                >
                    Generate & Download Invoice PDF
                </button>
            </div>
        </form>
    );
};

export default InvoiceForm;
