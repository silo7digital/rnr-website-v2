const panels=[...document.querySelectorAll('.panel')];
const nav=[...document.querySelectorAll('.site-nav button')];
const bg=[document.querySelector('#bg-a'),document.querySelector('#bg-b')];
const wipe=document.querySelector('.wipe-edge');
const body=document.body;
const progress=document.querySelector('.progress i');
const sectionName=document.querySelector('.section-name');
const words=[...document.querySelectorAll('.hero-word')];
const state={panel:0,word:0,bg:0,transitioning:false,wheelLock:false};
const names=['ROOTS n REVERIE','Tide','Bloom','Still','Prints','About'];
const galleries={
 tide:[1,2,3,4,5,6,7],
 bloom:[8,9,10,19,20,21,22,23,24],
 still:[11,12,13,14,15,16,17,18],
 prints:[2,6,10,14,20,24]
};
const allPhotos=Array.from({length:24},(_,i)=>i+1);
const categories={};Object.entries(galleries).forEach(([k,arr])=>{if(k==='prints')return;arr.forEach(n=>categories[n]=k)});
function imagePath(n){return `assets/images/photo-${String(n).padStart(2,'0')}.jpg`}
function setBg(el,path){el.style.backgroundImage=`url('${path}')`}
setBg(bg[0],panels[0].dataset.image);
function overlayOpen(){return document.querySelector('.overlay-screen.is-open')||document.querySelector('.gallery--lightbox.is-open')||document.querySelector('.cart-drawer.is-open')}
function updateUI(){
 const p=panels[state.panel]; body.dataset.section=p.id;
 nav.forEach(b=>b.classList.toggle('is-active',b.dataset.target===p.id));
 progress.style.transform=`scaleX(${state.panel/(panels.length-1)})`;
 sectionName.textContent=names[state.panel];
 document.querySelector('.prev').disabled=state.panel===0&&state.word===0;
 document.querySelector('.next').disabled=state.panel===panels.length-1;
}
function animateWord(next,dir){if(state.transitioning||next<0||next>=words.length||next===state.word)return;state.transitioning=true;const cur=words[state.word],n=words[next];n.classList.add('is-current');n.style.transform=`translateY(${dir>0?118:-118}%)`;n.style.opacity=1;requestAnimationFrame(()=>{cur.style.transition=n.style.transition='transform .76s cubic-bezier(.76,0,.24,1),opacity .76s';cur.style.transform=`translateY(${dir>0?-118:118}%)`;cur.style.opacity=0;n.style.transform='translateY(0)'});setTimeout(()=>{cur.classList.remove('is-current');cur.style.transition='';n.style.transition='';state.word=next;state.transitioning=false;updateUI()},790)}
function switchPanel(next){if(state.transitioning||next<0||next>=panels.length||next===state.panel)return;state.transitioning=true;const curIdx=state.panel,dir=next>curIdx?1:-1,cur=panels[curIdx],n=panels[next];const oldBg=bg[state.bg],newIdx=state.bg?0:1,newBg=bg[newIdx];setBg(newBg,n.dataset.image);newBg.style.opacity=1;newBg.style.zIndex=2;newBg.style.clipPath=dir>0?'inset(0 100% 0 0)':'inset(0 0 0 100%)';n.classList.add('is-active');n.setAttribute('aria-hidden','false');const curItems=[...cur.querySelectorAll('.panel-copy>*')],nextItems=[...n.querySelectorAll('.panel-copy>*')];nextItems.forEach(el=>{el.style.opacity=0;el.style.transform=`translateY(${dir>0?42:-42}px)`;el.style.transition='none'});wipe.style.left=dir>0?'0%':'100%';wipe.style.opacity=.8;requestAnimationFrame(()=>{oldBg.style.transition='filter 1s';newBg.style.transition='clip-path 1s cubic-bezier(.7,0,.2,1)';wipe.style.transition='left 1s cubic-bezier(.7,0,.2,1),opacity .18s';newBg.style.clipPath='inset(0 0 0 0)';wipe.style.left=dir>0?'100%':'0%';curItems.forEach((el,i)=>{el.style.transition=`transform .34s ${i*.025}s,opacity .34s ${i*.025}s`;el.style.transform=`translateY(${dir>0?-24:24}px)`;el.style.opacity=0});setTimeout(()=>{nextItems.forEach((el,i)=>{el.style.transition=`transform .72s ${i*.065}s cubic-bezier(.2,.75,.2,1),opacity .72s ${i*.065}s`;el.style.opacity=1;el.style.transform='translateY(0)'})},560)});setTimeout(()=>{cur.classList.remove('is-active');cur.setAttribute('aria-hidden','true');curItems.forEach(el=>{el.style=''});nextItems.forEach(el=>{el.style=''});oldBg.classList.remove('is-active');oldBg.style.opacity=0;oldBg.style.zIndex=0;newBg.classList.add('is-active');newBg.style.zIndex=1;newBg.style.clipPath='none';wipe.style.opacity=0;wipe.style.transition='';state.bg=newIdx;state.panel=next;state.transitioning=false;updateUI();history.replaceState(null,'',`#${n.id}`)},1320)}
function step(dir){if(state.transitioning)return;if(state.panel===0){if(dir>0&&state.word<words.length-1)return animateWord(state.word+1,1);if(dir<0&&state.word>0)return animateWord(state.word-1,-1)}switchPanel(state.panel+dir)}
window.addEventListener('wheel',e=>{if(state.wheelLock||Math.abs(e.deltaY)<18||overlayOpen())return;state.wheelLock=true;step(e.deltaY>0?1:-1);setTimeout(()=>state.wheelLock=false,820)},{passive:true});
window.addEventListener('keydown',e=>{if(overlayOpen())return;if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();step(1)}if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();step(-1)}});
let touchY=0;window.addEventListener('touchstart',e=>touchY=e.changedTouches[0].clientY,{passive:true});window.addEventListener('touchend',e=>{if(overlayOpen())return;const d=touchY-e.changedTouches[0].clientY;if(Math.abs(d)>45)step(d>0?1:-1)},{passive:true});
document.querySelector('.next').onclick=()=>step(1);document.querySelector('.prev').onclick=()=>step(-1);
nav.forEach(b=>b.onclick=()=>{const i=panels.findIndex(p=>p.id===b.dataset.target);switchPanel(i)});document.querySelector('.home-mark').onclick=e=>{e.preventDefault();if(state.panel===0){if(state.word!==0)animateWord(0,-1)}else switchPanel(0)};

