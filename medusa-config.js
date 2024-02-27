const dotenv = require("dotenv");
dotenv.config({ path: './.env' } );

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "https://medusa-supabase.vercel.app";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.NEXT_PUBLIC_MEDUSA_ADMIN_BACKEND_URL || "http://192.168.0.104.8000/";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: false,
      
      serve: process.env.NODE_ENV === "development",
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
      serve: false,
      backend: "http://localhost:7001",
    },
  },
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis" || "@medusajs/event-bus-local",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL || process.env.CACHE_REDIS_URL,
      ttl:30,
    }
  },
  // featureFlags: {
  //   product_categories: true,
  //   // ...
  // },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  database_logging: [
    "query", "error",
  ],
  database_extra: 
      process.env.NODE_ENV !== "development"
        ? { ssl: { rejectUnauthorized: false } }
        : {},
    
  
  jwtSecret: process.env.JWT_SECRET || "supersecret",
  cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
  store_cors: STORE_CORS,
  database_type:"postgres",
  database_url: DATABASE_URL || "postgres://postgres@localhost/medusa-store",
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
   redis_url: REDIS_URL,
   redis_prefix: process.env.REDIS_PREFIX || "medusa:",
   session_options: {
    name: process.env.SESSION_NAME || 
      "custom",
  },
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
