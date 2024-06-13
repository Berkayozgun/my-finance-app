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
   git clone https://github.com/Berkayozgun/my-finance-app.git
   cd my-finance-app

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

- React (^18)
- Next.js (14.2.3)
- Tailwind CSS (^3.4.1)
- Axios (^1.7.2)

### Proje Yapısı

```
my-finance-app/
├── src/
│   ├── add-debt/
│   ├── dashboard/
│   ├── edit/
│    ├── [id]/
│   ├── login/
│   ├── payment-plans/
│    ├── [id]/
│   ├── register/
├── layout.tsx
├── page.tsx
├── globals.css
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── README.md
```
