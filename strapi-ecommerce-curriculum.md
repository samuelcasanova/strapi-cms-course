# Strapi E-Commerce Curriculum: Self-Hosted Product Catalog
## Tailored for Full-Stack Developers

**Estimated Duration:** 8-10 weeks | **Commitment:** 10-15 hours/week
**Goal:** Build a production-ready, self-hosted product catalog API with Strapi

---

## Phase 1: Foundation & Setup (Weeks 1-2)

### Goals
- Understand Strapi architecture and core concepts
- Set up development environment locally
- Grasp headless CMS principles specific to e-commerce
- Explore Strapi admin interface

### Week 1: Theory & Setup

#### 1.1 Concepts (2-3 hours)
- **Headless CMS for E-Commerce** 
  - Why content decoupling matters for product management
  - Benefits: multi-channel delivery, separation of concerns, scalability
  - Traditional monolith vs. headless approach comparison

- **Strapi Architecture** (watch + read)
  - Controller-Service-Model pattern (Strapi uses this)
  - REST API vs. GraphQL in Strapi
  - Content Type vs. Component vs. Dynamic Zone
  - Database agnostic design

- **Key Concepts for E-Commerce**
  - Product catalogs structure
  - Inventory vs. product information
  - Relationships (Products → Categories, Tags, Variants, etc.)
  - Draft/published workflows for product launches

**Resources:**
- Official Strapi docs: https://docs.strapi.io
- Strapi architecture overview
- Blog post: "Headless CMS for E-Commerce" on Strapi blog

#### 1.2 Local Development Setup (2-3 hours)

**Prerequisites Check:**
```bash
node --version  # Should be >= 18.x
npm --version   # Should be >= 9.x
```

**Installation:**
```bash
# Create new Strapi project
npx create-strapi-app@latest my-ecommerce-api --quickstart

# Navigate to project
cd my-ecommerce-api

# Start development server
npm run develop
```

