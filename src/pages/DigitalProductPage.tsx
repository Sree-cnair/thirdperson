import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Copy, Download, Lock, Smartphone } from 'lucide-react';
import type { Product } from '@/data/types';
import { cmsSupabase } from '@/lib/cmsSupabase';
import { formatINR } from '@/lib/format';
const UPI_ID = import.meta.env.VITE_UPI_ID || '';
type CreatedOrder = { id: string; order_number: string; amount: number };

export function DigitalProductPage({ product }: { product: Product }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<CreatedOrder | null>(null); const [reference, setReference] = useState('');
  const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const createOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cmsSupabase || !UPI_ID) { setMessage('Checkout is not configured yet. Please check back soon.'); return; }
    setBusy(true); setMessage('');
    const id = crypto.randomUUID();
    const orderNumber = `TOP-${Date.now().toString(36).toUpperCase()}`;
    const { error } = await cmsSupabase.from('store_orders').insert({
      id, order_number: orderNumber, customer_name: name.trim(), customer_email: email.trim().toLowerCase(),
      customer_phone: phone.trim() || null, product_slug: product.slug, product_name: product.name,
      amount: 149, payment_method: 'upi_manual',
    });
    setBusy(false);
    if (error) { setMessage('We could not create your order. Please try again or contact the store.'); return; }
    setOrder({ id, order_number: orderNumber, amount: 149 });
  };
  const submitReference = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!cmsSupabase || !order || !reference.trim()) return;
    setBusy(true);
    const { error } = await cmsSupabase.from('store_orders').update({ payment_reference: reference.trim() }).eq('id', order.id);
    setBusy(false);
    setMessage(error ? 'Could not save the payment reference. Please email us with your order number.' : 'Payment reference received. We will verify the actual payment before sending your download.');
  };
  const upiLink = order ? `upi://pay?${new URLSearchParams({ pa: UPI_ID, pn: 'THE OTHER PERSON', am: String(order.amount), cu: 'INR', tn: `Order ${order.order_number}` }).toString()}` : '';
  return <main className="bg-cream"><div className="mx-auto max-w-[1200px] px-5 py-10 md:px-8 md:py-16">
    <Link to="/store" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-label"><ArrowLeft size={15}/> Back to store</Link>
    <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
      <div><div className="relative overflow-hidden bg-[#243CFF] shadow-xl"><img src="/products/2027-calendar-cover.svg" alt="2027 A Year of Other Plans calendar cover" className="block w-full"/><span className="absolute bottom-4 right-4 bg-[#F4ED55] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[#191919]">Digital edition</span></div>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">{['14-page PDF','A4 portrait','Monday start'].map(v=><div key={v} className="border border-ink/15 p-3 text-xs font-semibold uppercase tracking-wider">{v}</div>)}</div></div>
      <div><p className="eyebrow">THE OTHER PERSON / PRODUCT 01</p><h1 className="display-heading mt-4 text-5xl leading-[.95] md:text-7xl">2027 — A YEAR OF OTHER PLANS.</h1>
        <p className="mt-6 font-serif text-xl italic leading-relaxed text-charcoal">{product.tagline}</p><p className="mt-5 leading-relaxed text-charcoal">{product.description}</p>
        <div className="mt-7 flex items-end gap-3"><p className="text-3xl font-bold">{formatINR(149)}</p><p className="pb-1 text-sm text-charcoal-mid">one-time purchase · digital edition</p></div>
        <div className="mt-8 grid gap-3 border-y border-ink/15 py-6 text-sm"><p className="flex items-center gap-3"><Download size={17}/> 14-page PDF download</p><p className="flex items-center gap-3"><Smartphone size={17}/> Print at home or use on a tablet</p><p className="flex items-center gap-3"><Lock size={17}/> Download link after payment verification</p></div>
        {!order ? <form onSubmit={createOrder} className="mt-8 space-y-4"><h2 className="text-sm font-bold uppercase tracking-widest">Your details</h2>
          <label className="block text-sm">Full name<input required maxLength={100} value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full border border-ink/25 bg-white/60 p-3" autoComplete="name"/></label>
          <label className="block text-sm">Email for delivery<input required type="email" maxLength={200} value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full border border-ink/25 bg-white/60 p-3" autoComplete="email"/></label>
          <label className="block text-sm">Phone (optional)<input type="tel" maxLength={20} value={phone} onChange={e=>setPhone(e.target.value)} className="mt-2 w-full border border-ink/25 bg-white/60 p-3" autoComplete="tel"/></label>
          <button disabled={busy || !UPI_ID} className="btn-primary w-full disabled:opacity-50">{busy ? 'Creating order…' : `Continue to payment · ${formatINR(149)}`}</button>
          {!UPI_ID && <p className="border border-orange-300 bg-orange-50 p-3 text-sm">UPI checkout is not active yet. The store owner must add the UPI ID in Render before orders can be placed.</p>}
          {message && <p role="alert" className="text-sm text-red-700">{message}</p>}
        </form> : <section className="mt-8 border border-ink/20 bg-white/60 p-5 md:p-6">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"><CheckCircle2 size={17}/> Order created</p><p className="mt-2 text-sm">Order number: <strong>{order.order_number}</strong></p><p className="mt-1 text-sm">Amount: <strong>{formatINR(order.amount)}</strong></p>
          <a href={upiLink} className="btn-primary mt-5 w-full">Pay with UPI</a>
          <button type="button" onClick={()=>navigator.clipboard?.writeText(order.order_number)} className="mt-4 inline-flex items-center gap-2 text-xs underline"><Copy size={14}/> Copy order number</button>
          <form onSubmit={submitReference} className="mt-6 space-y-3 border-t border-ink/15 pt-5"><label className="block text-sm">UPI transaction ID / UTR<input required value={reference} onChange={e=>setReference(e.target.value)} className="mt-2 w-full border border-ink/25 bg-white p-3" placeholder="Enter payment reference after paying"/></label><button disabled={busy} className="btn-outline w-full disabled:opacity-50">{busy ? 'Submitting…' : 'I have paid — submit reference'}</button>{message && <p role="status" className="text-sm">{message}</p>}</form>
          <p className="mt-5 text-xs leading-relaxed text-charcoal-mid">We check the payment against our bank account before sending the PDF. A screenshot alone does not confirm payment. Keep your order number.</p>
        </section>}
      </div>
    </div>
  </div></main>;
}
