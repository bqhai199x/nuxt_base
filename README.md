## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Setup PostgreSQL Database
Make sure PostgreSQL is installed and running on your system.

Create a new database:
```sql
CREATE DATABASE nuxt_base;
```

### 3. Environment Configuration
Create `.env` file from the example:
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/nuxt_base"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
NUXT_SECRET_KEY="your-nuxt-secret-key-here"
```

### 4. Database Migration

**Manual migration:**
```bash
# Reset and migrate
npx prisma migrate reset --force
npx prisma migrate dev --name init_postgresql
npx prisma generate
```

## Development

### Start development server
```bash
npm run dev
```
→ http://localhost:3000

### Database tools
```bash
# View database in Prisma Studio
npm run db:studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

## Production

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Generate static
```bash
npm run generate
```
