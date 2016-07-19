/**
 * Created by gaole on 7/19/16.
 */
'use strict';


function buildReceipt(receiptItems) {
    var total = 0;
    var discount = 0;

    receiptItems.forEach(function (receiptItem) {
        total += receiptItem.subtotal;
        discount += receiptItem.saved;
    });

    return {receiptItems:receiptItems,total:total, discount:discount};
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
    } else if (promotionType === 'a 95 persent charge') {
        saved = cartItem.item.price * parseInt(cartItem.count) * 0.05;
    }

    var subtotal = cartItem.item.price * parseInt(cartItem.count) - saved;

    return {cartItem:cartItem, subtotal:subtotal, saved:saved};
}

function getPromotionType(barcode, promotions) {
    for (var i = 0; i < promotions.length; i++) {
        for (var j = 0; j < promotions[i].barcodes.length; j++) {
            if(promotions[i].barcodes[j] === barcode){
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
    buildReceipt:buildReceipt
};