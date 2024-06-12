"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const PaymentPlanDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;

    if (!id) {
        return <p>Ödeme planı ID bulunamadı.</p>;
    }
    
    return (
        <div>
        <h1>Ödeme Planı Detayı</h1>
        <p>Ödeme planı ID: {id}</p>
        </div>
    );
    };

export default PaymentPlanDetailPage;
