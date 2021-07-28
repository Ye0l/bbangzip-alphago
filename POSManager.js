//================================================================
class Product {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}
//================================================================
class Item {
    constructor(product) {
        this.product = product;
        this.count = 1;
        this.total = this.product.price;
    }
}
//================================================================
class Order {
    constructor() {
            this.items = [];
            this.total = 0;
            this.paid = 0;
            this.change = 0;
            this.dateOrder = new Date();
            this.lastItemIndex = -1; //취소용
            this.lastItemCountChange = 0;
        }
        //--------------------------------------------------------
    addItem(product) {
            for (let i in this.items) {
                if (product === this.items[i].product) {
                    this.items[i].count++;
                    this.lastItemIndex = Number(i);
                    this.calculateTotal();
                    return `.order_${product.name}`;
                    // return this.lastItemIndex;
                }
            }
            this.items.push(new Item(product));
            this.lastItemIndex = this.items.length - 1;
            this.calculateTotal();
            return `#order_${product.name}`;
            // return this.lastItemIndex;
        }
        //--------------------------------------------------------
    cancelLast() {
        let id;
        id = `.order_${this.items[this.lastItemIndex].product.name}`;
        this.adjustItemCount(this.lastItemIndex, -1);
        this.lastItemIndex = -1;

        return id;
    }
    //--------------------------------------------------------
    adjustItemCount(idx, amount) {
            if (idx >= 0 && idx < this.items.length) { //정상적인 item index이면
                this.items[idx].count += amount;
                if (this.items[idx].count <= 0) {
                    this.items.splice(idx, 1);
                    this.lastItemIndex = -1;
                }
                this.calculateTotal();
            }
        }
        //--------------------------------------------------------
    setItemCount(idx, count) {
            if (idx >= 0 && idx < this.items.length) { //정상적인 item index이면
                this.items[idx].count = count;
                if (this.items[idx].count <= 0) {
                    this.items.splice(idx, 1);
                    this.lastItemIndex = -1;
                }
                this.calculateTotal();
            }
            return `.order_${this.items[idx].product.name}`;
        }
        //--------------------------------------------------------
    setLastCount(count) {
            this.setItemCount(this.lastItemIndex, count);
            this.calculateTotal();
            // return `.order_${product.name}`;
            return `.order_${this.items[this.lastItemIndex].product.name}`;
        }
        //--------------------------------------------------------
    calculateTotal() {
            this.total = 0;
            for (let item of this.items) {
                item.total = item.product.price * item.count;
                this.total += item.total;
            }
        }
        //--------------------------------------------------------

}
//================================================================
class POSManager {
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    constructor() {
            this.dateStart = new Date();
            this.products = [];
            this.orders = [];
            this.currentOrder = null;
            this.target = null;
            this.sumTarget = null;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // POS 정보를 출력할 HTML tag 지정 (보통, div)
        //  target.innerHTML <- 출력할 내용
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    targetIs(target, sumtarget) {
            this.target = target;
            this.sumTarget = sumtarget;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    addProduct(product) {
            for (let p of this.products) {
                if (product.name === p.name) {
                    return 0;
                }
            }
            this.products.push(product);
            return this.products.length;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    readProducts(filepath) {
        let prdSrc = [];
        $.ajax({
            url: filepath,
            dataType: "json",
            type: "GET",
            async: false,
            success: function(data) {
                for(var item of data) {
                    prdSrc.push(new Product(item['classname'], Number(item['unit_price'])));
                }
            }
        })
        for (let prd of prdSrc) {
            this.addProduct(prd);
        }
        this.showProducts();
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    findProduct(name) {
            for (let p of this.products) {
                if (p.name === name)
                    return p;
            }
            console.log(`Order.findProduct: not found product "${name}"`);
            return null;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    newOrder() {
            if (this.currentOrder) {
                this.currentOrder.lastItemIndex = -1;
                this.orders.push(this.currentOrder);
            }
            this.currentOrder = new Order();
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    addItem(name) {
            if (this.currentOrder === null)
                this.currentOrder = new Order();
            let product = this.findProduct(name);
            if (product)
                this.currentOrder.addItem(product);
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    showCurrentOrder() {
            // console.log('=======Items of current Order==========');
            // for (let item of this.currentOrder.items) {
            //     console.log(`[${item.product.name}]: ${item.product.price} x ${item.count} = ${item.product.price * item.count}`);
            // }
            // console.log('=======End of current Order==========');
            // console.log(`Total: ${this.currentOrder.total}원`);
            let currentOrders = "";
            for(var i in this.currentOrder.items) {
                currentOrders += `<tr id='order_${this.currentOrder.items[i].product.name}'>`;
                currentOrders += "<td>";
                currentOrders += this.currentOrder.items[i].product.name;
                currentOrders += "</td>";
                currentOrders += "<td>";
                currentOrders += this.currentOrder.items[i].product.price;
                currentOrders += "</td>";
                currentOrders += `<td class='order_${this.currentOrder.items[i].product.name}'>`;
                currentOrders += `<div id='minus_icon' style='display:inline-block;'><img src='./icons/minus.png' alt='Plus_icon' style='width: 30px; height: 30px;' onclick='btn_event("minus", ${i})'></div>`;
                currentOrders += "<div id='count' style='display:inline-block;'>";
                currentOrders += "&nbsp" + this.currentOrder.items[i].count + "&nbsp";
                currentOrders += "</div>";
                currentOrders += `<div id='plus_icon' style='display:inline-block;'><img src='./icons/add.png' alt='Plus_icon' style='width: 30px; height: 30px;' onclick='btn_event("plus", ${i})'></div>`;
                currentOrders += "</td>";
                currentOrders += `<td class='order_${this.currentOrder.items[i].product.name}'>`;
                currentOrders += this.currentOrder.items[i].total;
                currentOrders += "</td>";
                currentOrders += "</tr>";
            }
            this.target.innerHTML = currentOrders;
            this.sumTarget.innerText = this.currentOrder.total;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    cancelLast() {
        let id;
            if (this.currentOrder) {
                id = this.currentOrder.cancelLast();
                this.showCurrentOrder();
            }
            this.insertAnimation($(id));
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    showProducts() {
            if (this.target) {
                if (this.products.length > 0) {
                    for (let product in this.products) {
                        this.target.empty();
                    }

                } else {
                    this.target.innerHTML = "등록된 상품이 없습니다.";
                }

            } else { //targetTag가 지정되어 있지 않으면(null) 콘솔에 오류 출력
                for (let p of this.products)
                    console.log(`[${p.name}]: ${p.price}원`);
            }
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    addOrderItem(product) {
        let id = this.currentOrder.addItem(this.findProduct(product));
        this.showCurrentOrder();

        this.insertAnimation($(id));
    }
    setLastOrderCount(amount) {
        let id = this.currentOrder.setLastCount(amount);
        this.showCurrentOrder();

        this.insertAnimation($(id));
    }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    insertAnimation(target) {
        target.css({borderTopColor: 'rgba(251, 206, 177)', borderLeftColor: 'rgba(251, 206, 177)', borderRightColor: 'rgba(251, 206, 177)', backgroundColor: 'rgba(255, 229, 211)'});
        target.animate({borderTopColor: 'rgba(251, 206, 177, 0)', borderLeftColor: 'rgba(251, 206, 177, 0)', borderRightColor: 'rgba(251, 206, 177, 0)', backgroundColor: 'rgba(255, 229, 211, 0)'}, 1500);
    }

    getOrderItemCount(index) {
        for(var item of this.currentOrder.items) {
            if (item.product.name == this.currentOrder.items[index].product.name) {
                return item.count;
            }
        }
    }

    setOrderItemCount(index, count) {
        let id = this.currentOrder.setItemCount(index, count);
        this.showCurrentOrder();

        this.insertAnimation($(id));
    }
}
// let p1 = new Product('a', 100);
// let p2 = new Product('b', 200);
// let pos = new POSManager();
// pos.readProducts(productSource);
// pos.addProduct(p1);
// pos.addProduct(p2);
//================================================================