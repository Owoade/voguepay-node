import axios from "axios";
import { PaymentInitPayload } from "./index.d";


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

  static sortPayload( payload: PaymentInitPayload ){
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

  static serialize(payload: PaymentInitPayload) {
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

 
  static async init(payload: PaymentInitPayload) {

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