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
    var cartItems;
    var receiptItems;
    var receipt;

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
        cartItems = [
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
        receiptItems = [
            {
                cartItem: {
                    item: {
                        barcode: "ITEM000001",
                        name: "羽毛球",
                        unit: "个",
                        price: 1.00
                    },
                    count: 5,
                },
                subtotal: 4.00,
                saved: 1.00,
                type:'BUY_TWO_GET_ONE_FREE'
            },
            {
                cartItem: {
                    item: {
                        barcode: "ITEM000003",
                        name: "苹果",
                        unit: "斤",
                        price: 5.50
                    },
                    count: 2
                },
                subtotal: 10.45,
                saved: 0.55,
                type:'a 95 persent charge'
            },
            {
                cartItem: {
                    item: {
                        barcode: "ITEM000005",
                        name: "可口可乐",
                        unit: "瓶",
                        price: 3.00
                    },
                    count: 3
                },
                subtotal: 6.00,
                saved: 3.00,
                type:'BUY_TWO_GET_ONE_FREE'
            }
        ];
        receipt = {
            receiptItems:receiptItems,
            subtotal:20.45,
            discount:4.55
        }
    });

    it('should print text', function () {

        spyOn(console, 'log');

        main.printReceipt(receipt, promotions);

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

    it('should print receiptItems', function () {
        var receiptItems = main.buildReceiptItems(cartItems, promotions);
        var expectReceiptItems = [
            {
                cartItem: {
                    item: {
                        barcode: "ITEM000001",
                        name: "羽毛球",
                        unit: "个",
                        price: 1.00
                    },
                    count: 5,
                },
                subtotal: 4.00,
                saved: 1.00,
                type:'BUY_TWO_GET_ONE_FREE'
            },
            {
                cartItem: {
                    item: {
                        barcode: "ITEM000003",
                        name: "苹果",
                        unit: "斤",
                        price: 5.50
                    },
                    count: 2
                },
                subtotal: 10.45,
                saved: 0.55,
                type:'a 95 persent charge'
            },
            {
                cartItem: {
                    item: {
                        barcode: "ITEM000005",
                        name: "可口可乐",
                        unit: "瓶",
                        price: 3.00
                    },
                    count: 3
                },
                subtotal: 6.00,
                saved: 3.00,
                type:'BUY_TWO_GET_ONE_FREE'
            }
        ];
        expect(receiptItems).toEqual(expectReceiptItems);
    });

    it('should print receipt', function () {
        var receipt = main.buildReceipt(receiptItems);
        var expectReceipt = {
            receiptItems: [
                {
                    cartItem: {
                        item: {
                            barcode: "ITEM000001",
                            name: "羽毛球",
                            unit: "个",
                            price: 1.00
                        },
                        count: 5,
                    },
                    subtotal: 4.00,
                    saved: 1.00,
                    type:'BUY_TWO_GET_ONE_FREE'
                },
                {
                    cartItem: {
                        item: {
                            barcode: "ITEM000003",
                            name: "苹果",
                            unit: "斤",
                            price: 5.50
                        },
                        count: 2
                    },
                    subtotal: 10.45,
                    saved: 0.55,
                    type:'a 95 persent charge'
                },
                {
                    cartItem: {
                        item: {
                            barcode: "ITEM000005",
                            name: "可口可乐",
                            unit: "瓶",
                            price: 3.00
                        },
                        count: 3
                    },
                    subtotal: 6.00,
                    saved: 3.00,
                    type:'BUY_TWO_GET_ONE_FREE'
                }
            ],
            total: 20.45,
            discount: 4.55
        };

        expect(receipt).toEqual(expectReceipt);
    });
});