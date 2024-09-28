// src/components/PaymentTab.js

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVoucherAction, setPaymentMethodAction } from "../../redux/actions/bookingAction";

const PaymentTab = () => {
  const dispatch = useDispatch();
  const { paymentMethods } = useSelector((state) => state.booking);
  const [voucherCode, setVoucherCode] = useState('');

  const handleApplyVoucher = () => {
    dispatch(setVoucherAction(voucherCode));
  };

  const handlePaymentMethodChange = (method) => {
    dispatch(setPaymentMethodAction(method));
  };

  return (
    <div className="col-span-2 xl:order-first order-last xl:h-full h-full overflow-hidden xl:overflow-auto xl:pb-10 pb-32">
      <div className="bg-white p-4">
        <h1 className="text-3xl mb-4 font-semibold">Khuyến mãi</h1>
        <div className="md:mt-4 mt-2">
          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <div className="mt-4 grid grid-cols-2 gap-4 xl:w-2/3 w-full">
              <div className="col-span-1">
                <label className="inline-block mb-1 text-black-10 text-sm font-bold" htmlFor="voucher-code">
                  Mã khuyến mãi
                </label>
                <input id="voucher-code" type="text" className="border w-full py-2 px-4" name="barcode" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} />
              </div>
              <div className="col-span-1 flex items-start mt-7">
                <button className="bg-primary text-white text-sm rounded px-12 py-2 h-[42px]" onClick={handleApplyVoucher}>
                  Áp Dụng
                </button>
              </div>
            </div>
            <p className="text-s text-grey-40 mt-2">Lưu ý: Có thể áp dụng nhiều vouchers vào 1 lần thanh toán</p>
          </form>
          <div className="md:mt-4 mt-2">
            <div className="xl:w-2/3 w-full justify-between items-center cursor-pointer gap-4">
              <h4 className="inline-block mb-4 text-black-10 text-sm font-bold cursor-pointer flex-1">
                Khuyến mãi của bạn{' '}
                <span className="transition-all duration-300 ease-in-out">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" className="svg-inline--fa fa-angle-down " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" >
                    <path fill="currentColor" d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                  </svg>
                </span>
              </h4>
              <p className="italic">Comming Soon</p>
            </div>
          </div>
        </div>
        <div className="md:mt-4 mt-2">
          <div className="xl:w-2/3 w-full justify-between items-center cursor-pointer ap-4">
            <h4 className="inline-block mb-1 text-black-10 text-sm font-bold flex-1">
              Áp dụng điểm Stars{' '}
              <span className="transition-all duration-300 ease-in-out">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" className="svg-inline--fa fa-angle-down " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" >
                  <path fill="currentColor" d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                </svg>
              </span>
            </h4>
            <p className="italic">Comming Soon</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 mt-8">
        <h3 className="text-l mb-4 font-semibold">Phương thức thanh toán</h3>
        <div className="my-4">
          <ul className="leading-5 text-l">
            {paymentMethods.map((method, index) => (
              <li key={index} className="mb-4 md:block flex items-center">
                <input type="radio" className="w-4 h-4 text-primary bg-gray-100 border-gray-300" name="payment-methods" id={`payment-${method.value}`} value={method.value} checked={method.checked} onChange={() => handlePaymentMethodChange(method.value)}/>
                <img alt="" loading="lazy" width="50" height="50" decoding="async" data-nimg="1" className="inline-block mx-2 object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0" src={method.image} style={{ color: 'transparent' }} />
                <label htmlFor={`payment-${method.value}`} className="inline-block md:text-base text-sm">
                  {method.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 text-sm">
          <strong className="text-red-10 font-semibold">(*) </strong>
          <span>Bằng việc click/chạm vào THANH TOÁN bên phải, bạn đã xác nhận hiểu rõ các Quy Định Giao Dịch Trực Tuyến của Hilo Cinema.</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentTab;

