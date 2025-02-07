# EVENT-MANAGEMENT-CLIENT

## Mô tả dự án

Dự án **EVENT-MANAGEMENT-CLIENT** là ứng dụng Frontend được xây dựng bằng **React (TypeScript)** để quản lý sự kiện. Dự án sử dụng nhiều thư viện hỗ trợ mạnh mẽ giúp tối ưu trải nghiệm người dùng và nâng cao hiệu suất phát triển.

## Công nghệ sử dụng

- **React (TypeScript)** - Thư viện xây dựng giao diện mạnh mẽ
- **React Hook Form** - Quản lý form dễ dàng, hiệu quả
- **Yup** - Xác thực dữ liệu form
- **React Router DOM** - Quản lý điều hướng
- **Axios** - Gửi request HTTP
- **TanStack React Query** - Quản lý trạng thái server-side
- **TailwindCSS** - Thư viện CSS tiện lợi
- **Prettier & ESLint** - Định dạng và kiểm tra code

## Cấu trúc dự án

```
EVENT-MANAGEMENT-CLIENT/
│── node_modules/
│── public/
│── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── layout/
│   ├── pages/
│   ├── types/
│   ├── utils/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── useRouteElement.tsx
│   │   ├── vite-env.d.ts
│── .editorconfig
│── .gitignore
│── .prettierignore
│── .prettierrc
│── eslint.config.js
│── index.html
│── package-lock.json
│── package.json
│── README.md
│── tsconfig.app.json
│── tsconfig.json
│── tsconfig.node.json
│── vite.config.ts
```

## Cách chạy dự án

1. Cài đặt dependencies:

   ```sh
   npm install
   ```

2. Chạy ứng dụng:

   ```sh
   npm run dev
   ```

3. Mở trình duyệt và truy cập:

   ```sh
   http://localhost:3000
   ```

## License

MIT
