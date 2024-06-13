"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const PaymentPlanDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentPlan, setPaymentPlan] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchPaymentPlan = async () => {
      try {
        const response = await axios.get(
          `https://study.logiper.com/finance/payment-plans/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPaymentPlan(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Ödeme planı getirme hatası:", error);
        setError("Ödeme planı getirme hatası oluştu.");
        setLoading(false);
      }
    };

    if (id) {
      fetchPaymentPlan();
    }
  }, [id]);

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
    if (!isNaN(value) && parseFloat(value) <= paymentPlan[0]?.paymentAmount) {
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
      <ul>
        {paymentPlan.map((payment) => (
          <li key={payment.id} className='mb-2'>
            <div className='p-4 border rounded'>
              <p>
                Ödeme Tarihi:{" "}
                {new Date(payment.paymentDate).toLocaleDateString()}
              </p>
              <p>Ödeme Miktarı: {payment.paymentAmount} TL</p>
              <p>Ödeme Durumu: {payment.isPaid ? "Ödendi" : "Ödenmedi"}</p>
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentPlanDetailPage;