**Initial Exploration (1 hour):**
- Access admin panel: `http://localhost:1337/admin`
- Create first user account: scrtestingpurposes@gmail.com, Password1
- Explore Settings → API Tokens (you'll need this later)
- Check Database (SQLite default) in `.data` folder
- Review project structure:
  ```
  my-ecommerce-api/
  ├── src/
  │   ├── api/          # Content types & routes
  │   ├── admin/        # Admin customizations
  │   └── plugins/      # Extensions
  ├── config/           # Database, middleware
  ├── package.json
  └── README.md
  ```

**Deliverable:** Successfully running Strapi instance accessible at `localhost:1337`

### Week 2: Admin Interface & Core Concepts

#### 2.1 Creating Your First Content Types (3-4 hours)

**Exercise 1: Product Content Type**

Steps:
1. Admin Panel → Content Manager → Create New
2. Create collection type `Product` with fields:
   - `name` (Text, required)
   - `slug` (UID, from name)
   - `description` (Rich Text)
   - `price` (Decimal, required)
   - `sku` (Text, unique)
   - `stock` (Integer, default: 0)
   - `status` (Enumeration: draft, active, discontinued)
   - `image` (Media, single file)
   - `createdAt`, `updatedAt` (auto)

3. **Advanced settings:**
   - Enable drafts & publish
   - Add to API
   - Set default sort by `name`

4. Test: Create 3 sample products via admin panel

**Exercise 2: Category Content Type**

Fields:
- `name` (Text, required)
- `slug` (UID)
- `description` (Rich Text)
- `icon` (Media)

**Exercise 3: Add Relationships**

Update Product to include:
- `categories` (relation to Category, many-to-many)
- `tags` (relation to Tag, many-to-many) [create Tag type first]

#### 2.2 Understanding Strapi Plugins (2 hours)

**Built-in Plugins to Explore:**
1. **Content Manager** - Your main CMS interface
2. **Media Library** - Asset management
3. **Users** - User authentication
4. **Roles & Permissions** - Access control
5. **Content Type Builder** - Schema management

**Exercise:** 
- Go to Settings → Roles & Permissions
- Create a custom role: "Product Manager"
- Assign permissions: read all, create, update, delete for Products only
- Understand public vs. authenticated access

**Deliverable:** 
- 3 content types with relationships
- 5+ sample products in database
- Understanding of admin interface

---

## Phase 2: REST API & Querying (Weeks 3-4)

### Goals
- Master REST API endpoints Strapi generates
- Learn querying, filtering, sorting, pagination
- Understand authentication and permissions
- Set up Postman for API testing

### Week 3: REST API Fundamentals

#### 3.1 Auto-Generated Routes (2 hours)

Every content type gets automatic routes:

```
GET    /api/products              # List all
GET    /api/products?filters[status][$eq]=active  # Filter
GET    /api/products/:id          # Get one
POST   /api/products              # Create
PUT    /api/products/:id          # Update
DELETE /api/products/:id          # Delete
```

**Test via Postman or curl:**

```bash
# List all products (public by default)
curl http://localhost:1337/api/products

# With query parameters
curl "http://localhost:1337/api/products?pagination[pageSize]=5&sort=name:asc"

# Get with relationships populated
curl "http://localhost:1337/api/products/1?populate=*"
```

#### 3.2 Query Strings Deep Dive (3-4 hours)

**Pagination:**
```
?pagination[pageSize]=10&pagination[page]=1
```

**Sorting:**
```
?sort=price:asc
?sort=createdAt:desc,name:asc
```

**Filtering (Filter API):**
```
?filters[price][$gte]=100&filters[price][$lte]=500
?filters[status][$eq]=active
?filters[categories][slug][$eq]=electronics
?filters[$or][0][name][$containsi]=laptop&filters[$or][1][name][$containsi]=computer
```

**Population (relationships):**
```
?populate=categories,tags           # Specific relations
?populate=*                          # All relations
?populate[categories][populate]=*    # Nested population
```

**Fields Selection:**
```
?fields=name,price,slug             # Only return these fields
```

**Exercise: Build a Postman Collection**

Create a collection with these requests:
- [ ] Get all products (paginated)
- [ ] Get products filtered by price range
- [ ] Get products with categories populated
- [ ] Get products filtered by category slug
- [ ] Get a single product with all relations
- [ ] Get products sorted by popularity (most recent)

**Deliverable:** Postman collection with 6+ tested API requests

#### 3.3 Advanced Query Combinations (2-3 hours)

**Real E-Commerce Queries:**

```bash
# Browse products in Electronics, sorted by price
/api/products?filters[categories][slug][$eq]=electronics&sort=price:asc&populate=categories

# Search products with pagination
/api/products?filters[name][$containsi]=laptop&pagination[pageSize]=20

# Get featured products in stock with images
/api/products?filters[status][$eq]=active&filters[stock][$gte]=1&sort=createdAt:desc&populate=image&pagination[pageSize]=10
```

**Exercise:** 
Create 3 realistic e-commerce queries:
1. Admin dashboard: all products with low stock
2. Frontend: featured products in a category
3. Search: text search with filters

### Week 4: Authentication & Permissions

#### 4.1 Authentication Strategies (2-3 hours)

**Strapi offers:**
1. **Public/Authenticated toggle** (simple)
2. **Custom API tokens** (service-to-service)
3. **User Authentication** (customer accounts)
4. **JWT tokens** (for SPAs and mobile)

**Setup API Token for Development:**

```
Admin Panel → Settings → API Tokens → Create new
- Name: "Development Token"
- Token type: "Full access"
- Copy token
```

Use in requests:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:1337/api/products
```

#### 4.2 Role-Based Access Control (2-3 hours)

**Exercise: Set up Three Roles**

1. **Public Role** (default unauthenticated)
   - Permissions: read Products (active status only)
   - No write access

2. **Authenticated Customer** 
   - Permissions: read Products, read Orders, create Orders
   - No category/pricing edits

3. **Product Manager**
   - Permissions: all CRUD on Products, Categories, Tags
   - No user management

**Implementation:**
- Admin → Settings → Roles & Permissions
- Configure each role
- Test with/without API token

**Test Scenarios:**
- [ ] Public can see active products
- [ ] Public can't update products
- [ ] Authenticated with token can create
- [ ] Product Manager can do everything
- [ ] Customer role restricted properly

**Deliverable:** 
- 3 configured roles with documented permissions
- API token for development
- Test results showing permission enforcement

---

## Phase 3: Advanced Content Modeling (Weeks 5-6)

### Goals
- Design e-commerce schema for real-world scenarios
- Master complex relationships and components
- Implement variants, pricing, and inventory
- Understand data normalization

### Week 5: E-Commerce Schema Design

#### 5.1 Product Variants & SKU Management (3-4 hours)

**Challenge:** Single product with multiple variants (size, color, etc.)

**Solution 1: Variant Component (Recommended)**

Create component: `ProductVariant`
- `sku` (Text, unique)
- `size` (Text or enum)
- `color` (Text)
- `price` (Decimal, can override base)
- `stock` (Integer)
- `barcode` (Text)

Add to Product:
```
- variants (Component, repeatable)
  └─ ProductVariant array
```

**Exercise:**
- Create T-Shirt product with variants:
  - Black-S, Black-M, Black-L
  - Blue-S, Blue-M, Blue-L
- Set different prices/stock per variant
- Query: Get T-Shirt with all variants

```bash
curl "http://localhost:1337/api/products?filters[slug][$eq]=t-shirt&populate=variants"
```

#### 5.2 Dynamic Pricing & Promotions (2-3 hours)

**Schema Addition:**

Create new content type: `Promotion`
- `name` (Text)
- `type` (Enum: percentage, fixed, buy-one-get-one)
- `value` (Decimal)
- `startDate`, `endDate` (DateTime)
- `applicableProducts` (relation to Product, many-to-many)
- `isActive` (Boolean)

Add to Product:
```
- activePromotion (relation to Promotion, one-to-one)
```

**Exercise:**
- Create promotions: "Summer Sale 20%", "Flash Deal $10 off"
- Apply to products
- Query for active promotions

#### 5.3 Inventory & Stock Tracking (2-3 hours)

**Create Content Type: StockLevel**
- `sku` (Text, relation to Product)
- `quantity` (Integer)
- `warehouse` (Text: main, backup)
- `lastRestockDate` (DateTime)
- `reorderPoint` (Integer)
- `isLowStock` (Boolean, computed)

**Advanced: Inventory Webhook**

```javascript
// src/api/product/controllers/product.js
async create(ctx) {
  const result = await super.create(ctx);
  
  // Trigger inventory check
  if (result.data.stock < result.data.reorderPoint) {
    // Send notification to warehouse system
    console.log('Low stock alert:', result.data.sku);
  }
  
  return result;
}
```

**Deliverable:** 
- Product with variants schema
- Promotion system integrated
- Inventory tracking with webhook alerts

#### 5.4 Relationships Best Practices (2-3 hours)

**Common E-Commerce Relationships:**

```
Product
├── Categories (many-to-many)
├── Tags (many-to-many)
├── Variants (one-to-many component)
├── Promotion (one-to-one)
├── Reviews (one-to-many)
├── RelatedProducts (many-to-many)
└── Image (one-to-many media)

Category
├── Products (many-to-many)
└── ParentCategory (self-relation)
```

**Exercise: Map Your Schema**

Draw (or write) your ideal product catalog schema:
- What content types?
- What relationships?
- What components vs. separate types?
- Where will data be duplicated?

**Decision Points:**
- Component vs. Content Type?
  - **Use Component:** One-off data tied to parent (variants)
  - **Use Content Type:** Reusable, standalone (categories)
- One-to-many vs. many-to-many?
- When to use text fields vs. relations?

**Deliverable:** Documented schema diagram

### Week 6: Content Modeling Advanced

#### 6.1 SEO & Metadata (2-3 hours)

Create component: `SEOMetadata`
- `metaTitle` (Text, 50-60 chars)
- `metaDescription` (Text, 155-160 chars)
- `keywords` (Text)
- `ogImage` (Media)
- `slug` (UID)

Add to Product, Category, etc.

**Exercise:**
- Add SEO metadata to all products
- Validate field lengths
- Test slug uniqueness

#### 6.2 Internationalization (i18n) (2-3 hours)

**Enable i18n Plugin:**

```bash
npm run strapi plugin:install i18n
npm run develop
```

**Content Internationalization:**
- Admin → Settings → Internationalizations
- Enable for Product, Category
- Add languages: English, Spanish, French
- Translate key fields

**Exercise:**
- Translate 3 products into 2 languages
- Query specific language:
  ```
  /api/products?locale=es
  /api/products?locale=en
  ```

**Deliverable:** 
- SEO metadata template
- Multilingual products
- Translation workflow documented

---

## Phase 4: Custom API & Backend Logic (Weeks 7-8)

### Goals
- Write custom controllers and services
- Create business logic (pricing, inventory)
- Build custom routes
- Implement webhooks and events

### Week 7: Custom Controllers & Services

#### 7.1 Controllers & Services Pattern (3-4 hours)

**Strapi Services** (business logic):
```javascript
// src/api/product/services/product.js
module.exports = ({ strapi }) => ({
  async findByCategory(categorySlug) {
    return strapi.db.query('api::product.product').findMany({
      where: {
        categories: {
          slug: categorySlug
        }
      },
      populate: ['categories', 'variants', 'image']
    });
  },

  async calculateFinalPrice(productId) {
    const product = await strapi.entityService.findOne(
      'api::product.product',
      productId,
      { populate: 'activePromotion' }
    );
    
    let price = product.price;
    if (product.activePromotion) {
      const { type, value } = product.activePromotion;
      price = type === 'percentage' 
        ? price * (1 - value / 100)
        : price - value;
    }
    return price;
  },

  async checkStock(productId, variantId, quantity) {
    // Your business logic
    return quantity <= availableStock;
  }
});
```

**Controllers** (API endpoints):
```javascript
// src/api/product/controllers/product.js
module.exports = {
  async findByCategory(ctx) {
    const { slug } = ctx.params;
    const products = await strapi
      .service('api::product.product')
      .findByCategory(slug);
    ctx.body = products;
  },

  async getFinalPrice(ctx) {
    const { id } = ctx.params;
    const price = await strapi
      .service('api::product.product')
      .calculateFinalPrice(id);
    ctx.body = { id, finalPrice: price };
  }
};
```

**Routes:**
```javascript
// src/api/product/routes/product.js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/products/category/:slug',
      handler: 'product.findByCategory',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/products/:id/final-price',
      handler: 'product.getFinalPrice'
    }
  ]
};
```

**Exercise:** Create 3 custom endpoints:
1. `/api/products/category/:slug` - products in category
2. `/api/products/:id/final-price` - with promotions applied
3. `/api/products/search?q=laptop` - text search

#### 7.2 Business Logic & Validation (2-3 hours)

**Example: Prevent overselling**

```javascript
// src/api/order/services/order.js
async createOrder(items) {
  // Validate stock before creating
  for (const item of items) {
    const { quantity, variantId } = item;
    const variant = await strapi.db.query(
      'api::product.product'
    ).findOne({
      where: { 'variants.id': variantId },
      populate: 'variants'
    });
    
    if (!variant || variant.stock < quantity) {
      throw new Error(`Insufficient stock for ${variant.sku}`);
    }
  }
  
  // Create order
  return strapi.entityService.create('api::order.order', { data: items });
}
```

**Exercise:**
- Add validation to product creation (price > 0, sku required)
- Add stock validation on variant purchase
- Test error handling

#### 7.3 Middleware & Plugins (2-3 hours)

**Custom Middleware Example: Request logging**

```javascript
// config/middlewares.js
module.exports = [
  'strapi::cors',
  'strapi::poweredBy',
  {
    name: 'custom::requestLogger',
    config: {
      enabled: true
    }
  },
];

