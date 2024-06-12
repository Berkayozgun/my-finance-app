"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "../components/Button";
import Input from "../components/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // Mesaj state'i eklendi
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null); // Form gönderildiğinde mesajı temizle

    try {
      const response = await axios.post(
        "https://study.logiper.com/auth/login",
        {
          email: email,
          password: password,
        }
      );
      const data = response.data;

    

      if (data.status === "success" && data.data) {
        setMessage("Giriş başarılı. Yönlendiriliyorsunuz...");
        localStorage.setItem("accessToken", data.data);

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setMessage(
          "Hatalı e-mail ya da şifre girdiniz. Lütfen tekrar deneyin."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Giriş sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <form onSubmit={handleSubmit}>
        <h1 className='text-2xl font-bold mb-6'>Giriş Yap</h1>

        {message && (
          <div className='mb-4 p-2 bg-red-200 text-red-800 rounded-md'>
            {message}
          </div>
        )}

        <div className='mb-4'>
          <label htmlFor='email' className='block text-gray-800 font-bold'>
            E-posta
          </label>
          <Input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-gray-300 text-black rounded-md w-full px-4 py-2'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='password' className='block text-gray-800 font-bold'>
            Şifre
          </label>
          <Input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-gray-300 text-black rounded-md w-full px-4 py-2'
          />
        </div>

        <Button
          type='submit'
          className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md'
          disabled={isLoading}
        >
          {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
