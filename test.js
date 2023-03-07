import VoguePay from "./index.js";

(async function(){
    const res = await VoguePay.init({
      v_merchant_id: '1234-5678923',
          total: 2000,
          notify_url:'https://example.com/notification.php',
          cur: 'NGN',
          merchant_ref: 'ref123',
          memo:'Payment for ',
          developer_code: '5a61be72ab323',
          customer: {
            name: 'Customer Name',
            address: 'Customer address',
            city: 'Customer city',
            state: 'Customer state',
            zipcode: 'Customer zip/post code',
            email: 'owoadeanuoluwapo2@gmail.com',
            phone: 'Customer phone'
          }
    })

    console.log( res )
    })()