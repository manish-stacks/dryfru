const axios = require('axios');
const crypto = require('crypto');

class PaymentService {
    constructor() {
        this.baseUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
        this.merchantId = process.env.PHONEPE_MERCHANT_ID || 'TESTPGPAYCREDUAT';
        this.merchantKey = process.env.PHONEPE_MERCHANT_KEY || '14d6df8a-75bf-4873-9adf-43bc1545094f';
        this.redirectUrl = process.env.REDIRECT_URL || 'https://api.dyfru.com/payment-response';
    }

    async initiatePayment(paymentDetails) {
        try {
            console.log(paymentDetails)
            const transactionId = crypto.randomBytes(9).toString('hex');
            const merchantUserId = crypto.randomBytes(12).toString('hex');
            const url = `${this.baseUrl}/pg/v1/pay`;

            // Prepare the request payload
            const data = {
                merchantId: this.merchantId,
                merchantTransactionId: transactionId,
                merchantUserId: merchantUserId,
                name: "User",
                amount: paymentDetails?.totalPrice * 100 || 52000, // Amount in Paise
                callbackUrl: paymentDetails?.callbackUrl || 'https://api.dyfru.com/api/v1/check-payment',
                redirectUrl: `${this.redirectUrl}/${transactionId}`,
                redirectMode: 'POST',
                paymentInstrument: {
                    type: 'PAY_PAGE',
                },
            };

            // Convert payload to Base64
            const payload = JSON.stringify(data);
            const payloadBase64 = Buffer.from(payload).toString('base64');

            // Calculate checksum
            const keyIndex = 1; // Hardcoded for sandbox
            const checksumString = payloadBase64 + '/pg/v1/pay' + this.merchantKey;
            const sha256Hash = crypto.createHash('sha256').update(checksumString).digest('hex');
            const checksum = `${sha256Hash}###${keyIndex}`;

            // Prepare headers
            const headers = {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-Merchant-ID': this.merchantId,
            };

            // Make the API request
            const response = await axios.post(url, payloadBase64, { headers });
            return response.data;
        } catch (error) {
            console.error('Error initiating payment:', error?.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = PaymentService;
