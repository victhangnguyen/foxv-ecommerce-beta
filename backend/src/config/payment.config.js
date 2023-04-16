import dotenv from 'dotenv';

dotenv.config();

const VNP_TMNCODE = process.env.VNP_TMNCODE;
const VNP_HASHSECRET = process.env.VNP_HASHSECRET;
const VNP_URL = process.env.VNP_URL;
const VNP_API = process.env.VNP_API;
const VNP_RETURNURL = process.env.VNP_RETURNURL;

const config = {
  vnpayment: {
    vnpTmnCode: VNP_TMNCODE,
    vnpHashSecret: VNP_HASHSECRET,
    vnpUrl: VNP_URL,
    vnpApi: VNP_API,
    vnpReturnUrl: VNP_RETURNURL,
  },
};

export default config;
