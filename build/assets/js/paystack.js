'use strict';

function processPaystackGateway() {
    var handler = PaystackPop.setup({
        key: 'pk_test_7fb7a6fdf32b92f648620e46697b79810c7ad291',
        email: 'tobiwily@yahoo.com',
        amount: 1234567,
        currency: "NGN",
        metadata: {
            custom_fields: [{
                display_name: "Mobile Number",
                variable_name: "mobile_number",
                value: '080123456789'
            }]
        },
        callback: function (response) {
            alert('success. transaction ref is ' + response.reference);

            response['user_id'] = 2;
            response['amount'] = 1234567;
            response['payment_plan_id'] = 1;

            processTransactionResponse(response);
        },
        onClose: function () {
            alert('window closed');
        }
    });
    handler.openIframe();
}

function processTransactionResponse(response) {
    $.post('/payments/save-transaction-info', response, function (data) {
        if (data) {
            console.log(data);
        }
    });
}