// src/middlewares/requestLogger.js
module.exports = (config, { strapi }) => {
  return (ctx, next) => {
    console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.path}`);
    return next();
  };
};
```

**Exercise:**
- Create middleware that logs slow requests
- Add request ID tracking
- Implement rate limiting middleware

**Deliverable:**
- 3 custom endpoints with services
- Input validation
- Error handling
- Custom middleware for logging

### Week 8: Webhooks & Real-World Integration

#### 8.1 Webhooks (3-4 hours)

**Admin Panel → Settings → Webhooks**

Create webhook triggers:
1. **Product Created** → POST to external service
2. **Product Updated** → Trigger inventory sync
3. **Order Created** → Send confirmation email

**Exercise: Inventory Sync Webhook**

```javascript
// Webhook configuration
{
  "name": "Inventory Sync",
  "event": "entry.update",
  "url": "https://warehouse-api.internal/sync",
  "headers": {
    "Authorization": "Bearer warehouse-token"
  },
  "isEnabled": true
}
```

**Webhook Payload Handler (on your external service):**

```javascript
app.post('/sync', (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'product.update') {
    syncInventory(data.sku, data.stock);
  }
  
  res.json({ received: true });
});
```

#### 8.2 Email Notifications (2-3 hours)

**Use Strapi Email Plugin:**

```bash
npm install @strapi/plugin-email
npm run develop
```

**Configuration (config/plugins.js):**
```javascript
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'sendgrid', // or nodemailer
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: 'noreply@yourecommerce.com',
        defaultReplyTo: 'support@yourecommerce.com',
      },
    },
  },
});
```

**Send Email on Product Created:**

```javascript
// src/api/product/services/product.js
async create(data) {
  const result = await super.create(data);
  
  await strapi.plugin('email').service('email').send({
    to: 'admin@yourecommerce.com',
    subject: `New product added: ${data.name}`,
    html: `<p>Product ${data.name} (${data.sku}) has been created.</p>`
  });
  
  return result;
}
```

**Exercise:**
- Set up email provider
- Send welcome email on user signup
- Send stock alert when low
- Send order confirmation

#### 8.3 External API Integration (2-3 hours)

**Example: Sync with payment processor or shipping API**

```javascript
// src/api/order/services/order.js
async createOrder(data) {
  const order = await strapi.entityService.create(
    'api::order.order',
    { data }
  );
  
  // Call payment processor
  const paymentResult = await fetch('https://payment-api/charge', {
    method: 'POST',
    body: JSON.stringify({
      amount: order.total,
      orderId: order.id
    })
  });
  
  // Update order with payment ID
  await strapi.entityService.update('api::order.order', order.id, {
    data: { paymentId: paymentResult.paymentId }
  });
  
  return order;
}
```

**Deliverable:**
- Webhook to external inventory system
- Email notifications on key events
- Payment processor integration
- Error handling & retry logic

---

## Phase 5: Frontend Integration & Deployment (Weeks 9-10)

### Goals
- Connect React/Next.js frontend to Strapi
- Implement caching strategies
- Deploy to production
- Monitor and maintain

### Week 9: Frontend Integration

#### 9.1 Next.js Integration (3-4 hours)

**Setup:**
```bash
npx create-next-app@latest my-ecommerce-frontend
cd my-ecommerce-frontend
npm install axios
```

**Strapi API Client:**
```javascript
// lib/strapi.js
const strapiURL = process.env.NEXT_PUBLIC_STRAPI_URL;

export const strapiRequest = async (endpoint, options = {}) => {
  const mergedOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  if (process.env.STRAPI_API_TOKEN) {
    mergedOptions.headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }

  return fetch(`${strapiURL}/api${endpoint}`, mergedOptions)
    .then((res) => res.json());
};
```

**Fetch Products Page:**
```javascript
// pages/products/[category].js
import { strapiRequest } from '@/lib/strapi';

export default function CategoryProducts({ products, category }) {
  return (
    <div>
      <h1>{category.name}</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const data = await strapiRequest(
    `/products?filters[categories][slug][$eq]=${params.category}&populate=image,variants`
  );
  
  return {
    props: {
      products: data.data,
      category: data.category,
    },
    revalidate: 3600, // ISR
  };
}

export async function getStaticPaths() {
  const categories = await strapiRequest('/categories');
  
  return {
    paths: categories.data.map((cat) => ({
      params: { category: cat.slug },
    })),
    fallback: 'blocking',
  };
}
```

**Exercise:**
- [ ] Create products listing page
- [ ] Build product detail page with variants
- [ ] Implement search with filters
- [ ] Shopping cart with Strapi

#### 9.2 Image Optimization & Caching (2-3 hours)

**Image handling from Strapi:**

```javascript
// components/ProductImage.js
import Image from 'next/image';

export default function ProductImage({ image }) {
  if (!image) return null;

  const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`;

  return (
    <Image
      src={imageUrl}
      alt={image.alternativeText}
      width={400}
      height={400}
      quality={75}
      priority={false}
    />
  );
}
```

**Caching Headers (Strapi):**
```javascript
// config/middlewares.js
{
  name: 'strapi::security',
  config: {
    contentSecurityPolicy: false,
  },
},
{
  resolve: 'strapi::cors',
  options: {
    origin: ['http://localhost:3000'],
  },
},
```

**ISR (Incremental Static Regeneration):**
- Set `revalidate` in getStaticProps
- Rebuild pages based on webhook

**Deliverable:**
- Working Next.js storefront
- Product pages with images
- Search & filtering
- Performance optimized

### Week 10: Deployment & Monitoring

#### 10.1 Production Deployment (2-3 hours)

**Choose Hosting:**
- **VPS (DigitalOcean, Linode, AWS)** - Full control
- **Heroku** - Easiest setup
- **Railway** - Modern alternative
- **Self-hosted** - Your own server

**Production Strapi Setup:**

```bash
# Environment variables (.env.production)
DATABASE_CLIENT=postgres
DATABASE_HOST=db.example.com
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=user
DATABASE_PASSWORD=securepass
JWT_SECRET=your-secret-key
API_TOKEN_SALT=your-salt
ADMIN_JWT_SECRET=admin-secret
NODE_ENV=production
```

**Database Migration to Production:**

```bash
# Backup development data
sqlite3 .data/data.db ".dump" > backup.sql

