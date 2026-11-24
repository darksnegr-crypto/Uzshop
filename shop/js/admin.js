var PASSWORD = "admin123";
var STATUSES = ["Yangi", "Yo'lda", "Yetkazildi", "Bekor"];

// Tahrirlanayotgan mahsulot id'si (0 bo'lsa - yangi qo'shilyapti)
var editId = 0;

// Chizilgan grafiklar (yangilashda eskisini o'chirish uchun)
var charts = {};
var COLORS = ["#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#0ea5e9"];
var DAY = 86400000;

//Parol so'rash 
if (sessionStorage.getItem("isAdmin") != "yes") {
  var answer = prompt("Parolni kiriting:");
  if (answer == PASSWORD) {
    sessionStorage.setItem("isAdmin", "yes");
  } else {
    document.body.innerHTML = '<h3 class="text-center mt-5">Parol noto\'g\'ri. Sahifani yangilang.</h3>';
  }
}


//Statistika kartalari 
function showStats() {
  var orders = getOrders();
  var pending = 0;
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].status == "Yangi") { pending++; }
  }
  var cards = [
    ["📦", "Mahsulotlar", getProducts().length, "icon-blue"],
    ["🧾", "Buyurtmalar", orders.length, "icon-green"],
    ["⏳", "Yangi buyurtmalar", pending, "icon-orange"]
  ];
  var html = "";
  for (var j = 0; j < cards.length; j++) {
    html += '<div class="col-md-4"><div class="stat-card">';
    html += '<div class="stat-icon ' + cards[j][3] + '">' + cards[j][0] + '</div>';
    html += '<div><div class="stat-label">' + cards[j][1] + '</div><div class="stat-value">' + cards[j][2] + '</div></div>';
    html += '</div></div>';
  }
  document.getElementById("stats").innerHTML = html;
  showCharts();   // statistika o'zgarsa, grafiklar ham yangilanadi
}


//Mahsulotlar jadvali 
function showProducts() {
  var products = getProducts();
  var html = "";
  var cats = "";
  var used = [];

  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    html += "<tr>";
    html += '<td><img src="' + p.img + '" width="50" height="50" style="object-fit:cover" class="rounded"></td>';
    html += "<td>" + p.name + "</td>";
    html += "<td>" + p.category + "</td>";
    html += "<td>" + formatPrice(p.price) + "</td>";
    html += '<td><button class="btn btn-sm btn-warning me-1" onclick="editProduct(' + p.id + ')">O\'zgartirish</button>';
    html += '<button class="btn btn-sm btn-danger" onclick="deleteProduct(' + p.id + ')">O\'chirish</button></td>';
    html += "</tr>";

    // Kategoriya tavsiyalari (datalist)
    if (used.indexOf(p.category) == -1) {
      used.push(p.category);
      cats += '<option value="' + p.category + '">';
    }
  }

  document.getElementById("productTable").innerHTML = html;
  document.getElementById("catList").innerHTML = cats;
  showStats();
}


// Qo'shish va o'zgartirishni saqlash 
function saveProduct() {
  var name = document.getElementById("pName").value.trim();
  var price = Number(document.getElementById("pPrice").value);
  var category = document.getElementById("pCategory").value.trim();
  var img = document.getElementById("pImg").value.trim();
  var desc = document.getElementById("pDesc").value.trim();

  if (name == "" || price <= 0 || category == "") {
    alert("Nomi, narxi va kategoriyani to'g'ri yozing!");
    return;
  }

  var products = getProducts();

  if (editId == 0) {
    // Yangi mahsulot qo'shish
    products.push({ id: Date.now(), name: name, price: price, category: category, img: img, desc: desc });
  } else {
    // Mavjud mahsulotni o'zgartirish
    for (var i = 0; i < products.length; i++) {
      if (products[i].id == editId) {
        products[i].name = name;
        products[i].price = price;
        products[i].category = category;
        products[i].img = img;
        products[i].desc = desc;
      }
    }
  }

  saveProducts(products);
  clearForm();
  showProducts();
}


//  O'zgartirish: ma'lumotni formaga qo'yadi
function editProduct(id) {
  var products = getProducts();
  for (var i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      document.getElementById("pName").value = products[i].name;
      document.getElementById("pPrice").value = products[i].price;
      document.getElementById("pCategory").value = products[i].category;
      document.getElementById("pImg").value = products[i].img;
      document.getElementById("pDesc").value = products[i].desc;
    }
  }
  editId = id;
  document.getElementById("formTitle").innerHTML = "Mahsulotni o'zgartirish";
  window.scrollTo(0, 0);
}


