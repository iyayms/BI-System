/* =========================
SIDEBAR LOADING
========================= */

fetch("../components/sidebar.html")
.then(res => res.text())
.then(data => {

    const container = document.getElementById("sidebar-container");

    if(container){
        container.innerHTML = data;

        const links = document.querySelectorAll(".menu a");

        links.forEach(link=>{
            if(link.getAttribute("href").includes("products.html")){
                link.classList.add("active");
            }
        });
    }

})
.catch(err=>console.error("Error loading sidebar:",err));



/* =========================
PRODUCT DATA
========================= */

const products = [

{ id:"SP-001", name:"Special Halo-halo", category:"Special", margin:40, price:100, ingredients:10, status:"Available"},
{ id:"SP-002", name:"Saba De Leche", category:"Special", margin:40, price:100, ingredients:7, status:"Available"},
{ id:"SP-003", name:"Mais De Leche", category:"Special", margin:40, price:100, ingredients:8, status:"Not Available"},

{ id:"SH-001", name:"Mango Graham Shake", category:"Shake", margin:30, price:100, ingredients:8, status:"Available"},
{ id:"SH-002", name:"Mango Shake", category:"Shake", margin:25, price:80, ingredients:5, status:"Available"},
{ id:"SH-003", name:"Melon Shake", category:"Shake", margin:25, price:80, ingredients:5, status:"No Ingredients"},
{ id:"SH-004", name:"Oreo Cheese Shake", category:"Shake", margin:25, price:80, ingredients:6, status:"Available"},

{ id:"IC-001", name:"Halo-halo", category:"Iced", margin:20, price:80, ingredients:10, status:"Available"},
{ id:"IC-002", name:"Mango Con Yelo", category:"Iced", margin:15, price:50, ingredients:4, status:"Available"},
{ id:"IC-003", name:"Mais Con Yelo", category:"Iced", margin:15, price:50, ingredients:4, status:"Available"},
{ id:"IC-004", name:"Saba Con Yelo", category:"Iced", margin:15, price:50, ingredients:4, status:"Available"},
{ id:"IC-005", name:"Milo Con Yelo", category:"Iced", margin:15, price:50, ingredients:4, status:"Available"}

];



/* =========================
INVENTORY DATA
========================= */

const inventory = [

{ category:"Fruit", name:"Mango", pricePerGram:0.8, stock:150 },

{ category:"Powder", name:"Milo", pricePerGram:0.6, stock:200 },

{ category:"Sweetener", name:"Sugar", pricePerGram:0.3, stock:500 },

{ category:"Dairy", name:"Milk", pricePerGram:0.5, stock:300 }

];



/* =========================
RENDER PRODUCT TABLE
========================= */

function renderProductTable(data){

const tbody = document.getElementById("productTableBody");

if(!tbody) return;

tbody.innerHTML = data.map(item=>{

const statusClass = item.status.toLowerCase().replace(/\s+/g,'_');

return`

<tr>

<td>${item.id}</td>
<td><strong>${item.name}</strong></td>
<td>${item.category}</td>
<td>${item.margin}%</td>
<td>₱${item.price}</td>
<td>${item.ingredients}</td>

<td>
<span class="status-text status-${statusClass}">
${item.status}
</span>
</td>

<td>

<div class="action-btns">

<i class="ph ph-note-pencil"></i>
<i class="ph ph-trash"></i>

</div>

</td>

</tr>

`;

}).join("");

}



/* =========================
ADD PRODUCT MODAL
========================= */

const addModal = document.getElementById("addModal");
const addBtn = document.querySelector(".add-btn");
const closeModal = document.getElementById("closeModal");

if(addBtn){
addBtn.onclick = ()=> addModal.classList.add("active");
}

if(closeModal){
closeModal.onclick = ()=>{

addModal.classList.remove("active");
document.getElementById("ingredientBody").innerHTML="";

};
}



/* =========================
INGREDIENT MODAL
========================= */

const ingredientModal = document.getElementById("ingredientOverlay");
const addIngredientBtn = document.querySelector(".add-ing-btn");
const closeIngredientModal = document.getElementById("closeIngredientModal");

if(addIngredientBtn){
addIngredientBtn.onclick = ()=>{
ingredientModal.classList.add("active");
};
}

if(closeIngredientModal){
closeIngredientModal.onclick = ()=>{
ingredientModal.classList.remove("active");
};
}



/* =========================
POPULATE CATEGORY DROPDOWN
========================= */

