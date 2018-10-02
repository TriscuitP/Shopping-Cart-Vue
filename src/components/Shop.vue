<template>
  <div class="shop">
    <div class="cart-list">
      <div>
        <button v-on:click="showList = !showList">
          ({{bulk}}) Cart
        </button>
      </div>
      <div v-show="showList">
        <p v-if="bulk == 0">Cart is empty</p>
        <ul v-for="(p, idx) in products">
          <li>
            <!-- Only display in cart if product has been selected -->
            <div v-if="quantities[idx].inCart">
              <h3 class="item-name">{{ p.name }} - {{p.type}}</h3>
              <input type="text" class="item-quantity" v-model.number="quantities[idx].number">
               - ${{p.price}} each<p/>
              <p>Price: ${{p.price * quantities[idx].number}}</p>
              <button v-on:click="deletefromCart(idx)">Delete</button>
            </div>
          </li>
        </ul>
        <p v-if="bluDiscount">You get a 15% discount for getting all Blu-Rays</p>
        <p v-if="dvdDiscount">You get a 10% discount for getting all DVDs</p>
        <p v-if="bulk >= 100">You get a 5% bulk discount for 100 or more items</p>
        <p>Number of Items: {{getTotalProducts}}</p>
        <p>Total Price: ${{getTotalPrice}}</p>
        <button>Checkout</button>
      </div>
    </div>
    <div class="title">
      <h1>Piratical Liz's Tomfoolery</h1>
    </div>
    <div class="product-list">
      <table class="prod">
        <tr>
          <th>Products</th>
          <th>Price</th>
        </tr>
        <tr v-for="(p, idx) in products">
          <td>
            <h3 class="item-name">{{ p.name }}</h3>
            <p class="item-type">{{ p.type }}</p>
          </td>
          <td>
            <p>
              ${{p.price}} - <button v-on:click="addtoCart(idx)">Add to cart</button>
            </p>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { db } from '../main'
export default {
  name: 'Shop',
  data () {
    return {
      products: [],
      quantities: [
        {number: 0, inCart: false},  // Product 1
        {number: 0, inCart: false},  // Product 2
        {number: 0, inCart: false},  // Product 3
        {number: 0, inCart: false},  // Product 4
        {number: 0, inCart: false},  // Product 5
        {number: 0, inCart: false}   // Product 6
      ],
      bluDiscount: false,
      dvdDiscount: false,
      bulk: 0,
      showList: false
    }
  },
  /* Retrieve data(products) from cloud database */
  firestore () {
    return {
      products: db.collection('products')
    }
  },
  /* Derived value that will be automatically updated whenever one of the underlying
     values used to calculate it is updated */
  computed: {
    /* Gets total price as user adds and deletes from cart */
    getTotalPrice() {
      var total = 0
      var bluTotal = 0
      var dvdTotal = 0
      this.dvdDiscount = false
      this.bluDiscount = false

      for (var i = 0; i < this.products.length; i++) {
        // If quantities for specific product is > 0, calculate price
        if(this.quantities[i].number > 0) {
          total += this.products[i].price * this.quantities[i].number
          if(this.products[i].type == 'Blu-Ray')
            bluTotal++
          if(this.products[i].type == 'DVD')
            dvdTotal++
        }
      }
      // 10% Discount when all DVDs are selected
      if(dvdTotal == 3) {
        total *= .9
        this.dvdDiscount = true
      }
      // 15% Discount when all Blu-Rays are selected
      if(bluTotal == 3) {
        total *= .85
        this.bluDiscount = true
      }
      // 5% Discount when 100 products are selected
      if(this.bulk >= 100) {
        total *= .95
      }

      return total.toFixed(2)
    },
    /* Gets total quantity as user adds and deletes from cart */
    getTotalProducts() {
      var total = 0
      for (var i = 0; i < this.quantities.length; i++) {
        total += this.quantities[i].number
      }
      // Update bulk for if 5% discount is needed
      this.bulk = total
      return total
    }
  },
  methods: {
    /* Increases quantity in cart */
    addtoCart(idx) {
      this.quantities[idx].number++
      this.quantities[idx].inCart = true
    },
    /* Decreases quantity in cart */
    deletefromCart(idx) {
      // Need to do this way or number will go undefined and create errors
      this.$set(this.quantities, idx, {number: 0, inCart: false});
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  text-align: center;
}
.prod-cols {
  word-spacing: 450px;
}
.cart-list {
  background-color: powderblue;
  position: absolute;
  right: 0;
  padding: 0 15px;
}
.prod {
  background-color: powderblue;
  width: 65%;
}
th, td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid black;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
