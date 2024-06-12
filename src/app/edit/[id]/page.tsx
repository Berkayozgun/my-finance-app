"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const EditPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debtData, setDebtData] = useState({
    debtName: "",
    lenderName: "",
    debtAmount: 0,
    interestRate: 0,
    amount: 0,
    paymentStart: "",
    installment: 0,
    description: "",
    paymentPlan: [{ paymentDate: "", paymentAmount: 0 }],
  });

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
          interestRate: responseData.interestRate,
          amount: responseData.amount,
          paymentStart: responseData.paymentStart,
          installment: responseData.installment,
          description: responseData.description,
          paymentPlan: responseData.paymentPlan,
        });
        setLoading(false);
      } catch (error) {
        console.error("Veri getirme hatası:", error);
        setError("Veri getirme hatası oluştu.");
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDebtData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePaymentPlanChange = (index, e) => {
    const { name, value } = e.target;
    const newPaymentPlan = [...debtData.paymentPlan];
    newPaymentPlan[index] = {
      ...newPaymentPlan[index],
      [name]: value,
    };
    setDebtData((prevData) => ({
      ...prevData,
      paymentPlan: newPaymentPlan,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.put(
        `https://study.logiper.com/finance/debt/${id}`,
        debtData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.status === "success") {
        router.push("/dashboard");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Borç güncelleme hatası:", error);
      setError("Borç güncellenirken bir hata oluştu.");
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Borç Düzenle - ID: {id}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Borç Adı:</label>
          <input
            type="text"
            name="debtName"
            value={debtData.debtName}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Kredi Veren:</label>
          <input
            type="text"
            name="lenderName"
            value={debtData.lenderName}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Borç Miktarı:</label>
          <input
            type="number"
            name="debtAmount"
            value={debtData.debtAmount}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Faiz Oranı:</label>
          <input
            type="number"
            name="interestRate"
            value={debtData.interestRate}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Tutar:</label>
          <input
            type="number"
            name="amount"
            value={debtData.amount}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Ödeme Başlangıç Tarihi:</label>
          <input
            type="date"
            name="paymentStart"
            value={debtData.paymentStart.split("T")[0]}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Taksit Miktarı:</label>
          <input
            type="number"
            name="installment"
            value={debtData.installment}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Açıklama:</label>
          <textarea
            name="description"
            value={debtData.description}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        {debtData.paymentPlan.map((payment, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2">Ödeme Tarihi:</label>
            <input
              type="date"
              name="paymentDate"
              value={payment.paymentDate.split("T")[0]}
              onChange={(e) => handlePaymentPlanChange(index, e)}
              className="border p-2 w-full"
              required
            />
            <label className="block mb-2">Ödeme Miktarı:</label>
            <input
              type="number"
              name="paymentAmount"
              value={payment.paymentAmount}
              onChange={(e) => handlePaymentPlanChange(index, e)}
              className="border p-2 w-full"
              required
            />
          </div>
        ))}
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Borç Güncelle
        </button>
      </form>
    </div>
  );
};

export default EditPage;
