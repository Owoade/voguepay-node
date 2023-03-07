interface PaymentInitPayload {
    v_merchant_id: string;
    notify_url: string;
    total: number | string,
    cur: "USD" | "NGN",
    memo: string;
    customer:PayingCustomer,
    merchant_ref?: string,
    developer_code?: string;
    items?: object[]

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