# Use PostgreSQL for production
npm install pg
# Update database config
```

**Build & Deploy:**
```bash
# Test production build locally
npm run build
npm run start

# Deploy to hosting (example: Railway)
# 1. Push to Git
# 2. Connect repository
# 3. Set environment variables
# 4. Deploy
```

#### 10.2 Monitoring & Maintenance (2-3 hours)

**Setup Monitoring:**

```javascript
// src/api/health/controllers/health.js
module.exports = {
  check: async (ctx) => {
    const dbStatus = await strapi.db.connection.raw('SELECT 1');
    ctx.body = {
      status: 'ok',
      timestamp: new Date(),
      database: dbStatus ? 'connected' : 'disconnected',
      uptime: process.uptime(),
    };
  }
};
```

**Logging & Error Tracking:**
```bash
npm install sentry # or similar service
```

**Backup Strategy:**
- Daily database backups
- Media file backups
- Version control for code
- Document recovery procedure

**Monitoring Checklist:**
- [ ] Set up uptime monitoring
- [ ] Database backup automation
- [ ] Error tracking (Sentry/similar)
- [ ] Performance monitoring
- [ ] Log aggregation
- [ ] Security patching schedule

**Deliverable:**
- Deployed production Strapi instance
- Monitoring setup
- Backup procedures documented
- Disaster recovery plan

---

## Practical Project Milestones

### Project: "TechStore" E-Commerce Catalog

**Week 1-2:** Basic Schema
- Products with basic info
- Categories
- Public listing API

**Week 3-4:** Advanced Queries
- Filter by category, price, stock
- Search functionality
- Promotional pricing API

**Week 5-6:** Full Data Model
- Product variants (sizes, colors)
- Inventory tracking
- Customer reviews

**Week 7-8:** Business Logic
- Stock validation
- Promotion engine
- Order management
- Webhook to shipping system

**Week 9-10:** Frontend & Launch
- Next.js storefront
- Product pages
- Shopping cart
- Deployment to production

---

## Resources & References

### Official Documentation
- **Strapi Docs:** https://docs.strapi.io
- **Strapi Community:** https://discord.gg/strapi
- **API Reference:** https://docs.strapi.io/dev-docs/api/rest

### Recommended Tools
- **Postman** - API testing
- **Git/GitHub** - Version control
- **Docker** - Containerization
- **VSCode** - IDE with Strapi extension

### Key Concepts to Understand
- REST API design principles
- Relational database design
- Authentication & JWT
- API rate limiting
- Database indexing & optimization
- CI/CD pipelines

### Common E-Commerce Patterns
- Inventory management
- Multi-currency pricing
- Discount engines
- Cart & order workflows
- User reviews & ratings
- Wishlist functionality

---

## Troubleshooting Guide

### Common Issues

**Issue: "Content Type not appearing in API"**
- Solution: Go to Content Type → Settings → Advanced → Add to API

**Issue: "Relations not populating in response"**
- Solution: Use `?populate=relationName` or `?populate=*`

**Issue: "Permission denied" on API calls**
- Solution: Check role permissions in Settings → Roles & Permissions

**Issue: "Database migrations failing"**
- Solution: Use different database for prod (PostgreSQL > SQLite)

**Issue: "Large response times"**
- Solution: Implement caching, optimize queries, use CDN for media

---

## Next Steps After Completing

1. **Advanced Strapi Features**
   - Custom plugins development
   - Database optimization
   - Multi-tenancy patterns

2. **Frontend Scaling**
   - Implement caching layer (Redis)
   - GraphQL usage optimization
   - Progressive Web App

3. **Operations**
   - Containerization with Docker
   - CI/CD pipeline setup
   - Load testing & optimization

4. **Commerce Features**
   - Payment integration
   - Shipping provider APIs
   - Marketing automation
   - Analytics integration

---

## Final Checklist: Ready for Production

- [ ] All content types properly configured
- [ ] Role-based access control implemented
- [ ] Custom business logic in services
- [ ] Webhooks for external integrations
- [ ] Frontend properly integrated
- [ ] Database backups automated
- [ ] Error handling & logging setup
- [ ] Performance optimized
- [ ] Security best practices applied
- [ ] Documentation written
- [ ] Monitoring & alerting configured
- [ ] Team training completed

---

**Good luck with your Strapi journey! 🚀**
