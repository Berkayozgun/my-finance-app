"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "../components/Button";
import Input from "../components/Input";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // Mesaj state'i eklendi
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Şifreler eşleşmiyor. Lütfen tekrar deneyin.");
      return;
    }

    setIsLoading(true);
    setMessage(null); // Form gönderildiğinde mesajı temizle

    try {
      const response = await axios.post(
        "https://study.logiper.com/auth/register",
        {
          name: name,
          email: email,
          password: password,
        }
      );
      const data = response.data;

      if (data.status === "success" && data.data) {
        localStorage.setItem("accessToken", data.data);
        setMessage("Kayıt işlemi başarılı. Yönlendiriliyorsunuz...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else if (
        data.status === "error" &&
        data.data === "User already exists"
      ) {
        setMessage(
          "Bu e-posta ile zaten kayıtlı bir kullanıcı var. Lütfen farklı bir e-posta deneyin."
        );
      } else {
        setMessage(
          "Kayıt sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Kayıt sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <form onSubmit={handleSubmit}>
        <h1 className='text-2xl font-bold mb-6'>Kayıt Ol</h1>

        {message && (
          <div className='mb-4 p-2 bg-red-200 text-red-800 rounded-md'>
            {message}
          </div>
        )}

        <div className='mb-4'>
          <label htmlFor='name' className='block text-gray-800 font-bold'>
            Ad Soyad
          </label>
          <Input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border border-gray-300 rounded-md text-black w-full px-4 py-2'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='email' className='block text-gray-800 font-bold'>
            E-posta
          </label>
          <Input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-gray-300 rounded-md text-black w-full px-4 py-2'
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

        <div className='mb-4'>
          <label
            htmlFor='confirmPassword'
            className='block text-gray-800 font-bold'
          >
            Şifreyi Tekrar Doğrula
          </label>
          <Input
            type='password'
            id='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='border border-gray-300 text-black rounded-md w-full px-4 py-2'
          />
        </div>

        <Button
          type='submit'
          className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md'
          disabled={isLoading}
        >
          {isLoading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