// O'chirish 
function deleteProduct(id) {
  if (confirm("Rostdan o'chirasizmi?") == false) { return; }

  var products = getProducts();
  var newProducts = [];
  for (var i = 0; i < products.length; i++) {
    if (products[i].id != id) { newProducts.push(products[i]); }
  }
  saveProducts(newProducts);
  showProducts();
}


// Formani tozalash 
function clearForm() {
  document.getElementById("pName").value = "";
  document.getElementById("pPrice").value = "";
  document.getElementById("pCategory").value = "";
  document.getElementById("pImg").value = "";
  document.getElementById("pDesc").value = "";
  document.getElementById("formTitle").innerHTML = "Yangi mahsulot qo'shish";
  editId = 0;
}


// Buyurtmalar 
function showOrders() {
  var orders = getOrders();
  var html = "";

  if (orders.length == 0) { html = '<p class="text-muted">Hozircha buyurtma yo\'q</p>'; }

  for (var i = orders.length - 1; i >= 0; i--) {   // yangilari tepada
    var o = orders[i];
    var options = "";
    for (var s = 0; s < STATUSES.length; s++) {
      var selected = "";
      if (STATUSES[s] == o.status) { selected = "selected"; }
      options += '<option value="' + STATUSES[s] + '" ' + selected + '>' + STATUSES[s] + '</option>';
    }

    html += '<div class="card mb-3"><div class="card-body">';
    html += '<div class="d-flex justify-content-between"><b>' + o.name + '</b> <small class="text-muted">' + o.date + '</small></div>';
    html += '📞 ' + o.phone + '<br>📍 ' + o.address + '<br>';
    html += o.items.join(", ") + '<br>';
    html += '<b>Jami: ' + formatPrice(o.total) + '</b>';
    html += '<select class="form-select mt-2" style="max-width:200px" onchange="changeStatus(' + o.id + ', this.value)">' + options + '</select>';
    html += '</div></div>';
  }

  document.getElementById("tabOrders").innerHTML = html;
}

function changeStatus(id, status) {
  var orders = getOrders();
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].id == id) { orders[i].status = status; }
  }
  saveOrders(orders);
  showStats();
}

// Admin boshqa oynada o'zgarish qilsa (yangi buyurtma), avtomatik yangilanadi
window.onstorage = function () {
  showProducts();
  showOrders();
};

showProducts();
showOrders();


//  Grafiklar (Chart.js) 

// Grafik chizish: type = "bar" yoki "doughnut"
function makeChart(id, type, labels, data, colors) {
  if (typeof Chart == "undefined") { return; }   // internet yo'q bo'lsa
  if (charts[id]) { charts[id].destroy(); }      // eski grafikni o'chiramiz

  var showLegend = false;
  if (type == "doughnut") { showLegend = true; }

  charts[id] = new Chart(document.getElementById(id), {
    type: type,
    data: {
      labels: labels,
      datasets: [{ data: data, backgroundColor: colors, borderRadius: 8 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: showLegend } }
    }
  });
}

function showCharts() {
  var products = getProducts();
  var orders = getOrders();
  var i, j;

  // 1) Bar: har bir kategoriyada nechta mahsulot bor
  var catNames = [];
  var catCounts = [];
  for (i = 0; i < products.length; i++) {
    var index = catNames.indexOf(products[i].category);
    if (index == -1) {
      catNames.push(products[i].category);
      catCounts.push(1);
    } else {
      catCounts[index] = catCounts[index] + 1;
    }
  }
  makeChart("chartCategory", "bar", catNames, catCounts, COLORS);

  // 2) Doira: buyurtmalar holati bo'yicha
  var statusCounts = [];
  for (i = 0; i < STATUSES.length; i++) {
    var count = 0;
    for (j = 0; j < orders.length; j++) {
      if (orders[j].status == STATUSES[i]) { count++; }
    }
    statusCounts.push(count);
  }
  makeChart("chartStatus", "doughnut", STATUSES, statusCounts, COLORS);

  // 3) Bar: oxirgi 7 kunlik savdo summasi (bekor qilinganlar kirmaydi)
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var dayLabels = [];
  var dayTotals = [];
  for (i = 6; i >= 0; i--) {
    var start = today.getTime() - i * DAY;
    var d = new Date(start);
    var sum = 0;
    for (j = 0; j < orders.length; j++) {
      // buyurtma id'si - uning vaqti
      if (orders[j].id >= start && orders[j].id < start + DAY && orders[j].status != "Bekor") {
        sum = sum + orders[j].total;
      }
    }
    dayLabels.push(d.getDate() + "/" + (d.getMonth() + 1));
    dayTotals.push(sum);
  }
  makeChart("chartSales", "bar", dayLabels, dayTotals, "#10b981");
}
