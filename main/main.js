/**
 * Created by gaole on 7/19/16.
 */
'use strict';


function printReceipt(receipt) {
    var text = '***<没钱赚商店>收据***';

    receipt.receiptItems.forEach(function (receiptItem) {
        text += '\n' + '名称：' + receiptItem.cartItem.item.name + '，数量：' + receiptItem.cartItem.count +
            receiptItem.cartItem.item.unit + '，单价：' + receiptItem.cartItem.item.price.toFixed(2) + '(元)' + '，小计：' +
            receiptItem.subtotal.toFixed(2) + '(元)';
    });

    text += '\n' + '----------------------' + '\n';
    text += promotionText(receipt) +'\n'+'**********************' + '\n' +
    '----------------------' + '\n' ;
    text += '总计：' + receipt.total+'(元)'+'\n'+'节省：' + formatMoney(receipt.discount)+'(元)'+'\n'+
    '**********************';
    console.log(text);
}

function formatMoney(money) {
    return money.toFixed(2);
}

function promotionText(receipt) {
    var promotionType = '';
    var promotionContent = '';

    for (var i = 0; i < receipt.receiptItems.length; i++) {
        if (receipt.receiptItems[i].type === 'BUY_TWO_GET_ONE_FREE') {
            promotionType = '买二赠一商品';
            promotionContent += '\n' + '名称：' + receipt.receiptItems[i].cartItem.item.name + '，数量：' +
                receipt.receiptItems[i].promotionCount + receipt.receiptItems[i].cartItem.item.unit
        }
    }
    
    return promotionType + promotionContent;
}

function buildReceipt(receiptItems) {
    var total = 0;
    var discount = 0;

    receiptItems.forEach(function (receiptItem) {
        total += receiptItem.subtotal;
        discount += receiptItem.saved;
    });

    return {receiptItems: receiptItems, total: total, discount: discount};
}

function buildReceiptItems(cartItems, promotions) {
    var receiptItems = [];

    for (var i = 0; i < cartItems.length; i++) {
        var promotionType = getPromotionType(cartItems[i].item.barcode, promotions);
        receiptItems.push(discount(cartItems[i], promotionType));
    }
    return receiptItems;
}

function discount(cartItem, promotionType) {
    var saved = 0;

    if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
        saved = cartItem.item.price * parseInt(cartItem.count / 3);
    } else if (promotionType === 'A_95_PRESENT_CHARGE') {
        saved = cartItem.item.price * cartItem.count * 0.05;
    }

    var subtotal = cartItem.item.price * parseInt(cartItem.count) - saved;

    return {
        cartItem: cartItem, subtotal: subtotal, saved: saved,
        type: promotionType, promotionCount: parseInt(cartItem.count / 3)
    };
}

function getPromotionType(barcode, promotions) {
    for (var i = 0; i < promotions.length; i++) {
        for (var j = 0; j < promotions[i].barcodes.length; j++) {
            if (promotions[i].barcodes[j] === barcode) {
                return promotions[i].type;
            }
        }
    }
    return;
}

function buildCartItems(tags, allItems) {
    var cartItems = [];

    for (var i = 0; i < tags.length; i++) {
        var splittedTag = tags[i].split('-');
        var barcode = splittedTag[0];
        var count = parseFloat(splittedTag[1] || 1);

        var cartItem = findCartItem(cartItems, barcode);

        if (cartItem) {
            cartItem.count++;
        } else {
            var item = findItem(allItems, barcode);
            cartItems.push({item: item, count: count});
        }
    }
    return cartItems;
}

function findCartItem(cartItems, barcode) {
    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].item.barcode === barcode) {
            return cartItems[i];
        }
    }
    return;
}

function findItem(allItems, barcode) {
    for (var i = 0; i < allItems.length; i++) {
        if (allItems[i].barcode === barcode) {
            return allItems[i];
        }
    }
    return;
}

module.exports = {
    buildCartItems: buildCartItems,
    buildReceiptItems: buildReceiptItems,
    buildReceipt: buildReceipt,
    printReceipt: printReceipt
};