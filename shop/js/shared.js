// Sayt nomi va logosi
var SHOP_NAME = "UzShop";
var LOGO = "🛒";

// Birinchi marta ochilganda chiqadigan mahsulotlar
var START_PRODUCTS = [
  { id: 1, name: "iPhone 15", price: 11500000, category: "Telefonlar", img: "images/p1.svg", desc: "128GB, qora rang" },
  { id: 2, name: "Samsung S24", price: 9800000, category: "Telefonlar", img: "images/p2.svg", desc: "256GB, ajoyib kamera" },
  { id: 3, name: "Xiaomi Redmi Note", price: 3200000, category: "Telefonlar", img: "images/p3.svg", desc: "128GB, kuchli batareya" },
  { id: 4, name: "Google Pixel 8", price: 8700000, category: "Telefonlar", img: "images/p4.svg", desc: "128GB, toza Android" },
  { id: 5, name: "Oppo Reno", price: 4100000, category: "Telefonlar", img: "images/p5.svg", desc: "256GB, tez zaryad" },
  { id: 6, name: "Noutbuk Lenovo", price: 7200000, category: "Kompyuterlar", img: "images/p6.svg", desc: "16GB RAM, SSD 512GB" },
  { id: 7, name: "Kompyuter sichqonchasi", price: 150000, category: "Kompyuterlar", img: "images/p7.svg", desc: "Simsiz, qulay" },
  { id: 8, name: "Klaviatura", price: 280000, category: "Kompyuterlar", img: "images/p8.svg", desc: "Mexanik, yoritilgan" },
  { id: 9, name: "Monitor 24 dyuym", price: 1800000, category: "Kompyuterlar", img: "images/p9.svg", desc: "Full HD, 75Hz" },
  { id: 10, name: "Printer", price: 1300000, category: "Kompyuterlar", img: "images/p10.svg", desc: "Rangli, Wi-Fi" },
  { id: 11, name: "Quloqchin", price: 350000, category: "Aksessuarlar", img: "images/p11.svg", desc: "Simsiz, bass tovush" },
  { id: 12, name: "Smart soat", price: 900000, category: "Aksessuarlar", img: "images/p12.svg", desc: "Qadam va yurak urishini sanaydi" },
  { id: 13, name: "Quyosh ko'zoynagi", price: 220000, category: "Aksessuarlar", img: "images/p13.svg", desc: "UV himoyali" },
  { id: 14, name: "Powerbank 20000", price: 260000, category: "Aksessuarlar", img: "images/p14.svg", desc: "20000 mAh, tez zaryad" },
  { id: 15, name: "Fotoapparat", price: 4500000, category: "Aksessuarlar", img: "images/p15.svg", desc: "24MP, 4K video" },
  { id: 16, name: "Krossovka", price: 650000, category: "Kiyim", img: "images/p16.svg", desc: "Sport uchun" },
  { id: 17, name: "Ryukzak", price: 300000, category: "Kiyim", img: "images/p17.svg", desc: "Maktab va sayohat uchun" },
  { id: 18, name: "Futbolka", price: 120000, category: "Kiyim", img: "images/p18.svg", desc: "Paxta, oq rang" },
  { id: 19, name: "Kepka", price: 90000, category: "Kiyim", img: "images/p19.svg", desc: "Yozgi, sozlanadigan" },
  { id: 20, name: "Jinsi shim", price: 380000, category: "Kiyim", img: "images/p20.svg", desc: "Klassik uslub" }
];

//Mahsulotlar 
// Mahsulotlar ro'yxati yangilansa, shu raqamni oshiring: eski saqlangan ma'lumot tozalanadi
var DATA_VERSION = "2";

function getProducts() {
  if (localStorage.getItem("dataVersion") != DATA_VERSION) {
    localStorage.removeItem("products");
    localStorage.removeItem("cart");
    localStorage.setItem("dataVersion", DATA_VERSION);
  }
  var text = localStorage.getItem("products");
  if (text == null) {
    saveProducts(START_PRODUCTS);
    return START_PRODUCTS;
  }
  return JSON.parse(text);
}
function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// Buyurtmalar 
function getOrders() {
  var text = localStorage.getItem("orders");
  if (text == null) { return []; }
  return JSON.parse(text);
}
function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

//  Savat: har bir element {id: 1, qty: 2} 
function getCart() {
  var text = localStorage.getItem("cart");
  if (text == null) { return []; }
  return JSON.parse(text);
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Narxni chiroyli yozish: 1 500 000 so'm
function formatPrice(price) {
  return price.toLocaleString() + " so'm";
}
