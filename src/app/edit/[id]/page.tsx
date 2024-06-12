"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const EditPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [debtData, setDebtData] = useState(null);
  const [paymentPlan, setPaymentPlan] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://study.logiper.com/finance/debt/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data.data;
        setDebtData({
          debtName: responseData.debtName,
          lenderName: responseData.lenderName,
          debtAmount: responseData.debtAmount,
          paymentStart: responseData.paymentStart,
          installment: responseData.installment,
          description: responseData.description,
        });
        setPaymentPlan(responseData.paymentPlan);
        setLoading(false);
      } catch (error) {
        console.error("Veri getirme hatası:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="flex gap-4 flex-col">
      <div>
      <h2>Edit sayfası - ID: {id}</h2>
      <h3>Borç Detayları:</h3>
      <p>Borç Adı: {debtData.debtName}</p>
      <p>Kredi Veren: {debtData.lenderName}</p>
      <p>Borç Miktarı: {debtData.debtAmount}</p>
      <p>Ödeme Başlangıç Tarihi: {debtData.paymentStart}</p>
      <p>Taksit Miktarı: {debtData.installment}</p>
      <p>Açıklama: {debtData.description}</p>
      <h3>Ödeme Planı:</h3>
      </div>
      <ul>
        {paymentPlan.map((payment) => (
          <li key={payment.id}>
            Tarih: {payment.paymentDate}, Ödeme Miktarı: {payment.paymentAmount}
            , {payment.isPaid ? "Ödendi" : "Ödenmedi"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditPage;
