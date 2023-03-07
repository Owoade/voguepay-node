import axios from "axios";

export default class VoguePay {
  static readonly base_url = "https://pay.voguepay.com/?p=pay&";

  static serialize(payload: PaymentInitPayload) {
    const ENCODED_URI_ARR = Array.from(Object.keys(payload)).map(function (key) {
      const ENCODED_KEY = encodeURIComponent(key);
      const ENCODED_VALUE =
        typeof payload[key] === "object"
          ? encodeURIComponent(JSON.stringify(payload[key]))
          : encodeURIComponent(payload[key]);
      
      const _ = `${ENCODED_KEY}=${ENCODED_VALUE}&`;
    });

    ENCODED_URI_ARR.pop();

    return VoguePay.base_url + ENCODED_URI_ARR.join("");
  }

  static async init(payload: PaymentInitPayload) {
    const URI = VoguePay.serialize( payload );

    try{
        const response = await axios.get(
            URI,
            { 
                transformResponse: (r) => r,
                headers: { Referer: "https://www.pamsocial.app"}
            
            }
        );
    
        return {
            status: "success",
            link: response.data.trim().split(`<iframe src="`)[1].split(`"`)[0]
        };

    }catch(e){
        return {
            status: "error",
            error_link: e.response.data.trim().split(`<iframe src="`)[1].split(`"`)[0]
        }
    }

    
    
  }
}

VoguePay.init({
  v_merchant_id: "9814-0123983",
  total: 3000,
  notify_url: "https://pamsocial-api.onrender.com/web-hook/voguepay/payment",
  cur: "NGN",
  merchant_ref: "ref123",
  memo: "Payment for ",
  developer_code: "5a61be72ab323",
  customer: {
    name: "Owoade Anuoluwapo",
    address: "Customer address",
    city: "Customer city",
    state: "Customer state",
    zipcode: "Customer zip/post code",
    email: "owoadeanuoluwapo2@gmail.com",
    phone: "Customer phone",
  },
});