const categorySelect = document.getElementById("ingredientCategory");

if(categorySelect){

const categories = [...new Set(inventory.map(i=>i.category))];

categories.forEach(cat=>{

const option = document.createElement("option");

option.value = cat;
option.textContent = cat;

categorySelect.appendChild(option);

});

}



/* =========================
UPDATE INGREDIENT LIST
========================= */

document.getElementById("ingredientCategory")
.addEventListener("change",function(){

const category = this.value;

const ingredientSelect = document.getElementById("ingredientName");

ingredientSelect.innerHTML = "<option value=''>Select Ingredient</option>";

inventory
.filter(i=>i.category===category)
.forEach(item=>{

const option = document.createElement("option");

option.value = item.name;
option.textContent = item.name;

ingredientSelect.appendChild(option);

});

});



/* =========================
AUTO FILL INGREDIENT DATA
========================= */

document.getElementById("ingredientName")
.addEventListener("change",autoFillIngredient);

function autoFillIngredient(){

const name = document.getElementById("ingredientName").value;

const item = inventory.find(i=>i.name===name);

if(!item) return;

document.getElementById("pricePerGram").innerText =
"₱"+item.pricePerGram.toFixed(2);

document.getElementById("remainingStock").innerText =
item.stock+" g";

const status = document.getElementById("ingredientStatus");

if(item.stock<=0){

status.textContent="No Stocks";
status.style.color="red";

}
else if(item.stock<100){

status.textContent="Low Stock";
status.style.color="orange";

}
else{

status.textContent="Available";
status.style.color="green";

}

}



/* =========================
COMPUTE UNIT COST
========================= */

document.getElementById("ingredientGrams")
.addEventListener("input",computeUnitCost);

function computeUnitCost(){

const grams = parseFloat(
document.getElementById("ingredientGrams").value
);

const name = document.getElementById("ingredientName").value;

const item = inventory.find(i=>i.name===name);

if(!item || !grams) return;

const cost = grams * item.pricePerGram;

document.getElementById("unitCost").innerText =
"₱"+cost.toFixed(2);

}



/* =========================
SAVE INGREDIENT
========================= */

let totalMaterialCost = 0;

document.getElementById("saveIngredient").onclick = function(){

const tbody = document.getElementById("ingredientBody");

const name = document.getElementById("ingredientName").value;
const grams = document.getElementById("ingredientGrams").value;

const item = inventory.find(i=>i.name===name);

if(!item) return;

const unitCost = grams * item.pricePerGram;

totalMaterialCost += unitCost;

document.getElementById("totalMaterialCost").value =
"₱"+totalMaterialCost.toFixed(2);

updateProfit();



/* ADD ROW */

const row = document.createElement("tr");

row.innerHTML = `

<td>${tbody.children.length+1}</td>
<td>${name}</td>
<td>${grams}</td>
<td>${item.pricePerGram}</td>

<td>
<i class="ph ph-trash"
onclick="this.closest('tr').remove()">
</i>
</td>

`;

tbody.appendChild(row);

ingredientModal.classList.remove("active");

};



/* =========================
UPDATE PROFIT
========================= */

function updateProfit(){

const price =
parseFloat(document.getElementById("newProductPrice").value);

if(!price) return;

const margin = price - totalMaterialCost;

const percent = (margin/price)*100;

document.getElementById("estimatedMargin").innerText =
"₱"+margin.toFixed(2)+" ("+percent.toFixed(1)+"%)";

document.getElementById("materialsCostDisplay").value =
"₱"+totalMaterialCost.toFixed(2);

}

document.getElementById("newProductPrice")
.addEventListener("input",updateProfit);



/* =========================
FILTERS
========================= */

document.addEventListener("change",(e)=>{

if(e.target.id==="categoryFilter"){

const selected = e.target.value;

if(selected==="All Categories"){
renderProductTable(products);
}
else{
const filtered =
products.filter(p=>p.category===selected);
renderProductTable(filtered);
}

}

if(e.target.id==="priceFilter"){

let sorted=[...products];

if(e.target.value==="Low to High"){
sorted.sort((a,b)=>a.price-b.price);
}

if(e.target.value==="High to Low"){
sorted.sort((a,b)=>b.price-a.price);
}

renderProductTable(sorted);

}

});



/* =========================
INITIALIZE
========================= */

document.addEventListener("DOMContentLoaded",()=>{

renderProductTable(products);

});