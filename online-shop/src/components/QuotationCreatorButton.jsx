import React, { useEffect, useRef, useContext } from 'react';
import html2pdf from 'html2pdf.js';
import { set } from 'date-fns';
import AppContext from '../AppContext';

const QuotationCreatorButton = ({
  arrayOfProductData,
  balance,
  note,
  deliveryFee,
  companyName,
  senderName,
  bankAccount,
}) => {
  const grandTotal = arrayOfProductData.reduce((acc, product) => acc + product.total, 0);
  const _deliveryFee = deliveryFee == '' ? 0 : parseFloat(deliveryFee);
  const _balance = balance == '' ? 0 : parseFloat(balance);
  const finalTotal = grandTotal + _deliveryFee + _balance;
  const contentRef = useRef(null);
  const { userdata } = useContext(AppContext);
  const [hidden, setHidden] = React.useState(true);
  const [contentCss, setContentCss] = React.useState('');
  const [downloadButtonHidden, setDownloadButtonHidden] = React.useState('hidden');
  const myBankDetails = [
    {
      bankName: 'BDO',
      accountName: 'Adrian Ladia',
      accountNumber: '00-60-800-21403',
    },
    {
      bankName: 'Unionbank',
      accountName: 'Adrian Anton D. Ladia',
      accountNumber: '1093-5546-9422',
    },
    {
      bankName: 'Gcash',
      accountName: 'Adrian Anton D. Ladia',
      accountNumber: '0917-892-7206',
    },
    {
      bankName: 'Paymaya',
      accountName: 'Adrian Anton Ladia',
      accountNumber: '0917-892-7206',
    },
  ];

  useEffect(() => {
    if (userdata) {
      if (userdata.userRole === 'superAdmin' || userdata.userRole === 'distributor') {
        setDownloadButtonHidden('');
      } else {
        setDownloadButtonHidden('hidden');
      }
    } else {
      setDownloadButtonHidden('hidden');
    }
  }, [userdata]);

  const downloadPDF = () => {
    setHidden(false);
    setTimeout(() => {
      const content = contentRef.current;
      const opt = {
        margin: 10,
        filename: 'quotation.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      html2pdf().from(content).set(opt).save();
      setHidden(true);
    }, 1000);
  };

  useEffect(() => {
    if (hidden) {
      setContentCss('hidden');
    } else {
      setContentCss('');
    }
  }, [hidden]);

  return (
    <div className={downloadButtonHidden}>
      {/* This is the visible button */}
      <button
        onClick={downloadPDF}
        className="px-4 py-2 bg-color10b text-white rounded hover:bg-blue-700 focus:outline-none"
      >
        Download as PDF
      </button>

      {/* This is the hidden content that will be converted to PDF */}
      <div ref={contentRef} className={contentCss}>
        <header className="text-center mb-6">
          <h1 className="text-xl font-bold">{companyName}</h1>
          <p className="text-gray-600">Quotation prepared by: {senderName}</p>
        </header>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="py-2 px-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="py-2 px-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Pieces
              </th>
              <th className="py-2 px-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="py-2 px-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {arrayOfProductData.map((product, index) => (
              <tr key={index}>
                <td className="py-2 px-3">{product.itemName}</td>
                <td className="py-2 px-3">{product.quantity}</td>
                <td className="py-2 px-3">{product.totalPieces}</td>
                <td className="py-2 px-3">₱{product.price.toFixed(2)}</td>
                <td className="py-2 px-3">₱{product.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="py-2 px-3 font-medium">
                Grand Total
              </td>
              <td className="py-2 px-3">₱{grandTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="4" className="py-2 px-3 font-medium">
                Delivery Fee
              </td>
              <td className="py-2 px-3">₱{_deliveryFee}</td>
            </tr>
            <tr>
              <td colSpan="4" className="py-2 px-3 font-medium">
                Balance
              </td>
              <td className="py-2 px-3">₱{_balance}</td>
            </tr>
            <tr>
              <td colSpan="4" className="py-2 px-3 font-bold">
                Final Total
              </td>
              <td className="py-2 px-3">₱{finalTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="4" className="py-2 px-3">
                Note : {note}
              </td>
            </tr>
            {myBankDetails.map((bank, index) => {
              return (
                <tr key={index}>
                  <td colSpan="4" className="py-2 px-3">
                    {bank.bankName} : {bank.accountName} - {bank.accountNumber}
                  </td>
                </tr>
              );
            })}
          </tfoot>
        </table>

        <footer className=""></footer>
      </div>
    </div>
  );
};

export default QuotationCreatorButton;

// const App = () => {
//     const sampleData = [
//         { image: 'image1.jpg', itemName: 'Item 1', quantity: 2, price: 100, total: 200 },
//         { image: 'image2.jpg', itemName: 'Item 2', quantity: 1, price: 50, total: 50 }
//     ];
//     const delivery = 500;

//     return (
//         <div className="bg-gray-100 min-h-screen flex items-center justify-center">
//             <QuotationComponent
//                 arrayOfProductData={sampleData}
//                 deliveryFee={delivery}
//                 companyName="TechCorp Ltd."
//                 senderName="John Doe"
//             />
//         </div>
//     );
// }

// export default App;
