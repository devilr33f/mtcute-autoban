import { existsSync } from 'fs'

import dotenv from 'dotenv'
import env from 'env-var'

// @note: this is required mostly for development purposes or non-docker environment
dotenv.config({
  path: (process.env.NODE_ENV === 'development' && existsSync('.env.development')) ? '.env.development' : '.env',
})

export default {
  package: {
    name: env.get('npm_package_name').default('unknown').asString(),
    version: env.get('npm_package_version').default('unknown').asString(),
    mode: env.get('NODE_ENV').default('production').asString(),
  },
  telegram: {
    apiId: env.get('TELEGRAM_API_ID').required().asInt(),
    apiHash: env.get('TELEGRAM_API_HASH').required().asString(),
    storagePath: env.get('TELEGRAM_STORAGE_PATH').default('../storage').asString(),
  },
  crypto: {
    key: env.get('CRYPTO_KEY').required().asString(),
    iv: env.get('CRYPTO_IV').required().asString(),
  },
  autoban: {
    inactiveTime: env.get('AUTOBAN_INACTIVE_TIME').default(604800).asInt(),
  },
}
