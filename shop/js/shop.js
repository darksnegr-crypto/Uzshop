// Hozir tanlangan kategoriya
var selectedCategory = "Hammasi";

document.getElementById("logo").innerHTML = LOGO;
document.getElementById("shopName").innerHTML = SHOP_NAME;


//  Kategoriya tugmalari
function showCategories() {
  var products = getProducts();
  var names = ["Hammasi"];

  // Takrorlanmaydigan kategoriyalar ro'yxati
  for (var i = 0; i < products.length; i++) {
    if (names.indexOf(products[i].category) == -1) {
      names.push(products[i].category);
    }
  }

  var html = "";
  for (var j = 0; j < names.length; j++) {
    var cls = "cat-btn";
    if (names[j] == selectedCategory) { cls = "cat-btn active"; }
    html += '<button class="' + cls + '" onclick="chooseCategory(' + j + ')">' + names[j] + '</button>';
  }
  document.getElementById("categories").innerHTML = html;
}

function chooseCategory(index) {
  var products = getProducts();
  var names = ["Hammasi"];
  for (var i = 0; i < products.length; i++) {
    if (names.indexOf(products[i].category) == -1) { names.push(products[i].category); }
  }
  selectedCategory = names[index];
  showAll();
}


// Mahsulotlarni chiqarish 
function showProducts() {
  var products = getProducts();
  var html = "";

  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    if (selectedCategory == "Hammasi" || selectedCategory == p.category) {
      html += '<div class="col-6 col-md-4 col-lg-3">';
      html += '<div class="card product-card h-100">';
      html += '<div class="product-img"><img src="' + p.img + '" alt=""></div>';
      html += '<div class="card-body d-flex flex-column">';
      html += '<span class="category-pill">' + p.category + '</span>';
      html += '<h6 class="card-title">' + p.name + '</h6>';
      html += '<p class="card-text small text-muted">' + p.desc + '</p>';
      html += '<div class="price mt-auto mb-2">' + formatPrice(p.price) + '</div>';
      html += '<button class="btn btn-buy btn-sm" onclick="addToCart(' + p.id + ')">Savatga</button>';
      html += '</div></div></div>';
    }
  }

  if (html == "") { html = '<p class="text-center text-muted">Mahsulot yo\'q</p>'; }
  document.getElementById("productList").innerHTML = html;
}


// Savat 
function addToCart(id) {
  var cart = getCart();
  var found = false;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].qty = cart[i].qty + 1;
      found = true;
    }
  }
  if (found == false) { cart.push({ id: id, qty: 1 }); }

  saveCart(cart);
  showCart();
  new bootstrap.Offcanvas(document.getElementById("cart")).show();
}

// change = +1 yoki -1
function changeQty(id, change) {
  var cart = getCart();
  var newCart = [];

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) { cart[i].qty = cart[i].qty + change; }
    if (cart[i].qty > 0) { newCart.push(cart[i]); }
  }

  saveCart(newCart);
  showCart();
}

function showCart() {
  var products = getProducts();
  var cart = getCart();
  var html = "";
  var total = 0;
  var count = 0;

  for (var i = 0; i < cart.length; i++) {
    for (var j = 0; j < products.length; j++) {
      if (products[j].id == cart[i].id) {
        var p = products[j];
        total = total + p.price * cart[i].qty;
        count = count + cart[i].qty;

        html += '<div class="d-flex justify-content-between align-items-center border-bottom py-2">';
        html += '<div>' + p.name + '<br><small class="text-muted">' + formatPrice(p.price) + '</small></div>';
        html += '<div><button class="btn btn-sm btn-outline-secondary" onclick="changeQty(' + p.id + ', -1)">-</button> ';
        html += cart[i].qty;
        html += ' <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(' + p.id + ', 1)">+</button></div>';
        html += '</div>';
      }
    }
  }

  if (html == "") { html = '<p class="text-muted">Savat bo\'sh</p>'; }
  document.getElementById("cartItems").innerHTML = html;
  document.getElementById("cartTotal").innerHTML = formatPrice(total);
  document.getElementById("cartCount").innerHTML = count;
}


// Buyurtma berish (yetkazib berish) 
function makeOrder() {
  var products = getProducts();
  var cart = getCart();
  var name = document.getElementById("customerName").value.trim();
  var phone = document.getElementById("customerPhone").value.trim();
  var address = document.getElementById("customerAddress").value.trim();

  if (cart.length == 0) { alert("Savat bo'sh!"); return; }
  if (name == "" || phone == "" || address == "") { alert("Ism, telefon va manzilni yozing!"); return; }

  var items = [];
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    for (var j = 0; j < products.length; j++) {
      if (products[j].id == cart[i].id) {
        items.push(products[j].name + " x " + cart[i].qty);
        total = total + products[j].price * cart[i].qty;
      }
    }
  }

  var orders = getOrders();
  orders.push({
    id: Date.now(),
    date: new Date().toLocaleString(),
    name: name, phone: phone, address: address,
    items: items, total: total, status: "Yangi"
  });
  saveOrders(orders);

  saveCart([]);
  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";
  document.getElementById("customerAddress").value = "";
  showCart();
  bootstrap.Offcanvas.getInstance(document.getElementById("cart")).hide();

  alert("Buyurtma qabul qilindi! Tez orada yetkazib beramiz.");
}

//Hammasini chiqarish 
function showAll() {
  showCategories();
  showProducts();
  showCart();
}

// Admin boshqa oynada o'zgartirsa, sayt avtomatik yangilanadi
window.onstorage = showAll;

showAll();
