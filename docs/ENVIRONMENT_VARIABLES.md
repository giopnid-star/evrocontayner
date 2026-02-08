# Переменные окружения (.env) — Инструкция

## Описание

Этот проект использует файл `.env` для хранения конфиденциальной информации (пароли, ключи API, SMTP-данные и т.д.). Файл `.env` **никогда** не должен коммититься в репозиторий.

## ⚠️ Безопасность

- ✅ `.env` добавлен в `.gitignore` — он НЕ будет закоммичен
- ✅ Установлен `Husky` pre-commit hook — блокирует попытки закоммитить `.env`
- ✅ Используется `.env.example` как шаблон для других разработчиков

**Если случайно закоммитили `.env` с секретами:**
1. Немедленно измените все пароли и ключи на сервисах
2. Удалите `.env` из истории git (или создайте новый репозиторий)
3. Используйте `git filter-repo` для полной очистки истории

## Настройка локального окружения

### Шаг 1: Скопировать шаблон
```bash
cp .env.example .env
```

### Шаг 2: Заполнить значения
Отредактируйте `.env` с реальными значениями:

```dotenv
# ========== DATABASE ==========
DB_PATH=./data/db.sqlite

# ========== SMTP CONFIGURATION ==========
# Для Gmail:
#   1. Включить 2FA в https://myaccount.google.com/security
#   2. Создать App Password: https://myaccount.google.com/apppasswords
#   3. Скопировать 16-значный пароль в SMTP_PASS
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password

# Для Яндекс.Почты:
#   SMTP_HOST=smtp.yandex.ru
#   SMTP_PORT=465 (или 587)
#   SMTP_USER=your_email@yandex.ru
#   SMTP_PASS=ваш_пароль_яндекса

# ========== EMAIL ==========
TO_EMAIL=admin@example.com   # Куда присылать сообщения с контактной формы

# ========== SERVER ==========
PORT=5500                     # Порт Node.js сервера
```

### Шаг 3: Проверить подключение
```bash
npm start
# Должны увидеть: "injecting env (X) from .env" — X = количество переменных
```

## Переменные (подробно)

| Переменная  | Описание | Пример |
|-------------|---------|---------|
| `DB_PATH` | Путь к SQLite БД | `./data/db.sqlite` |
| `SMTP_HOST` | SMTP сервер почты | `smtp.gmail.com` |
| `SMTP_PORT` | Порт SMTP | `587` (TLS) или `465` (SSL) |
| `SMTP_USER` | Email адрес отправителя | `example@gmail.com` |
| `SMTP_PASS` | Пароль приложения SMTP | 16 символов для Gmail |
| `TO_EMAIL` | Email получателя писем | `admin@yoursite.com` |
| `PORT` | Порт Node.js сервера | `5500` |

## Для Render (Production)

На Render переменные окружения устанавливаются через Dashboard:
1. Проект → Environment → Add Environment Variable
2. Скопируйте все ключи и значения из локального `.env`
3. **Никогда** не коммитьте `.env` в git — Render подхватит переменные автоматически

Пример Render Config:
```
PORT=5500
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=app@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
TO_EMAIL=admin@example.com
DB_PATH=/data/db.sqlite
```

## Проблемы и решения

### "injecting env (0) from .env"
**Проблема:** `.env` не загружен или пуст  
**Решение:** Проверьте `ls -la .env` и содержимое: `cat .env`

### Git случайно закоммитил `.env`
**Решение:**
```bash
git rm --cached .env
git commit --amend -m "Remove .env from index"
git push --force
# Затем аннулируйте все ключи на сервисах!
```

### SMTP не работает
**Решение:**
1. Для Gmail — используйте [App Password](https://myaccount.google.com/apppasswords), не обычный пароль
2. Проверьте формат: `SMTP_PASS=1234 5678 9abc defg` (без кавычек)
3. Убедитесь, что SMTP_PORT соответствует протоколу (587 для TLS)

## Рекомендации безопасности

✅ **Делайте:**
- Использовать `.env.example` как шаблон
- Регулярно ротировать пароли приложений
- Использовать 2FA на сервисах (Gmail, Яндекс и т.д.)
- Хранить `.env` локально и в защищённом хранилище секретов
- Проверять `.gitignore` перед каждым коммитом

❌ **НЕ делайте:**
- Коммитить `.env` в git
- Делиться `.env` по email или мессенджерам
- Использовать одинаковые пароли для разных сервисов
- Коммитить API-ключи, токены, сертификаты

## Дополнительные ссылки

- [dotenv документация](https://github.com/motdotla/dotenv)
- [GitHub: Secrets Management Best Practices](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Google App Passwords](https://myaccount.google.com/apppasswords)
- [Render Environment Variables](https://render.com/docs/environment-variables)
