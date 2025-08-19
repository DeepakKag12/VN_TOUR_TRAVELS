export async function sendWhatsApp(to, message){
  try {
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    if(!phoneId || !token){
      console.warn('[WhatsApp] Skipped (missing env vars)');
      return { skipped:true };
    }
    if(!to){
      console.warn('[WhatsApp] Skipped (no destination)');
      return { skipped:true };
    }
    let cleaned = String(to).replace(/[^+\d]/g,'');
    if(!cleaned.startsWith('+')){
      if(/^\d{10}$/.test(cleaned)) cleaned = '+91'+cleaned; else cleaned = '+'+cleaned;
    }
    const body = {
      messaging_product: 'whatsapp',
      to: cleaned.replace(/\+/,'').startsWith('91') ? cleaned : cleaned,
      type: 'text',
      text: { preview_url: false, body: String(message||'').slice(0,4096) }
    };
    const resp = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    });
    if(!resp.ok){
      const txt = await resp.text();
      console.warn('[WhatsApp] send failed', resp.status, txt);
      return { error:true, status:resp.status };
    }
    return await resp.json();
  } catch(err){
    console.warn('[WhatsApp] error', err.message);
    return { error:true, message: err.message };
  }
}
