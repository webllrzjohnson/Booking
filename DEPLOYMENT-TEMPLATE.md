# Next.js VPS Deployment Template

**Stack:** Next.js 15 + TypeScript + Prisma 7 + NextAuth v5 + PostgreSQL + Nginx + PM2

Replace these placeholders throughout:
- `YOUR_DOMAIN` → your production domain (e.g., app.example.com)
- `YOUR_PROJECT_NAME` → your project folder name (e.g., my-app)
- `YOUR_DB_NAME` → your database name (e.g., my_app_db)
- `YOUR_DB_USER` → your database user (e.g., my_app_user)
- `YOUR_GITHUB_REPO` → your GitHub repository URL

---

## Part 1: Initial Server Setup

### 1.1 Connect to VPS

```bash
ssh root@YOUR_VPS_IP
```

### 1.2 Update System

```bash
apt update && apt upgrade -y
```

### 1.3 Install Node.js 20+

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v  # Verify v20+
```

### 1.4 Install PostgreSQL

```bash
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
```

---

## Part 2: Database Setup

### 2.1 Access PostgreSQL

```bash
sudo -u postgres psql
```

### 2.2 Create Database and User

```sql
CREATE DATABASE YOUR_DB_NAME;
CREATE USER YOUR_DB_USER WITH ENCRYPTED PASSWORD 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE YOUR_DB_NAME TO YOUR_DB_USER;
\c YOUR_DB_NAME
GRANT ALL ON SCHEMA public TO YOUR_DB_USER;
\q
```

---

## Part 3: Deploy Application

### 3.1 Clone Repository

```bash
cd /var/www
git clone YOUR_GITHUB_REPO YOUR_PROJECT_NAME
cd YOUR_PROJECT_NAME
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Create Environment File

```bash
nano .env
```

Add:

```env
DATABASE_URL=postgresql://YOUR_DB_USER:YOUR_SECURE_PASSWORD@localhost:5432/YOUR_DB_NAME
NEXTAUTH_URL=https://YOUR_DOMAIN
NEXTAUTH_SECRET=GENERATE_WITH_OPENSSL_BELOW
AUTH_TRUST_HOST=true
```

Generate secret:

```bash
openssl rand -base64 32
```

Paste the output as `NEXTAUTH_SECRET` value. Save: `Ctrl+O`, `Enter`, `Ctrl+X`.

### 3.4 Setup Database

```bash
npx prisma generate
npx prisma db push
npm run db:seed  # If you have a seed script
```

### 3.5 Build Application

```bash
npm run build
```

---

## Part 4: PM2 Setup

### 4.1 Install PM2

```bash
npm install -g pm2
```

### 4.2 Start Application

```bash
pm2 start npm --name "YOUR_PROJECT_NAME" -- start
pm2 save
pm2 startup
```

Copy and run the command PM2 outputs.

---

## Part 5: Nginx Setup

### 5.1 Install Nginx

```bash
apt install -y nginx
```

### 5.2 Create Nginx Config

```bash
nano /etc/nginx/sites-available/YOUR_PROJECT_NAME
```

Add:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name YOUR_DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;
}
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`.

### 5.3 Enable Site

```bash
ln -s /etc/nginx/sites-available/YOUR_PROJECT_NAME /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

---

## Part 6: SSL Certificate

### 6.1 Install Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### 6.2 Get Certificate

```bash
certbot --nginx -d YOUR_DOMAIN
```

Follow prompts. Select option 2 (redirect HTTP to HTTPS).

### 6.3 Test Auto-Renewal

```bash
certbot renew --dry-run
```

---

## Part 7: Firewall Setup

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

---

## Part 8: Test Deployment

Visit: `https://YOUR_DOMAIN`

Your app should be live!

---

## Future Updates

### Update Code

```bash
cd /var/www/YOUR_PROJECT_NAME
git pull origin main
npm install
npx prisma generate
npx prisma db push  # If schema changed
npm run build
pm2 restart YOUR_PROJECT_NAME
```

### View Logs

```bash
pm2 logs YOUR_PROJECT_NAME
```

### Check Status

```bash
pm2 status
systemctl status nginx
systemctl status postgresql
```

---

## Common Issues

### Login fails with "UntrustedHost" error

**Solution:** Add `AUTH_TRUST_HOST=true` to `.env`, then `pm2 restart YOUR_PROJECT_NAME`

### "NEXTAUTH_SECRET must be provided"

**Solution:** Generate secret with `openssl rand -base64 32` and add to `.env`

### Database connection fails

**Solution:** Check `DATABASE_URL` in `.env` matches your PostgreSQL credentials

### Port 3000 already in use

**Solution:** `pm2 delete YOUR_PROJECT_NAME` then restart

### Changes not showing after git pull

**Solution:** Run `npm run build` and `pm2 restart YOUR_PROJECT_NAME`

---

## Environment Variables Reference

Required `.env` variables:

```env
# Database
DATABASE_URL=postgresql://YOUR_DB_USER:password@localhost:5432/YOUR_DB_NAME

# NextAuth v5
NEXTAUTH_URL=https://YOUR_DOMAIN
NEXTAUTH_SECRET=min_32_chars_random_string
AUTH_TRUST_HOST=true

# Add any additional variables your app needs
NEXT_PUBLIC_APP_URL=https://YOUR_DOMAIN
```

---

## Security Checklist

- [ ] Strong database password (16+ chars, mixed case, numbers, symbols)
- [ ] `NEXTAUTH_SECRET` generated with `openssl rand -base64 32`
- [ ] SSL certificate installed (HTTPS only)
- [ ] Firewall enabled (UFW)
- [ ] `.env` file never committed to Git
- [ ] Regular system updates: `apt update && apt upgrade`
- [ ] SSH key authentication (disable password login)

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| View logs | `pm2 logs YOUR_PROJECT_NAME` |
| Restart app | `pm2 restart YOUR_PROJECT_NAME` |
| Stop app | `pm2 stop YOUR_PROJECT_NAME` |
| Restart Nginx | `systemctl restart nginx` |
| Test Nginx config | `nginx -t` |
| View PostgreSQL logs | `tail -f /var/log/postgresql/*.log` |
| Connect to database | `psql -U YOUR_DB_USER -d YOUR_DB_NAME` |
| Renew SSL | `certbot renew` |

---

**Template Version:** 1.0  
**Last Updated:** February 2026  
**Compatible With:** Next.js 14/15, Prisma 7, NextAuth v5, Node.js 20+
