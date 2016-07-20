/**
 * Created by gaole on 7/19/16.
 */
'use strict';

var fixtures = require('../spec/fixtures');

function printReceipt(tags) {
    var allItems = fixtures.loadAllItems();
    var cartItems = buildCartItems(tags, allItems);

    var promotions = fixtures.loadPromotions();
    var receiptItems = buildReceiptItems(cartItems, promotions);

    var receipt = buildReceipt(receiptItems);
    var receiptText = buildReceiptText(receipt);

    console.log(receiptText);
}

function buildReceiptText(receipt) {
    var receiptText = '***<没钱赚商店>收据***';

    receipt.receiptItems.forEach(function (receiptItem) {
        receiptText += '\n' + '名称：' + receiptItem.cartItem.item.name + '，数量：' + receiptItem.cartItem.count +
            receiptItem.cartItem.item.unit + '，单价：' + formatMoney(receiptItem.cartItem.item.price) + '(元)' + '，小计：' +
            formatMoney(receiptItem.subtotal) + '(元)';
        if (receiptItem.type === 'A_95_PRESENT_CHARGE') {
            receiptText += '，节省：' + formatMoney(receiptItem.saved) + '(元)';
        }
    });

    receiptText += promotionText(receipt) + '\n' + '----------------------' + '\n' +
        '总计：' + formatMoney(receipt.total) + '(元)' + '\n' + '节省：' +
        formatMoney(receipt.totalSaved) + '(元)' + '\n' + '**********************';

    return receiptText;
}

function formatMoney(money) {

    return money.toFixed(2);
}

function promotionText(receipt) {
    var promotionType = '';
    var promotionContent = '';

    for (var i = 0; i < receipt.receiptItems.length; i++) {
        if (receipt.receiptItems[i].type === 'BUY_TWO_GET_ONE_FREE') {
            promotionType = '\n' + '----------------------' + '\n' + '买二赠一商品';
            promotionContent += '\n' + '名称：' + receipt.receiptItems[i].cartItem.item.name + '，数量：' +
                receipt.receiptItems[i].promotionCount + receipt.receiptItems[i].cartItem.item.unit
        }
    }

    return promotionType + promotionContent;
}

function buildReceipt(receiptItems) {
    var total = 0;
    var totalSaved = 0;

    receiptItems.forEach(function (receiptItem) {
        total += receiptItem.subtotal;
        totalSaved += receiptItem.saved;
    });

    return {receiptItems: receiptItems, total: total, totalSaved: totalSaved};
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
    
    if (promotionType) {
        return {
            cartItem: cartItem, subtotal: subtotal, saved: saved,
            type: promotionType, promotionCount: parseInt(cartItem.count / 3)
        };
    } else {
        return {cartItem: cartItem, subtotal: subtotal, saved: saved}
    }
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