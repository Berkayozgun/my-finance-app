# Proje Adı

## Proje Genel Bilgileri

Bu proje, kullanıcıların borçlarını yönetebilecekleri ve ödeme planlarını takip edebilecekleri bir web uygulamasıdır. Uygulama, kullanıcıların borçlarını ve ödeme planlarını görüntülemelerini, taksitleri ödenmiş olarak işaretlemelerini sağlar.

## Özellikler

- Kullanıcı kaydı ve girişi
- Borç bilgilerini görüntüleme
- Ödeme planı taksitlerini görüntüleme
- Taksitleri ödenmiş olarak işaretleme

## Kurulum

### Gereksinimler

- Node.js (>= 14.x)
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:

   ```sh
   git clone https://github.com/kullaniciadi/proje-adi.git
   cd proje-adi

   ```

2. Gerekli paketleri yükleyin:

   ```sh
   npm install
   # veya
   yarn install

   ```

3. Ortam değişkenlerini ayarlayın:
   ```sh
    cp .env.example .env
   ```

### Çalıştırma

1. Geliştirme sunucusunu başlatın:

   ```sh
   npm run dev
   # veya
   yarn dev

   ```

2. Tarayıcıda uygulamayı açın:
   ```
    http://localhost:3000
   ```

### Kullanılan Teknolojiler ve Sürümleri

- React (17.x)
- Next.js (10.x)
- Tailwind CSS (2.x)
- Axios (0.21.x)

### Proje Yapısı

```
proje-adi/
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Layout.tsx
├── pages/
│   ├── _app.tsx
│   ├── index.tsx
│   └── login.tsx
├── public/
│   ├── favicon.ico
│   └── vercel.svg
├── styles/
│   ├── globals.css
│   └── Home.module.css
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

### API

Register Endpoint

- URL: `https://api.example.com`
- Method: `POST`
- Headers:
  - `Content-Type: application/json`
- Body:
  ````
  {
  "name": "Kullanıcı Adı",
  "email": "email@example.com",
  "password": "sifre"
  }
    ```
  ````
- Response:
  `    {
  "status": "success",
  "data": "accessToken"
}
   ```

Borç Bilgileri Endpoint

- URL: `https://api.example.com/debts`
- Method: `GET`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer accessToken`
- Response:
  ```
{
  "status": "success",
  "data": {
    "id": "666ae1b572e94d8f8322e8a7",
    "createdAt": "2024-06-13T12:10:29.406Z",
    ...
    "paymentPlan": [
      {
        "id": "666ae1b572e94d8f8322e8a8",
        "createdAt": "2024-06-13T12:10:29.406Z",
        ...
        "isPaid": true,
        "paymentDate": "2024-06-13T00:00:00.000Z",
        "paymentAmount": 50
      }
    ]
  }
}

Taksiti Ödemiş Olarak İşaretleme

- URL: `https://study.logiper.com/finance/payment-plans/:paymentPlanId`
- Method: `PUT`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer accessToken`
- Body:
  ```
  {
  "paymentDate": paymentDate,
  "paymentAmount": paymentAmount,
  "isPaid": true
}

- Response:
  ```
  {
  "status": "success",
  "data": {
    "id": "666ae1b572e94d8f8322e8a8",
    "createdAt": "2024-06-13T12:10:29.406Z",
    ...
    "isPaid": true,
    "paymentDate": "2024-06-13T00:00:00.000Z",
    "paymentAmount": 50
  }
}
   ```