// series lightbox
const gal=document.querySelector('.gallery--lightbox'),galImg=gal.querySelector('img'),galTitle=gal.querySelector('.gallery-title'),galIndex=gal.querySelector('.gallery-index');let currentSet=[],gi=0;
function drawGallery(){const n=currentSet[gi];galImg.src=imagePath(n);galIndex.textContent=`${String(gi+1).padStart(2,'0')} / ${String(currentSet.length).padStart(2,'0')}`}
function openLightbox(set,title,start=0){currentSet=[...set];gi=Math.max(0,start);galTitle.textContent=title;drawGallery();gal.classList.add('is-open');gal.setAttribute('aria-hidden','false')}
function openSeries(key){const set=galleries[key]||[];if(set.length)openLightbox(set,key,0)}
function closeLightbox(){gal.classList.remove('is-open');gal.setAttribute('aria-hidden','true')}
document.querySelectorAll('[data-gallery]').forEach(b=>b.onclick=()=>openSeries(b.dataset.gallery));gal.querySelector('.gallery-close').onclick=closeLightbox;gal.querySelector('.gallery-next').onclick=()=>{gi=(gi+1)%currentSet.length;drawGallery()};gal.querySelector('.gallery-prev').onclick=()=>{gi=(gi-1+currentSet.length)%currentSet.length;drawGallery()};

