import axios from "axios";


export default class VoguePay {
  static base_url = "https://pay.voguepay.com/";

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
      recurrent: "null",
      frequency: 0,
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

  static enncodePayload(payload ){
    const ENCODED_URI_ARR = Array.from(Object.keys(payload)).map(function (
        key
      ) {
        const ENCODED_KEY = encodeURIComponent(key);
        const ENCODED_VALUE = encodeURIComponent(payload[key])
          
        const _ = `${ENCODED_KEY}=${ENCODED_VALUE}&`;
  
        return _;
      });
    
    return ENCODED_URI_ARR.join("").slice(0, -1);
  }

  static serialize( payload ) {
    const SORTED_PAYLOAD = VoguePay.sortPayload(payload);
    const ENCODED_URI = VoguePay.enncodePayload(SORTED_PAYLOAD)
  
    const id = VoguePay.generateId();

    return (
      `${VoguePay.base_url}?p=pay&id=${id}&webload=${id}&` +
      ENCODED_URI
    );
  }

  static payloadToQueryParams( payload ){
    const PARAMS_ARR = Array.from(Object.keys(payload)).map(function (
        key
      ) {
        const KEY = key;
        const VALUE = payload[key];
          
        const _ = `${KEY}=${VALUE}&`;
  
        return _;
      });
    
    return "?" + PARAMS_ARR.join("").slice(0, -1);
  }

  static getIdFromLink( link ){
    if( link.includes("?error=") ) return "";

    return link.split("uid%22%3A%")[1].split("%22%7D")[0];
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
 
  static async init( payload ) {

    const URI = VoguePay.serialize(payload);
  
    try {
      const response = await axios.get(URI, {
        transformResponse: (r) => r,
        headers: { Referer: "https://www.pamsocial.app" },
      });

      const link = response.data.trim().split(`<iframe src="`)[1].split(`"`)[0];

      return {
        status: "success",
        link,
        transaction_id: this.getIdFromLink(link)
      };
    } catch (e) {
      return {
        status: "error",
        error_link: e.response.data
          .trim()
          .split(`<iframe src="`)[1]
          .split(`"`)[0],
        transaction_id: ""
      };
    }
  }

  static async getTransaction( id ){
    const payload = {
        v_transaction_id: id,
        v_merchant_id: merchant_id,
        type: "json"
    }

    const QUERY_PARAMS = VoguePay.payloadToQueryParams( payload );

    const URI = VoguePay.base_url + QUERY_PARAMS;

    const response = await axios.get(URI);

    return response.data;

  }

}

 