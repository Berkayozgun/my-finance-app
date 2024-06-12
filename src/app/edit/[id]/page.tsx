"use client"
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const EditPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://study.logiper.com/finance/debt/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data.data);
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
    <div>
      <h2>Edit sayfası - ID: {id}</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default EditPage;
