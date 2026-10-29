(()=>{const c=window.ARIYO_CONFIG||{},$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x])),money=n=>n==null||n===""?"Ask for price":typeof n==="number"?"₦"+n.toLocaleString("en-NG"):esc(n);let products=[],cart=[],services=[],locations=c.locations||[],ads=c.announcements||[],filter="all",ad=0,installPrompt=null;async function loadCatalogue(){
 const url=c.supabaseUrl,key=c.supabasePublishableKey;
 if(!window.supabase||!url||!key){products=[];services=[];renderProducts();renderServices();const g=$("#productsGrid");if(g)g.innerHTML='<div class="empty">The online catalogue is not connected yet. Please contact ARIYO.</div>';return}
 try{
  const db=window.ARIYO_CATALOG_CLIENT||(window.ARIYO_CATALOG_CLIENT=window.supabase.createClient(url,key));
  const [pr,sr]=await Promise.all([
   db.from("products").select("*").eq("is_published",true).order("sort_order",{ascending:true}),
   db.from("services").select("*").eq("is_published",true).order("sort_order",{ascending:true})
  ]);
  if(pr.error)throw new Error("Products: "+pr.error.message);
  if(sr.error)throw new Error("Services: "+sr.error.message);
  products=(pr.data||[]).map((p,i)=>({...p,id:p.id||p.slug||i,category:p.category||"other"}));
  services=(sr.data||[]).map((v,i)=>({...v,id:v.id||v.slug||i}));
  renderProducts();renderServices();
  if(!products.length){const g=$("#productsGrid");if(g)g.innerHTML='<div class="empty">No published products are available right now. Please contact ARIYO.</div>'}
  if(!services.length){const g=$("#servicesGrid");if(g)g.innerHTML='<div class="empty">No published services are available right now. Please contact ARIYO.</div>'}
 }catch(err){console.error("ARIYO catalogue load failed:",err);products=[];services=[];renderProducts();renderServices();const g=$("#productsGrid");if(g)g.innerHTML='<div class="empty">We could not load the live catalogue. Please refresh or contact ARIYO.</div>';const sg=$("#servicesGrid");if(sg)sg.innerHTML='<div class="empty">Services could not be loaded. Please refresh or contact ARIYO.</div>'}
}
function renderProducts(){let a=filter==="all"?products:products.filter(p=>(p.category||"other").toLowerCase()===filter);$("#productsGrid").innerHTML=a.length?a.map((p,i)=>`<article class="card"><div class="visual">${p.image_url?`<img loading="lazy" src="${esc(p.image_url)}" alt="${esc(p.name)}">`:`<span class="symbol">${["✳","❋","❦","✺"][i%4]}</span>`}<span class="chip">${esc((p.category||"other").replace(/-/g," "))}</span></div><div class="cardbody"><h3>${esc(p.name)}</h3><p>${esc(p.description||"Contact us for more information.")}</p><div class="cardfoot"><b class="price">${money(p.price)}</b><button class="addcart" type="button" data-add="${esc(p.name)}">ADD TO CART +</button><a class="enquirelink" href="#enquiry" data-product="${esc(p.name)}">ENQUIRE ↗</a></div></div></article>`).join(""):'<div class="empty">No products in this category yet.</div>'}function renderServices(){$("#servicesGrid").innerHTML=services.map((s,i)=>`<article class="servicecard">${s.image_url?`<img class="service-image" loading="lazy" src="${esc(s.image_url)}" alt="${esc(s.name)}" style="width:100%;height:190px;object-fit:cover;border-radius:12px;margin-bottom:14px" onerror="this.style.display='none'">`:""}<span class="num">0${i+1}</span><h3>${esc(s.name)}</h3><p>${esc(s.description||"Contact us to learn more.")}</p><a href="#enquiry" data-service="${esc(s.name)}">ASK ABOUT THIS ↗</a></article>`).join("")}function mapAt(i){let l=locations[i];if(!l)return;$("#mapLabel").textContent=(l.name||"LOCATION")+" • MAP";$$(".loccard").forEach((b,j)=>b.classList.toggle("active",i===j));if((l.address||"").trim()){$("#mapFrame").innerHTML=`<iframe title="Map for ${esc(l.name||"ARIYO location")}" loading="lazy" src="https://maps.google.com/maps?q=${encodeURIComponent(l.address)}&output=embed"></iframe>`;$("#directions").href="https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(l.address);$("#directions").target="_blank";$("#directions").rel="noopener"}else{$("#mapFrame").innerHTML='<b>⌖</b><strong>Verified address needed</strong><p>Add the real address to config.js to display the map and enable accurate directions.</p>';$("#directions").href="#enquiry";$("#directions").removeAttribute("target")}}function renderLocations(){$("#locationList").innerHTML=locations.length?locations.map((l,i)=>`<button class="loccard ${i===0?"active":""}" data-location="${i}"><strong>${esc(l.name||"Location "+(i+1))}　↗</strong><span>${esc(l.address||"Address to be confirmed")}</span><span>${esc(l.hours||"Please contact us to confirm opening hours")}</span></button>`).join(""):'<p>Locations will be added by the ARIYO team.</p>';mapAt(0)}function showAd(i,typing=true){if(!ads.length)return;ad=(i+ads.length)%ads.length;$("#adTitle").textContent=ads[ad].title||"A note from our team";let el=$("#adText"),txt=ads[ad].text||"";el.textContent="";if(!typing){el.textContent=txt;return}let n=0;(function tick(){if(n<txt.length){el.textContent+=txt[n++];setTimeout(tick,22)}})()}function toast(t){let e=$("#toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),3000)}function renderCart(){let box=$("#cartItems");if(!cart.length){box.innerHTML="<p>Your cart is empty. Add products to get started.</p>"}else{box.innerHTML=cart.map(x=>`<div class="cart-row"><div><strong>${esc(x.name)}</strong><small>${money(x.price)} each</small></div><div class="qty"><button type="button" data-remove="${esc(x.name)}">−</button><b>${x.qty}</b><button type="button" data-add="${esc(x.name)}">+</button></div><strong>${money(x.price*x.qty)}</strong></div>`).join("")}$("#cartTotal").textContent="₦"+cart.reduce((sum,x)=>sum+(Number(x.price)||0)*x.qty,0).toLocaleString("en-NG");}$("#whatsappCheckout").onclick=async()=>{
 if(!cart.length){toast("Add a product to your cart first.");return}
 const name=$("#checkoutName").value.trim(),email=$("#checkoutEmail").value.trim(),phone=$("#checkoutPhone").value.trim(),whatsapp=$("#checkoutWhatsApp").value.trim(),address=$("#checkoutAddress").value.trim(),notes=$("#checkoutNotes").value.trim(),receipt=$("#checkoutReceipt").files[0],reference=$("#checkoutReference").value.trim();
 const feedback=$("#checkoutFeedback"),button=$("#whatsappCheckout");
 const say=t=>{if(feedback)feedback.textContent=t};
 if(!name||!email||!phone||!whatsapp||!address){toast("Complete all required customer and delivery details.");return}
 if(!receipt){toast("Upload your bank transfer receipt first.");return}
 const allowed=["image/jpeg","image/png","image/webp","application/pdf"];
 if(!allowed.includes(receipt.type)||receipt.size>10*1024*1024){toast("Choose a JPG, PNG, WEBP or PDF receipt up to 10 MB.");return}
 if(!window.supabase||!window.ARIYO_SUPABASE_URL||!window.ARIYO_SUPABASE_ANON_KEY){say("Checkout is not connected. Ask the site owner to finish the Supabase setup.");return}
 const client=window.ARIYO_ORDER_CLIENT||(window.ARIYO_ORDER_CLIENT=window.supabase.createClient(window.ARIYO_SUPABASE_URL,window.ARIYO_SUPABASE_ANON_KEY));
 const {data:{user},error:authError}=await client.auth.getUser();
 if(authError||!user){say("Please sign in to your ARIYO account first. Your cart will remain on this page.");toast("Sign in before checkout.");return}
 const orderId=crypto.randomUUID(),ext=receipt.type==="application/pdf"?"pdf":receipt.type==="image/png"?"png":receipt.type==="image/webp"?"webp":"jpg",path=`${user.id}/${orderId}/${Date.now()}.${ext}`;
 const popup=window.open("about:blank","_blank");button.disabled=true;button.textContent="Submitting order…";say("Uploading your receipt securely…");
 try{
   const {error:uploadError}=await client.storage.from("ariyo-payment-receipts").upload(path,receipt,{contentType:receipt.type,upsert:false});
   if(uploadError)throw uploadError;
   say("Saving your order to ARIYO…");
   const {data:created,error:createError}=await client.rpc("submit_ariyo_order",{p_order_id:orderId,p_customer_name:name,p_email:email,p_phone:phone,p_whatsapp_number:whatsapp,p_delivery_address:address,p_delivery_notes:notes,p_items:cart.map(x=>({name:x.name,qty:x.qty})),p_receipt_path:path,p_payment_reference:reference});
   if(createError)throw createError;
   const order=Array.isArray(created)?created[0]:created;
   const total=Number(order?.total??cart.reduce((sum,x)=>sum+(Number(x.price)||0)*x.qty,0));
   const lines=["ARIYO HERBAL EXTRACTS & SPIRITUAL EMPIRE","NEW WEBSITE ORDER — RECEIPT UPLOADED","--------------------------------",`Order: ${order?.order_number||orderId}`,`Tracking: ${order?.tracking_id||"Pending"}`,"",...cart.map((x,i)=>`${i+1}. ${x.name} | Qty: ${x.qty} | ₦${(Number(x.price||0)*x.qty).toLocaleString("en-NG")}`),"",`Subtotal: ₦${total.toLocaleString("en-NG")}`,"Delivery fee: Please confirm with ARIYO","", "CUSTOMER DETAILS",`Name: ${name}`,`Email: ${email}`,`Phone: ${phone}`,`WhatsApp: ${whatsapp}`,`Delivery address: ${address}`,`Delivery notes: ${notes||"None"}`,`Payment reference: ${reference||"Not provided"}`,"Receipt uploaded to the private order system.","Please verify the bank transfer and confirm payment and delivery details."];
   const num=(window.ARIYO_WHATSAPP||"2348132455540").replace(/\D/g,"");const url="https://wa.me/"+num+"?text="+encodeURIComponent(lines.join("\n"));
   if(popup)popup.location.href=url;else window.location.href=url;
   cart=[];renderCart();$("#checkoutReceipt").value="";$("#checkoutReference").value="";say(`Order ${order?.order_number||"submitted"} saved successfully. It will show in My Account as pending while ARIYO reviews the receipt.`);toast("Order saved and WhatsApp opened.");
 }catch(err){if(popup)popup.close();console.error(err);say("Order was not fully submitted: "+(err.message||"Unknown error")+". Do not pay again; check My Account before retrying.");toast("Could not submit order. See checkout message.")}
 finally{button.disabled=false;button.textContent="Submit order & send via WhatsApp ↗"}
};let copy=$("#copyAccount");if(copy)copy.onclick=()=>{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText("5216964606").then(()=>toast("Account number copied")).catch(()=>toast("Account number: 5216964606"))}else toast("Account number: 5216964606")};$("#menuToggle").onclick=()=>{$("#nav").classList.toggle("open");$("#menuToggle").textContent=$("#nav").classList.contains("open")?"×":"☰"};$$('#nav a').forEach(a=>a.onclick=()=>$("#nav").classList.remove("open"));$$(".filters button").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;$$(".filters button").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});document.addEventListener("click",e=>{let add=e.target.closest("[data-add]");if(add){let p=products.find(x=>x.name===add.dataset.add);if(p){let item=cart.find(x=>x.name===p.name);if(item)item.qty++;else cart.push({...p,qty:1});renderCart();toast(p.name+" added to cart");}return;}let remove=e.target.closest("[data-remove]");if(remove){let item=cart.find(x=>x.name===remove.dataset.remove);if(item){item.qty--;if(item.qty<=0)cart=cart.filter(x=>x.name!==item.name);renderCart();}return;}let p=e.target.closest("[data-product]"),s=e.target.closest("[data-service]"),l=e.target.closest("[data-location]");if(p||s){$('select[name="subject"]').value=p?"Product enquiry":"Service enquiry";$('textarea[name="message"]').value="I'm enquiring about "+(p||s).dataset[p?"product":"service"]+". Please share more information."}if(l)mapAt(Number(l.dataset.location))});$("#prevAd").onclick=()=>showAd(ad-1);$("#nextAd").onclick=()=>showAd(ad+1);$("#enquiryForm").onsubmit=async e=>{
 e.preventDefault();
 const form=e.currentTarget,feedback=$("#formFeedback"),button=form.querySelector('button[type="submit"]');
 const say=t=>{if(feedback)feedback.textContent=t};
 const values=new FormData(form);
 const customerName=String(values.get("name")||"").trim();
 const email=String(values.get("email")||"").trim();
 const phone=String(values.get("phone")||"").trim();
 const subject=String(values.get("subject")||"").trim();
 const message=String(values.get("message")||"").trim();
 if(!customerName||!subject||!message){say("Please enter your name, choose an enquiry type and write your message.");return}
 const url=c.supabaseUrl,key=c.supabasePublishableKey;
 if(!window.supabase||!url||!key){say("Online enquiries are not connected yet. Please contact ARIYO by WhatsApp.");toast("Enquiry service is not configured.");return}
 const db=window.ARIYO_ENQUIRY_CLIENT||(window.ARIYO_ENQUIRY_CLIENT=window.supabase.createClient(url,key));
 if(button){button.disabled=true;button.textContent="Sending…"}
 say("Sending your enquiry securely…");
 try{
  const {error}=await db.from("enquiries").insert({customer_name:customerName,email:email||null,phone:phone||null,subject,message,status:"new"});
  if(error)throw error;
  form.reset();say("Thank you! Your enquiry has been sent to ARIYO. Our team will review it and get back to you.");toast("Enquiry sent successfully.");
 }catch(err){
  console.error("ARIYO enquiry submission failed:",err);
  say("We could not send your enquiry right now. Please try again later or contact ARIYO on WhatsApp. If the problem continues, the site administrator should check the Supabase enquiries table permissions.");
  toast("Enquiry could not be sent.");
 }finally{if(button){button.disabled=false;button.textContent="Send enquiry ↗"}}
};async function initPublicReviews(){
 const list=$("#publicReviews"),form=$("#reviewForm"),feedback=$("#reviewFeedback");
 if(!list)return;
 const say=(t)=>{if(feedback)feedback.textContent=t};
 const url=c.supabaseUrl||window.ARIYO_SUPABASE_URL;
 const key=c.supabasePublishableKey||window.ARIYO_SUPABASE_ANON_KEY;
 if(!window.supabase||!url||!key){list.innerHTML='<p class="empty">Approved reviews are temporarily unavailable. Please contact ARIYO.</p>';say('Review service is not configured.');return}
 const db=window.ARIYO_REVIEW_CLIENT||(window.ARIYO_REVIEW_CLIENT=window.supabase.createClient(url,key));
 async function loadApproved(){
  list.innerHTML='<p>Loading approved reviews…</p>';
  try{
   const {data,error}=await db.from('customer_reviews').select('customer_name,rating,review_text,created_at').eq('status','approved').order('created_at',{ascending:false}).limit(30);
   if(error)throw error;
   if(!data||!data.length){list.innerHTML='<p class="empty">No approved reviews yet. Be the first to share your experience.</p>';return}
   list.innerHTML=data.map(r=>`<article class="review-card" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:18px;margin:12px 0"><div aria-label="${Number(r.rating)||0} out of 5 stars" style="color:#e8c66a;letter-spacing:2px">${'★'.repeat(Math.max(0,Math.min(5,Number(r.rating)||0)))}${'☆'.repeat(5-Math.max(0,Math.min(5,Number(r.rating)||0)))}</div><p style="white-space:pre-wrap">${esc(r.review_text)}</p><strong>${esc(r.customer_name||'Customer')}</strong><small style="display:block;opacity:.75;margin-top:5px">${r.created_at?new Date(r.created_at).toLocaleDateString():''}</small></article>`).join('');
  }catch(err){console.error('ARIYO approved reviews could not load:',err);list.innerHTML='<p class="empty">Approved reviews could not be loaded. Please refresh the page later.</p>';say('Could not load approved reviews: '+(err.message||'Please check the customer_reviews table permissions.'));}
 }
 if(form){form.onsubmit=async e=>{
  e.preventDefault();const button=form.querySelector('button[type="submit"]');const fd=new FormData(form);const customer_name=String(fd.get('customer_name')||'').trim(),rating=Number(fd.get('rating')),review_text=String(fd.get('review_text')||'').trim();
  if(!customer_name||!Number.isInteger(rating)||rating<1||rating>5||review_text.length<5){say('Enter your name, choose a rating, and write a review of at least 5 characters.');return}
  if(button){button.disabled=true;button.textContent='Submitting…'}say('Submitting your review for ARIYO to approve…');
  try{let customer_id=null;try{const {data}=await db.auth.getUser();customer_id=data?.user?.id||null}catch(_){}
   const payload={customer_name,rating,review_text,status:'pending'};if(customer_id)payload.customer_id=customer_id;
   const {error}=await db.from('customer_reviews').insert(payload);if(error)throw error;form.reset();say('Thank you. Your review was submitted and will appear after ARIYO approves it.');await loadApproved();
  }catch(err){console.error('ARIYO review submission failed:',err);say('We could not submit your review: '+(err.message||'Please try again later.'));}
  finally{if(button){button.disabled=false;button.textContent='Submit review ↗'}}
 }}
 await loadApproved();
}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("#installButton").hidden=false;$("#installHelp").textContent="Install the app on your phone for quick access."});$("#installButton").onclick=async()=>{if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("#installButton").hidden=true}else toast("Open Chrome ⋮ and choose Install app or Add to Home screen.")};addEventListener("appinstalled",()=>{toast("ARIYO was installed.");$("#installButton").hidden=true});if("serviceWorker"in navigator&&location.protocol.startsWith("http"))addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));$("#year").textContent=new Date().getFullYear();renderProducts();renderServices();renderLocations();showAd(0,false);loadCatalogue();initPublicReviews()})();