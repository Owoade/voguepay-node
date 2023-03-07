# Voguepay Node SDK

Node js SDK for Voguepay.

### Installation

Simply run this command

```
npm install voguepay-node
```
### Generate payment link 🔗

```js
    import VoguePay from "voguepay-node"

    (async function(){
            await Voguepay.init({
                v_merchant_id: '9814-0123983',
                total: price,
                notify_url:'https://example.com/notification.php',
                cur: 'NGN',
                merchant_ref: 'ref123',
                memo:'Payment for Apple M1',
                developer_code: '5a61be72ab323',
                customer: {
                name: 'Customer name',
                address: 'Customer address',
                city: 'Customer city',
                state: 'Customer state',
                zipcode: 'Customer zip/post code',
                email: 'owoadeanuoluwapo2@gmail.com',
                phone: 'Customer phone'
                }
            })
    })();

```

⚠️ This SDK doesn't support typescript yet. However jsdocs are in place to guide you on the contents of the payload.

### Contributing

Please feel free to fork this package and contribute by submitting a pull request to enhance the functionalities.


Created with 🧡 by [Owoade](https://my-portfolio-owoade.vercel.app/)