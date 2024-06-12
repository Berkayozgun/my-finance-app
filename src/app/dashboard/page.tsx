"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const calculateTotalDebt = () => {
    return debts.reduce((total, debt) => total + debt.debtAmount, 0);
  };

  const calculatePaidDebt = () => {
    return debts.reduce((total, debt) => total + debt.paidAmount, 0);
  };

  const soonestPayments = () => {
    const today = new Date();
    const soonestPayments = debts.filter((debt) => {
      const paymentStart = new Date(debt.paymentStart);
      return paymentStart >= today;
    });

    return soonestPayments;
  };


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

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold'>Borçlar</h2>
        {debts.length > 0 ? (
          <>
            <div>
              <p>Toplam Borç: {calculateTotalDebt()} TL</p>
              <p>Ödenen Borç Tutarı: {calculatePaidDebt()}</p>
              <p>Yaklaşan Ödemeler : 
                {soonestPayments().map((debt) => (
                  <span key={debt.id}>{debt.debtName}, </span>
                ))}
              </p>
            </div>
            <ul className='flex flex-col gap-4'>
              {debts.map((debt) => (
                <li className='flex border gap-4' key={debt.id}>
                  <p>Borç ID: {debt.id}</p>
                  <p>Borç Adı: {debt.debtName}</p>
                  <p>Borç Tutarı: {debt.debtAmount} TL</p>
                  <p>
                    Ödeme Tarihi:{" "}
                    {new Date(debt.paymentStart).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Borç bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
