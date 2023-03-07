import axios from "axios";


export default class VoguePay {
  static base_url = "https://pay.voguepay.com/?p=pay&";

  static generateId() {
    for (
      var e = "vp_",
        t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        r = 0;
      r < 8;
      r++
    )
      e += t.charAt(Math.floor(Math.random() * t.length));
    return e;
  }

  static sortPayload( payload ){
    const _ =  {
      v_merchant_id: payload?.v_merchant_id ?? "",
      phone: payload?.customer?.phone ?? "",
      email: payload?.customer?.email ?? "",
      total: payload?.total ?? "",
      notify_url: payload?.notify_url ?? "",
      cur: payload?.cur ?? "",
      merchant_ref: payload?.merchant_ref ?? "",
      memo: payload?.memo ?? "",
      recurrent: payload?.recurrent ?? "",
      frequency: payload?.frequency ?? "",
      developer_code: payload?.developer_code ?? "",
      store_id: "",
      name: payload?.customer?.name ?? "",
      address: payload?.customer?.address ?? "",
      city: payload?.customer?.city ?? "",
      state: payload?.customer?.state ?? "",
      zipcode: payload?.customer?.zipcode ?? ""
    }

    return _
  }

  static serialize(payload) {
    const SORTED_PAYLOAD = VoguePay.sortPayload(payload);
    const ENCODED_URI_ARR = Array.from(Object.keys(SORTED_PAYLOAD)).map(function (
      key
    ) {
      const ENCODED_KEY = encodeURIComponent(key);
      const ENCODED_VALUE = encodeURIComponent(SORTED_PAYLOAD[key])
        
      const _ = `${ENCODED_KEY}=${ENCODED_VALUE}&`;

      return _;
    });
  
    const id = VoguePay.generateId();

    return (
      `${VoguePay.base_url}id=${id}&webload=${id}&` +
      ENCODED_URI_ARR.join("").slice(0, -1)
    );
  }

  /**
     * Initialize payment.
     * @param {object} payload - Payment payload containing 
     * ```js 
     * Voguepay.init({
        v_merchant_id: '1110-220123',
        total: price,
        notify_url:'https://example.com/notification.php',
        cur: 'NGN',
        merchant_ref: 2000,
        memo:'Payment for Apple M1 Mac ',
        developer_code: '7a61c272aed23',
        customer: {
          name: 'Customer name',
          address: 'Customer address',
          city: 'Customer city',
          state: 'Customer state',
          zipcode: 'Customer zip/post code',
          email: 'owoadeanuoluwapo2@gmail.com',
          phone: 'Customer phone'
        }
     * ```
    */
 
  static async init(payload) {

    const URI = VoguePay.serialize(payload);
   
    try {
      const response = await axios.get(URI, {
        transformResponse: (r) => r,
        headers: { Referer: "https://www.pamsocial.app" },
      });

      return {
        status: "success",
        link: response.data.trim().split(`<iframe src="`)[1].split(`"`)[0],
      };
    } catch (e) {
      return {
        status: "error",
        error_link: e.response.data
          .trim()
          .split(`<iframe src="`)[1]
          .split(`"`)[0],
      };
    }
  }

}

