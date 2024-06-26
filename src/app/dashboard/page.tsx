"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DashboardPage = () => {
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://study.logiper.com/finance/debt",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;

        if (data.status === "success") {
          setDebts(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setError("Veriler alınırken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const deleteDebt = async (id) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.delete(
        `https://study.logiper.com/finance/debt/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      if (data.status === "success") {
        setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Debt delete error:", error);
      setError("Borç silinirken bir hata oluştu.");
    }
  };

  const calculateTotalDebt = () => {
    return debts.reduce((total, debt) => total + debt.debtAmount, 0);
  };

  const calculatePaidAmount = (paymentPlan) => {
    if (!paymentPlan || !Array.isArray(paymentPlan)) return 0;

    return paymentPlan.reduce(
      (totalPaid, payment) => totalPaid + (payment.isPaid ? payment.paymentAmount : 0),
      0
    );
  };

  const soonestPayments = () => {
    const today = new Date();
    return debts.filter((debt) => new Date(debt.paymentStart) >= today);
  };

  const handleNewDebtSubmit = async (formData) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        "https://study.logiper.com/finance/debt",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;

      if (data.status === "success") {
        // Yeni borcu debts state'ine ekleyin
        setDebts([...debts, data.data]);
        // Form başarıyla gönderildiğinde başka bir sayfaya yönlendirin veya popup'ı kapatın
        // Örneğin: router.push('/dashboard') veya setPopupOpen(false);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("New debt creation error:", error);
      setError("Yeni borç oluşturulurken bir hata oluştu.");
    }
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>

      <Link href='/add-debt'>
        <button className='mb-4 flex bg-blue-500 text-white rounded-sm w-24 items-center justify-center'>
          Borç Ekle
        </button>
      </Link>

      <div className='mb-4'>
        <h2 className='text-xl font-semibold'>Borçlar</h2>
        {debts.length > 0 ? (
          <>
            <div>
              <p>Toplam Borç: {calculateTotalDebt()} TL</p>
              <p>Ödenen Borç Tutarı: {calculatePaidAmount()} TL</p>
              <p>
                Yaklaşan Ödemeler :
                {soonestPayments().map((debt) => (
                  <span key={debt.id}>{debt.debtName}, </span>
                ))}
              </p>
            </div>
            <table className='w-full border-collapse border border-gray-500'>
              <thead>
                <tr className='bg-gray-200'>
                  <th className='border border-gray-500 p-2'>Borç ID</th>
                  <th className='border border-gray-500 p-2'>Borç Adı</th>
                  <th className='border border-gray-500 p-2'>Borç Tutarı</th>
                  <th className='border border-gray-500 p-2'>Ödenmiş Miktar</th>
                  <th className='border border-gray-500 p-2'>Ödeme Tarihi</th>
                  <th className='border border-gray-500 p-2'>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {debts.map((debt) => (
                  <tr key={debt.id} className='bg-white'>
                    <td className='border border-gray-500 p-2'>{debt.id}</td>
                    <td className='border border-gray-500 p-2'>
                      {debt.debtName}
                    </td>
                    <td className='border border-gray-500 p-2'>
                      {debt.debtAmount} TL
                    </td>
                    <td className='border border-gray-500 p-2'>
                      {calculatePaidAmount(debt.paymentPlan)} TL
                    </td>
                    <td className='border border-gray-500 p-2'>
                      {new Date(debt.paymentStart).toLocaleDateString()}
                    </td>
                    <td className='border border-gray-500 p-2 gap-2'>
                      <div className='flex gap-2'>
                        <Link href={`/edit/${[debt.id]}`}>
                          <button>Edit</button>
                        </Link>

                        <Link href={`/payment-plans/${debt.id}`}>
                          <button>PaymentPlan</button>
                        </Link>
                        <button onClick={() => deleteDebt(debt.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>Borç bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
