/**
 * Created by gaole on 7/19/16.
 */
'use strict'

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

module.exports = {buildCartItems: buildCartItems};