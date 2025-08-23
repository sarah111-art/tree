import React from 'react';

const PaymentMethodSelector = ({ selectedMethod, onMethodChange }) => {
  const paymentMethods = [
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng',
      description: 'Trả tiền khi nhận được sản phẩm',
      icon: '💵',
      color: 'border-gray-300 bg-gray-50',
      selectedColor: 'border-green-500 bg-green-50'
    },
    {
      id: 'momo',
      name: 'Ví Momo',
      description: 'Thanh toán qua ứng dụng Momo',
      icon: '📱',
      color: 'border-pink-300 bg-pink-50',
      selectedColor: 'border-pink-500 bg-pink-100'
    },
    {
      id: 'vnpay',
      name: 'VNPay QR',
      description: 'Quét mã QR để thanh toán',
      icon: '🏦',
      color: 'border-blue-300 bg-blue-50',
      selectedColor: 'border-blue-500 bg-blue-100'
    },
    {
      id: 'bank',
      name: 'Chuyển khoản ngân hàng',
      description: 'Chuyển khoản trực tiếp',
      icon: '🏦',
      color: 'border-purple-300 bg-purple-50',
      selectedColor: 'border-purple-500 bg-purple-100'
    }
  ];

  return (
    <div className="space-y-3">
      <label className="block font-medium mb-2">
        Phương thức thanh toán:
      </label>
      
      <div className="grid gap-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedMethod === method.id
                ? method.selectedColor
                : method.color
            } hover:shadow-md`}
            onClick={() => onMethodChange(method.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{method.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{method.name}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedMethod === method.id
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300'
              }`}>
                {selectedMethod === method.id && (
                  <div className="w-full h-full rounded-full bg-white scale-75"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
