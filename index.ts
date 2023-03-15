import axios from "axios";
// import { PaymentInitPayload } from "./index.d";


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

  static enncodePayload(payload: any){
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

  static serialize(payload: PaymentInitPayload) {
    const SORTED_PAYLOAD = VoguePay.sortPayload(payload);
    const ENCODED_URI = VoguePay.enncodePayload(SORTED_PAYLOAD)
  
    const id = VoguePay.generateId();

    return (
      `${VoguePay.base_url}?p=pay&id=${id}&webload=${id}&` +
      ENCODED_URI
    );
  }

  static payloadToQueryParams(payload: any){
    const PARAMS_ARR = Array.from(Object.keys(payload)).map(function (
        key
      ) {
        const KEY = key;
        const VALUE = payload[key as any];
          
        const _ = `${KEY}=${VALUE}&`;
  
        return _;
      });
    
    return "?" + PARAMS_ARR.join("").slice(0, -1);
  }

  static getIdFromLink( link: string ){
    if( link.includes("?error=") ) return "";

    return link.split("uid%22%3A%")[1].split("%22%7D")[0];
  }
 
  static async init(payload: PaymentInitPayload) {

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
    } catch (e: any ) {
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

  static async getTransaction( id: string, merchant_id ){
    const payload = {
        v_transaction_id: id,
        v_merchant_id: merchant_id,
        type: "json"
    }

    const QUERY_PARAMS = VoguePay.payloadToQueryParams( payload );

    const URI = VoguePay.base_url + QUERY_PARAMS;

    const response = await axios.get(URI);

    return response.data as Transaction;

  }

}

interface PaymentInitPayload {
    v_merchant_id: string;
    notify_url: string;
    total: number | string,
    cur: "USD" | "NGN",
    memo: string;
    customer:PayingCustomer,
    merchant_ref?: string,
    developer_code?: string;
}

interface PayingCustomer{
    name: string,
    address: string,
    city: string,
    state: string,
    zipcode: string,
    email: string,
    phone: string
}

interface Transaction {
    cur: string,
    total: string,
    merchant_ref: string;
    total_paid_by_buyer: string;
    status: string;
    merchant_id: string
}

interface FlatPayload extends Omit<PaymentInitPayload, "customer">, PayingCustomer {}