// full gallery
const fullGallery=document.querySelector('.full-gallery');const grid=document.querySelector('#fullGalleryGrid');const filterBtns=[...document.querySelectorAll('.gallery-filters button')];
function renderFullGallery(filter='all'){
 const set=filter==='all'?allPhotos:allPhotos.filter(n=>categories[n]===filter);
 grid.innerHTML='';
 set.forEach((n,idx)=>{const cat=categories[n]||'archive';const b=document.createElement('button');b.className='gallery-tile';b.innerHTML=`<img src="${imagePath(n)}" alt="ROOTS n REVERIE photograph ${String(n).padStart(2,'0')}"><span class="gallery-tile-meta"><span>${cat}</span><span>${String(n).padStart(2,'0')}</span></span>`;b.onclick=()=>openLightbox(set,filter==='all'?'Gallery':filter,idx);grid.appendChild(b)});
}
function openFullGallery(){renderFullGallery(document.querySelector('.gallery-filters .is-active')?.dataset.filter||'all');fullGallery.classList.add('is-open');fullGallery.setAttribute('aria-hidden','false')}
function closeFullGallery(){fullGallery.classList.remove('is-open');fullGallery.setAttribute('aria-hidden','true')}
document.querySelectorAll('[data-open-gallery]').forEach(b=>b.onclick=openFullGallery);document.querySelector('[data-close-gallery]').onclick=closeFullGallery;
filterBtns.forEach(b=>b.onclick=()=>{filterBtns.forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');renderFullGallery(b.dataset.filter)});

// shop + cart
const products=[
 {id:'p1',photo:2,title:'Last Light',edition:'Open edition',price:85},
 {id:'p2',photo:6,title:'White Water',edition:'Limited edition · 50',price:110},
 {id:'p3',photo:10,title:'Poppies',edition:'Open edition',price:85},
 {id:'p4',photo:14,title:'Dusk Palm',edition:'Limited edition · 30',price:120},
 {id:'p5',photo:20,title:'Wild Pink',edition:'Open edition',price:85},
 {id:'p6',photo:24,title:'Small Light',edition:'Limited edition · 50',price:95}
];
const sizes=[['A4',0],['A3',25],['A2',60]];let cart=[];const shop=document.querySelector('.shop-screen'),productGrid=document.querySelector('#productGrid'),cartDrawer=document.querySelector('.cart-drawer'),cartScrim=document.querySelector('.cart-scrim');
function renderProducts(){productGrid.innerHTML=products.map(p=>`<article class="product-card" data-product="${p.id}"><div class="print-wrap"><div class="print-paper"><img src="${imagePath(p.photo)}" alt="${p.title}"></div></div><div class="product-info"><h3>${p.title}</h3><span class="product-price">from €${p.price}</span><p class="product-edition">${p.edition}</p><div class="product-controls"><select aria-label="Print size">${sizes.map(s=>`<option value="${s[0]}" data-extra="${s[1]}">${s[0]}</option>`).join('')}</select><button>Add to cart</button></div></div></article>`).join('');productGrid.querySelectorAll('.product-card').forEach(card=>{const p=products.find(x=>x.id===card.dataset.product);const select=card.querySelector('select');const price=card.querySelector('.product-price');select.onchange=()=>{const extra=Number(select.selectedOptions[0].dataset.extra);price.textContent=`€${p.price+extra}`};card.querySelector('button').onclick=()=>{const extra=Number(select.selectedOptions[0].dataset.extra);cart.push({...p,size:select.value,linePrice:p.price+extra,key:`${p.id}-${select.value}-${Date.now()}`});renderCart();openCart()}})}
function openShop(){shop.classList.add('is-open');shop.setAttribute('aria-hidden','false')}
function closeShop(){shop.classList.remove('is-open');shop.setAttribute('aria-hidden','true');closeCart()}
document.querySelectorAll('[data-open-shop]').forEach(b=>b.onclick=openShop);document.querySelector('[data-close-shop]').onclick=closeShop;
function openCart(){cartDrawer.classList.add('is-open');cartDrawer.setAttribute('aria-hidden','false');cartScrim.classList.add('is-open')}
function closeCart(){cartDrawer.classList.remove('is-open');cartDrawer.setAttribute('aria-hidden','true');cartScrim.classList.remove('is-open')}
document.querySelector('.cart-toggle').onclick=openCart;document.querySelector('.cart-close').onclick=closeCart;cartScrim.onclick=closeCart;
function renderCart(){const box=document.querySelector('.cart-items');box.innerHTML=cart.length?cart.map(item=>`<div class="cart-item"><img src="${imagePath(item.photo)}" alt=""><div><strong>${item.title}</strong><span>${item.size} · €${item.linePrice}</span></div><button class="cart-remove" data-key="${item.key}" aria-label="Remove item">×</button></div>`).join(''):'<p style="color:rgba(255,255,255,.45);font-size:.75rem;padding:1rem 0">Your cart is empty.</p>';document.querySelector('.cart-count').textContent=cart.length;document.querySelector('.cart-total').textContent=`€${cart.reduce((s,i)=>s+i.linePrice,0)}`;box.querySelectorAll('.cart-remove').forEach(b=>b.onclick=()=>{cart=cart.filter(i=>i.key!==b.dataset.key);renderCart()})}

document.querySelector('.checkout-button').onclick=()=>alert('Prototype checkout — final commerce integration still to be connected.');
window.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(gal.classList.contains('is-open'))return closeLightbox();if(cartDrawer.classList.contains('is-open'))return closeCart();if(fullGallery.classList.contains('is-open'))return closeFullGallery();if(shop.classList.contains('is-open'))return closeShop()});
window.addEventListener('keydown',e=>{if(!gal.classList.contains('is-open'))return;if(e.key==='ArrowRight'){gi=(gi+1)%currentSet.length;drawGallery()}if(e.key==='ArrowLeft'){gi=(gi-1+currentSet.length)%currentSet.length;drawGallery()}});
renderProducts();renderCart();renderFullGallery();

// preloader
const pre=document.querySelector('.preloader'),pct=document.querySelector('.load-percent'),line=document.querySelector('.load-line i');let p=0;function tick(){p+=Math.max(.5,(100-p)*.07);if(p>100)p=100;pct.textContent=`${Math.floor(p)}%`;line.style.width=`${p}%`;if(p>=99.6){pct.textContent='100%';line.style.width='100%';setTimeout(()=>{pre.classList.add('is-done');body.classList.remove('is-loading');setTimeout(()=>pre.remove(),800)},180)}else requestAnimationFrame(tick)}setTimeout(()=>requestAnimationFrame(tick),120);updateUI();
