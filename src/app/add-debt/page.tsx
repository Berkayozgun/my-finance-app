"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddDebtPage = () => {
  const [debtName, setDebtName] = useState("");
  const [lenderName, setLenderName] = useState("");
  const [debtAmount, setDebtAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [amount, setAmount] = useState(0);
  const [paymentStart, setPaymentStart] = useState("");
  const [installment, setInstallment] = useState(0);
  const [description, setDescription] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const debtData = {
      debtName,
      lenderName,
      debtAmount,
      interestRate,
      amount,
      paymentStart,
      installment,
      description,
      paymentPlan: [
        {
          paymentDate,
          paymentAmount,
        },
      ],
    };

    try {
      const response = await axios.post(
        "https://study.logiper.com/finance/debt",
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
      console.error("Debt creation error:", error);
      setError("Borç oluşturulurken bir hata oluştu.");
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Yeni Borç Ekle</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block mb-2'>Borç Adı:</label>
          <input
            type='text'
            value={debtName}
            onChange={(e) => setDebtName(e.target.value)}
            className='border p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Kredi Veren:</label>
          <input
            type='text'
            value={lenderName}
            onChange={(e) => setLenderName(e.target.value)}
            className='border p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Borç Miktarı:</label>
          <input
            type='number'
            value={debtAmount}
            onChange={(e) => setDebtAmount(parseFloat(e.target.value))}
            className='border p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Faiz Oranı:</label>
          <input
            type='number'
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className='border p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Tutar:</label>
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className='border p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Ödeme Başlangıç Tarihi:</label>
          <input
            type='date'
            value={paymentStart}
            onChange={(e) => setPaymentStart(e.target.value)}
            className='border p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Taksit Miktarı:</label>
          <input
            type='number'
            value={installment}
            onChange={(e) => setInstallment(parseFloat(e.target.value))}
            className='border p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Açıklama:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Ödeme Tarihi:</label>
          <input
            type='date'
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className='border p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Ödeme Miktarı:</label>
          <input
            type='number'
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
            className='border p-2 w-full'
            required
          />
        </div>
        {error && <div className='text-red-500'>{error}</div>}
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Borç Ekle
        </button>
      </form>
    </div>
  );
};

export default AddDebtPage;
