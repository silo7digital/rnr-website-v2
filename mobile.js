// Mobile-only lightbox swipe enhancement. Desktop behavior remains in script.js.
(()=>{
  const gal=document.querySelector('.gallery--lightbox');
  if(!gal)return;
  let startX=0,startY=0;
  gal.addEventListener('touchstart',e=>{const t=e.changedTouches[0];startX=t.clientX;startY=t.clientY},{passive:true});
  gal.addEventListener('touchend',e=>{
    if(!gal.classList.contains('is-open'))return;
    const t=e.changedTouches[0],dx=startX-t.clientX,dy=startY-t.clientY;
    if(Math.abs(dx)<55||Math.abs(dx)<=Math.abs(dy)*1.15)return;
    const button=gal.querySelector(dx>0?'.gallery-next':'.gallery-prev');
    button?.click();
  },{passive:true});
})();
