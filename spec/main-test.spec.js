/**
 * Created by gaole on 7/19/16.
 */
'use strict';


var fixtures = require('./fixtures');
var main = require("../main/main.js");

describe('pos', function () {
    var inputs;
    var allItems;
    var promotions;

    beforeEach(function () {
        inputs = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000005',
            'ITEM000005',
            'ITEM000005'
        ];
        allItems = fixtures.loadallItems();
        promotions = fixtures.loadPromotions();
    });

    it('should print correct text', function () {

        spyOn(console, 'log');

       // main.printReceipt(inputs);

        const expectText = '***<没钱赚商店>收据***' + '\n' +
            '名称：羽毛球，数量：5个，单价：1.00(元)，小计：4.00(元)' + '\n' +
            '名称：苹果，数量：2斤，单价：5.50(元)，小计：11.00(元)' + '\n' +
            '名称：可口可乐，数量：3个，单价：3.00(元)，小计：6.00(元)' + '\n' +
            '----------------------' + '\n' +
            '买二赠一商品' + '\n' +
            '名称：可口可乐，数量：1瓶' + '\n' +
            '名称：羽毛球，数量：1个' + '\n' +
            '**********************' + '\n' +
            '----------------------' + '\n' +
            '总计：21.00(元)' + '\n' +
            '节省：4.00(元)' + '\n' +
            '**********************';

        expect(console.log).toHaveBeenCalledWith(expectText);
    });

    it('should print cartItems', function () {
        var cartItems = main.buildCartItems(inputs, allItems);
        var expectCartItems = [
            {
                item: {
                    barcode: "ITEM000001",
                    name: "羽毛球",
                    unit: "个",
                    price: 1.00
                },
                count: 5
            },
            {
                item: {
                    barcode: "ITEM000003",
                    name: "苹果",
                    unit: "斤",
                    price: 5.50
                },
                count: 2
            },
            {
                item: {
                    barcode: "ITEM000005",
                    name: "可口可乐",
                    unit: "瓶",
                    price: 3.00
                },
                count: 3
            }
        ];
        expect(cartItems).toEqual(expectCartItems);
    });
});