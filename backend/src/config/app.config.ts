export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    bucketName: process.env.AWS_S3_BUCKET,
    endpoint: process.env.AWS_ENDPOINT,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10) || 587,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM || 'noreply@buildhub.uz',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  commission: {
    clientRate: parseFloat(process.env.COMMISSION_CLIENT_RATE) || 0.05,
    workerRate: parseFloat(process.env.COMMISSION_WORKER_RATE) || 0.10,
  },
});
