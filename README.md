# Umut Şef'in Fast Food Evi

## Çalıştırma

### Front-end
```bash
python -m http.server 8000
```

### Admin doğrulama API (opsiyonel ama yönetici girişi için gerekli)
```bash
ADMIN_PASSWORD='guclu-bir-sifre' node admin-auth-server.mjs
```

Admin giriş ekranı `POST /api/admin-login` endpoint'ine istek atar.
