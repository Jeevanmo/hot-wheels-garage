// Hot Wheels Garage — demo storefront. Replace the sample products and WhatsApp number before publishing.
const products = [
  {id:1,name:"CUSTOM 72 CHEVY LUV",category:"Racing",tag:"BESTSELLER",price:399,oldPrice:499,desc:"A track-inspired machine built for your display.","72.jpg"},
  {id:2,name:"Midnight Supercar",category:"Supercars",tag:"HOT PICK",price:499,oldPrice:599,desc:"Sleek lines and supercar attitude.",image:"https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Classic Muscle 68",category:"Classic",tag:"CLASSIC",price:349,oldPrice:399,desc:"Old-school muscle with timeless style.",image:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Street Racer X",category:"Racing",tag:"NEW DROP",price:449,oldPrice:549,desc:"A bold street racer for your collection.",image:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Italian Stallion",category:"Supercars",tag:"COLLECTOR",price:599,oldPrice:699,desc:"Exotic styling in a compact scale.",image:"https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Turbo Fantasy",category:"Fantasy",tag:"FAN FAVOURITE",price:299,oldPrice:349,desc:"Wild looks for fans of imaginative builds.",image:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Rally Storm",category:"Racing",tag:"RACE DAY",price:429,oldPrice:499,desc:"Inspired by rally stages and fast corners.",image:"https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Retro Roadster",category:"Classic",tag:"TIMELESS",price:379,oldPrice:449,desc:"A retro ride to complete your shelf.",image:"https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=700&q=80"}
];

let activeCategory = "All";
let searchTerm = "";
let cart = JSON.parse(localStorage.getItem("hwg-cart") || "[]");
let toastTimer;

const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");

const money = value => new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);

function renderProducts(){
  const visible = products.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    `${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  productGrid.innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/700x500/19191c/ffffff?text=Die-Cast+Car'">
        <span class="product-tag">${p.tag}</span>
        <button class="wishlist" data-wishlist="${p.id}" aria-label="Save ${p.name} to wishlist">♡</button>
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-bottom"><div><span class="price">${money(p.price)}</span><span class="old-price">${money(p.oldPrice)}</span></div><button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button></div>
      </div>
    </article>`).join("");
  emptyState.hidden = visible.length !== 0;
}

function saveCart(){ localStorage.setItem("hwg-cart", JSON.stringify(cart)); renderCart(); }
function addToCart(id){
  const found = cart.find(item => item.id === id);
  if(found) found.qty += 1; else cart.push({id,qty:1});
  saveCart();
  const p = products.find(item => item.id === id);
  showToast(`${p.name} added to your cart 🏁`);
}
function changeQty(id, amount){
  const item = cart.find(row => row.id === id);
  if(!item) return;
  item.qty += amount;
  cart = cart.filter(row => row.qty > 0);
  saveCart();
}
function renderCart(){
  const count = cart.reduce((sum,item)=>sum+item.qty,0);
  const total = cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("drawerCount").textContent = `(${count})`;
  document.getElementById("cartSubtotal").textContent = money(total);
  cartEmpty.style.display = count ? "none" : "block";
  cartFooter.style.display = count ? "block" : "none";
  cartItems.innerHTML = cart.map(item=>{
    const p = products.find(row=>row.id===item.id);
    return `<div class="cart-item"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><span class="cart-price">${money(p.price)}</span><div class="qty-controls"><button data-qty="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-change="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Remove ${p.name}">×</button></div>`;
  }).join("");
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show");cartDrawer.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show");cartDrawer.setAttribute("aria-hidden","true");document.body.style.overflow="";}
function showToast(message){
  const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400);
}

document.addEventListener("click", event=>{
  const add=event.target.closest("[data-add]");
  if(add) addToCart(Number(add.dataset.add));
  const filter=event.target.closest("[data-category]");
  if(filter){
    activeCategory=filter.dataset.category;
    document.querySelectorAll(".filter-chip").forEach(chip=>chip.classList.toggle("active",chip===filter));
    renderProducts();
  }
  const qty=event.target.closest("[data-qty]");
  if(qty) changeQty(Number(qty.dataset.qty),Number(qty.dataset.change));
  const remove=event.target.closest("[data-remove]");
  if(remove){cart=cart.filter(item=>item.id!==Number(remove.dataset.remove));saveCart();}
  const wish=event.target.closest("[data-wishlist]");
  if(wish){wish.classList.toggle("liked");wish.textContent=wish.classList.contains("liked")?"♥":"♡";showToast(wish.classList.contains("liked")?"Saved to your wishlist":"Removed from wishlist");}
  const jump=event.target.closest("[data-jump-category]");
  if(jump){
    activeCategory=jump.dataset.jumpCategory;
    document.querySelectorAll(".filter-chip").forEach(chip=>chip.classList.toggle("active",chip.dataset.category===activeCategory));
    renderProducts();
  }
});

document.getElementById("searchInput").addEventListener("input",e=>{searchTerm=e.target.value.trim();renderProducts();});
document.getElementById("searchFocus").addEventListener("click",()=>{document.getElementById("shop").scrollIntoView({behavior:"smooth"});setTimeout(()=>document.getElementById("searchInput").focus(),350);});
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("continueShopping").addEventListener("click",closeCart);
document.getElementById("filterToggle").addEventListener("click",()=>document.getElementById("filterRow").classList.toggle("show"));
document.getElementById("menuToggle").addEventListener("click",()=>{
  const nav=document.getElementById("mainNav");const open=nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded",String(open));
});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});

// Set this to your WhatsApp number, including country code, without + or spaces.
const WHATSAPP_NUMBER = "+918667722343";
document.getElementById("checkoutBtn").addEventListener("click",()=>{
  if(!cart.length){showToast("Your cart is empty.");return;}
  if(WHATSAPP_NUMBER.includes("X")){showToast("Add your WhatsApp number in script.js first.");return;}
  const lines=cart.map(item=>{const p=products.find(row=>row.id===item.id);return `• ${p.name} × ${item.qty} — ${money(p.price*item.qty)}`;});
  const total=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  const message=`Hi Hot Wheels Garage! I'd like to order:\\n\\n${lines.join("\\n")}\\n\\nSubtotal: ${money(total)}\\nPlease confirm availability, shipping, and payment details.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");
});
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();
renderCart();
