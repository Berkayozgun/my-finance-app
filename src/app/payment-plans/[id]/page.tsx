"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const PaymentPlanDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debt, setDebt] = useState(null);
  const [paymentPlan, setPaymentPlan] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchDebt = async () => {
      try {
        const response = await axios.get(
          `https://study.logiper.com/finance/debt/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.data;
        setDebt(data);
        const installments = createInstallments(data);
        setPaymentPlan(installments);
        setLoading(false);
      } catch (error) {
        console.error("Borç getirme hatası:", error);
        setError("Borç getirme hatası oluştu.");
        setLoading(false);
      }
    };

    if (id) {
      fetchDebt();
    }
  }, [id]);

  const createInstallments = (debt) => {
    const installments = [];
    const installmentAmount = debt.debtAmount / debt.installment;
    for (let i = 0; i < debt.installment; i++) {
      const paymentDate = new Date(debt.paymentStart);
      paymentDate.setMonth(paymentDate.getMonth() + i);

      installments.push({
        id: `${debt.id}-${i + 1}`,
        paymentDate: paymentDate.toISOString().split('T')[0],
        paymentAmount: installmentAmount,
        isPaid: false,
      });
    }

    // Mevcut ödeme planını borç verisinden alınan ödenmiş taksitlerle güncelle
    debt.paymentPlan.forEach(paidInstallment => {
      const index = installments.findIndex(i => i.paymentDate === paidInstallment.paymentDate);
      if (index !== -1) {
        installments[index].isPaid = paidInstallment.isPaid;
        installments[index].paymentAmount = paidInstallment.paymentAmount;
      }
    });

    return installments;
  };

  const markAsPaid = async (paymentPlanId) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.put(
        `https://study.logiper.com/finance/payment-plans/${paymentPlanId}`,
        {
          paymentDate: new Date().toISOString().split("T")[0], // Şu anın tarihi olarak al
          paymentAmount: parseFloat(paymentAmount), // El ile girilen ödeme miktarı
          isPaid: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        console.log("Ödeme başarıyla güncellendi.");
        setPaymentPlan((prevPlan) =>
          prevPlan.map((p) =>
            p.id === paymentPlanId ? { ...p, isPaid: true } : p
          )
        );
        setPaymentAmount(""); // Formu sıfırla
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Ödeme güncelleme hatası:", error);
      setError("Ödeme güncellenirken bir hata oluştu: " + error.message);
    }
  };

  const handlePaymentAmountChange = (e) => {
    const { value } = e.target;
    // Ödeme miktarını sadece sayı olarak kabul et ve borç miktarından fazla olmamasını sağla
    if (!isNaN(value) && parseFloat(value) <= debt?.debtAmount) {
      setPaymentAmount(value);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>
        Ödeme Planı Detayları - Borç ID: {id}
      </h1>
      <table className='min-w-full bg-white border'>
        <thead>
          <tr>
            <th className='px-4 py-2'>Taksit Numarası</th>
            <th className='px-4 py-2'>Ödeme Tarihi</th>
            <th className='px-4 py-2'>Ödeme Miktarı</th>
            <th className='px-4 py-2'>Ödeme Durumu</th>
            <th className='px-4 py-2'>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {paymentPlan.map((payment, index) => (
            <tr key={payment.id} className={`${index % 2 === 0 ? "bg-gray-100" : ""}`}>
              <td className='border px-4 py-2'>{index + 1}</td>
              <td className='border px-4 py-2'>{new Date(payment.paymentDate).toLocaleDateString()}</td>
              <td className='border px-4 py-2'>{payment.paymentAmount} TL</td>
              <td className='border px-4 py-2'>{payment.isPaid ? "Ödendi" : "Ödenmedi"}</td>
              <td className='border px-4 py-2'>
                {!payment.isPaid && (
                  <div>
                    <input
                      type='number'
                      value={paymentAmount}
                      onChange={handlePaymentAmountChange}
                      placeholder={`Max ${payment.paymentAmount} TL`}
                      className='border rounded p-2 mb-2'
                    />
                    <button
                      onClick={() => markAsPaid(payment.id)}
                      disabled={!paymentAmount}
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                        !paymentAmount ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Ödendi Olarak İşaretle
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentPlanDetailPage;
