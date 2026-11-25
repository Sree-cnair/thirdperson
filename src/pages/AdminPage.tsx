import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Box, Check, ChevronRight, FileText, Home, LogOut, Mail, Plus, Save, Settings, ShieldCheck, Tags, Users, X } from 'lucide-react';
import { cmsSupabase } from '@/lib/cmsSupabase';

type Tab = 'overview' | 'stories' | 'submissions' | 'products' | 'categories' | 'authors' | 'homepage' | 'newsletter' | 'orders';
type Row = Record<string, any>;
const NAV: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'stories', label: 'Stories', icon: BookOpen },
  { id: 'submissions', label: 'Submissions', icon: FileText },
  { id: 'products', label: 'Products', icon: Box },
  { id: 'orders', label: 'Orders', icon: Box },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'authors', label: 'Authors', icon: Users },
  { id: 'homepage', label: 'Homepage', icon: Settings },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
];
const emptyArticle = { title: '', slug: '', excerpt: '', dek: '', body: '', cover_image_url: '', image_alt: '', content_type: 'culture', section: 'stories', category_id: '', author_name: '', author_role: '', reading_time: 5, status: 'draft', featured: false };
const emptyProduct = { name: '', slug: '', description: '', tagline: '', price: '', compare_at_price: '', product_kind: 'physical', product_type: 'apparel', category: 'Tees', image_url: '', external_url: '', fabric: '', fit: '', sizes: 'S, M, L, XL', gallery: '', status: 'draft', inventory_mode: 'made_to_order', digital_file_path: '', printify_shop_id: '', printify_product_id: '', printify_variant_id: '', printify_blueprint_id: '', printify_provider_id: '' };
const emptyAuthor = { name: '', slug: '', role: '', bio: '', avatar_url: '', website_url: '', is_active: true };
const slugify = (value: string) => value.toLowerCase().trim().normalize('NFKD').replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
const splitLines = (value: string) => value.split('\n').map(v => v.trim()).filter(Boolean);
const joinJson = (value: unknown) => Array.isArray(value) ? value.join(', ') : '';
const prettyDate = (value: string) => value ? new Date(value).toLocaleDateString() : '—';

export function AdminPage() {
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState<{ email: string; name: string } | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [inviteSetupMode, setInviteSetupMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetNotice, setResetNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');
  const [data, setData] = useState<Record<string, Row[]>>({ articles: [], contributions: [], products: [], categories: [], authors: [], newsletter_subscribers: [], store_orders: [] });
  const [settings, setSettings] = useState<Row>({});
  const [editor, setEditor] = useState<{ kind: 'article' | 'product' | 'category' | 'author'; row: Row } | null>(null);
  const [notice, setNotice] = useState('');
  const [printifyShops, setPrintifyShops] = useState<Row[]>([]);
  const [printifyShopId, setPrintifyShopId] = useState('');
  const [printifyBusy, setPrintifyBusy] = useState(false);
  const [printifyStatus, setPrintifyStatus] = useState('');


  const configured = Boolean(cmsSupabase);
  const load = async () => {
    const client = cmsSupabase;
    if (!client) return;
    const tables = ['articles', 'contributions', 'products', 'categories', 'authors', 'newsletter_subscribers', 'store_orders'];
    const results = await Promise.all(tables.map(name => client.from(name).select('*').order('created_at', { ascending: false }).limit(200)));
    const next: Record<string, Row[]> = {};
    results.forEach((result, i) => { next[tables[i]] = result.error ? [] : (result.data ?? []); });
    setData(next);
    const { data: setting } = await client.from('site_settings').select('*').eq('id', 1).maybeSingle();
    if (setting) setSettings(setting);
  };

  const verifyUser = async (userId: string, userEmail: string) => {
    if (!cmsSupabase) return;
    const { data: row } = await cmsSupabase.from('admin_users').select('display_name').eq('user_id', userId).maybeSingle();
    if (row) {
      setAdmin({ email: userEmail, name: row.display_name || userEmail });
      await load();
    } else {
      await cmsSupabase.auth.signOut();
      setLoginError('This account is not authorised for THE OTHER PERSON Studio.');
    }
    setReady(true);
  };

  useEffect(() => {
    let active = true;
    if (!cmsSupabase) { setReady(true); return; }
    cmsSupabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      if (session?.user) {
        if (session.user.invited_at && !session.user.user_metadata?.password_setup_complete) setInviteSetupMode(true);
        void verifyUser(session.user.id, session.user.email || '');
      } else setReady(true);
    });
    const { data: listener } = cmsSupabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
      if (!active) return;
      if (session?.user) {
        if (session.user.invited_at && !session.user.user_metadata?.password_setup_complete) setInviteSetupMode(true);
        void verifyUser(session.user.id, session.user.email || '');
      } else setAdmin(null);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    if (!cmsSupabase) return;
    setBusy(true); setLoginError('');
    const { data: result, error } = await cmsSupabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setLoginError(error.message);
    else if (result.user) await verifyUser(result.user.id, result.user.email || email);
    setBusy(false);
  };

  const requestPasswordReset = async () => {
    if (!cmsSupabase) { setResetNotice('The sign-in service is not configured. Please contact support.'); return; }
    const targetEmail = resetEmail.trim().toLowerCase();
    if (!targetEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(targetEmail)) {
      setResetNotice('Enter the email address for your admin account.');
      return;
    }
    setBusy(true); setResetNotice(''); setLoginError('');
    try {
      const { error } = await cmsSupabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: 'https://the-other-person.onrender.com/admin',
      });
      setResetNotice(error ? `Could not send reset email: ${error.message}` : `Reset request submitted for ${targetEmail}. Check Inbox, Spam and Promotions. If it does not arrive, contact support.`);
    } catch (error) {
      setResetNotice(error instanceof Error ? `Could not send reset email: ${error.message}` : 'Could not send reset email. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const saveNewPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!cmsSupabase) return;
    if (newPassword.length < 8) { setResetNotice('Use a password with at least 8 characters.'); return; }
    setBusy(true); setResetNotice('');
    const { error } = await cmsSupabase.auth.updateUser({ password: newPassword, data: { password_setup_complete: true } });
    if (error) setResetNotice(error.message);
    else { setRecoveryMode(false); setInviteSetupMode(false); setNewPassword(''); setResetNotice('Password updated. You can now sign in with your new password.'); await cmsSupabase.auth.signOut(); }
    setBusy(false);
  };

  const signOut = async () => { if (cmsSupabase) await cmsSupabase.auth.signOut(); setAdmin(null); setTab('overview'); };

  const callPrintify = async (payload: Row) => {
    if (!cmsSupabase) throw new Error('CMS connection is unavailable.');
    const { data: { session } } = await cmsSupabase.auth.getSession();
    if (!session?.access_token) throw new Error('Please sign in again.');
    const { data, error } = await cmsSupabase.functions.invoke('printify-admin', {
      body: payload,
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data?.data;
  };

  const connectPrintify = async () => {
    setPrintifyBusy(true); setPrintifyStatus('');
    try {
      const shops = await callPrintify({ action: 'shops' });
      setPrintifyShops(Array.isArray(shops) ? shops : []);
      if (Array.isArray(shops) && shops.length) {
        setPrintifyShopId(String(shops[0].id));
        setPrintifyStatus(`Connected. Found ${shops.length} Printify shop(s).`);
      } else setPrintifyStatus('Printify is connected, but no API shop was found in this account.');
    } catch (error) {
      setPrintifyStatus(error instanceof Error ? error.message : 'Could not connect to Printify.');
    } finally { setPrintifyBusy(false); }
  };

  const syncPrintifyProducts = async () => {
    if (!printifyShopId) { setPrintifyStatus('Choose a Printify shop first.'); return; }
    setPrintifyBusy(true); setPrintifyStatus('');
    try {
      const items = await callPrintify({ action: 'products', shopId: printifyShopId });
      setPrintifyStatus(`Connection verified. Printify returned ${Array.isArray(items?.data) ? items.data.length : Array.isArray(items) ? items.length : 0} product(s). Product linking is the next step.`);
    } catch (error) {
      setPrintifyStatus(error instanceof Error ? error.message : 'Could not load Printify products.');
    } finally { setPrintifyBusy(false); }
  };

  const counts = useMemo(() => ({ stories: data.articles.length, published: data.articles.filter(a => a.status === 'published').length, pending: data.contributions.filter(a => a.status === 'pending' || a.status === 'in_review').length, products: data.products.length, subscribers: data.newsletter_subscribers.length }), [data]);

  const saveRow = async (kind: 'article' | 'product' | 'category' | 'author', values: Row) => {
    if (!cmsSupabase) return;
    setBusy(true); setNotice('');
    let table = kind === 'article' ? 'articles' : kind === 'product' ? 'products' : kind === 'category' ? 'categories' : 'authors';
    let payload: Row = { ...values };
    if (kind === 'article') {
      payload = { ...values, slug: values.slug || slugify(values.title), body: values.body, reading_time: Number(values.reading_time) || 5, category_id: values.category_id || null, published_at: values.status === 'published' ? (values.published_at || new Date().toISOString()) : null, updated_at: new Date().toISOString() };
    } else if (kind === 'product') {
      payload = { ...values, slug: values.slug || slugify(values.name), price: values.price === '' ? null : Number(values.price), compare_at_price: values.compare_at_price === '' ? null : Number(values.compare_at_price), product_kind: values.product_kind || 'physical', inventory_mode: values.inventory_mode || 'made_to_order', fabric: splitLines(values.fabric), fit: splitLines(values.fit), sizes: String(values.sizes || '').split(',').map((v: string) => v.trim()).filter(Boolean), gallery: splitLines(String(values.gallery || '')).map((src: string) => ({ src, alt: values.name })), updated_at: new Date().toISOString() };
    } else if (kind === 'author') {
      payload = { ...values, slug: values.slug || slugify(values.name), updated_at: new Date().toISOString() };
    }
    const result = values.id ? await cmsSupabase.from(table).update(payload).eq('id', values.id) : await cmsSupabase.from(table).insert(payload);
    setBusy(false);
    if (result.error) { setNotice(result.error.message); return; }
    setNotice('Saved successfully.');
    setEditor(null); await load();
  };

  const createPrintifyOrder = async (row: Row) => {
    const product = data.products.find(item => item.id === row.product_id);
    if (!product || !product.printify_product_id || !row.printify_variant_id || !row.shipping_address || !row.printify_shop_id) { setNotice('Missing Printify product, variant, shop or shipping details.'); return; }
    if (row.payment_status !== 'verified') { setNotice('Payment must be verified first.'); return; }
    setPrintifyBusy(true);
    try {
      const names = String(row.customer_name || 'Customer').trim().split(' ');
      const firstName = names.shift() || 'Customer';
      const payload = { external_id: row.id, label: row.order_number, line_items: [{ product_id: product.printify_product_id, variant_id: Number(row.printify_variant_id), quantity: row.quantity }], shipping_method: 1, is_printify_express: false, is_economy_shipping: false, send_shipping_notification: false, address_to: { first_name: firstName, last_name: names.join(' ') || firstName, email: row.customer_email, phone: row.customer_phone || '', country: row.shipping_address.country, region: row.shipping_address.region, address1: row.shipping_address.address1, city: row.shipping_address.city, zip: row.shipping_address.zip } };
      const result = await callPrintify({ action: 'create-order', shopId: row.printify_shop_id, order: payload });
      if (!result || !result.id) throw new Error('Printify did not return an order ID.');
      const saved = await cmsSupabase!.from('store_orders').update({ printify_order_id: result.id, updated_at: new Date().toISOString() }).eq('id', row.id);
      if (saved.error) throw saved.error;
      setNotice('Printify order created. It is held for production approval.'); await load();
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not create Printify order.'); }
    finally { setPrintifyBusy(false); }
  };
  const sendPrintifyToProduction = async (row: Row) => {
    if (row.payment_status !== 'verified' || !row.printify_order_id || !row.printify_shop_id) { setNotice('A paid order linked to Printify is required.'); return; }
    if (!window.confirm('Send this paid order to Printify production now? This may incur production costs.')) return;
    setPrintifyBusy(true);
    try {
      await callPrintify({ action: 'send-to-production', shopId: row.printify_shop_id, orderId: row.printify_order_id });
      const saved = await cmsSupabase!.from('store_orders').update({ fulfilment_status: 'in_production', updated_at: new Date().toISOString() }).eq('id', row.id);
      if (saved.error) throw saved.error;
      setNotice('Order sent to Printify production.'); await load();
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not send to production.'); }
    finally { setPrintifyBusy(false); }
  };

  const updateOrder = async (row: Row, patch: Row) => {
    if (!cmsSupabase) return;
    const { error } = await cmsSupabase.from('store_orders').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', row.id);
    setNotice(error ? error.message : 'Order updated.');
    await load();
  };

  const updateSubmission = async (row: Row, patch: Row) => {
    if (!cmsSupabase) return;
    const { error } = await cmsSupabase.from('contributions').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', row.id);
    setNotice(error ? error.message : 'Submission updated.'); await load();
  };

  const createDraftFromSubmission = async (row: Row) => {
    if (!cmsSupabase) return;
    const slug = slugify(row.proposed_title || 'untitled-submission');
    const matchedCategory = data.categories.find(category => category.name.toLowerCase() === String(row.category || '').toLowerCase());
    const contentType = ({ Cinema: 'culture', Football: 'football', Fashion: 'fashion', Design: 'culture', Society: 'culture', 'World Affairs': 'world_affairs', Opinion: 'opinion', Other: 'community' } as Record<string, string>)[row.category] || 'community';
    const { error } = await cmsSupabase.from('articles').insert({
      title: row.proposed_title, slug: slug + '-' + String(row.id).slice(0, 6), excerpt: row.content?.slice(0, 180) || '',
      dek: row.content?.slice(0, 220) || '', body: row.content || '',
      category_id: matchedCategory?.id || row.category_id || null, author_name: row.contributor_name, author_role: 'Community Contributor',
      content_type: contentType, section: row.category === 'Opinion' ? 'opinion' : 'stories',
      status: 'draft', featured: false, reading_time: Math.max(1, Math.ceil((row.content || '').split(/\s+/).length / 220)),
    });
    if (error) setNotice(error.message);
    else { await updateSubmission(row, { status: 'approved' }); setNotice(row.category === 'Opinion' ? 'Draft article created. Find it under Stories → Opinion.' : 'Draft article created. Find it under Stories.'); }
    await load();
  };

  const removeRow = async (kind: 'article' | 'product' | 'category' | 'author', row: Row) => {
    if (!cmsSupabase || !window.confirm('Delete this item? This cannot be undone.')) return;
    const table = kind === 'article' ? 'articles' : kind === 'product' ? 'products' : kind === 'category' ? 'categories' : 'authors';
    const { error } = await cmsSupabase.from(table).delete().eq('id', row.id);
    setNotice(error ? error.message : 'Deleted.'); await load();
  };

  const uploadImage = async (file: File, onUploaded: (url: string) => void) => {
    if (!cmsSupabase) return;
    setBusy(true);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-');
    const path = `editorial/${Date.now()}-${safeName}`;
    const { error } = await cmsSupabase.storage.from('pakaram-media').upload(path, file, { upsert: false, contentType: file.type });
    if (error) setNotice(error.message);
    else {
      const { data } = cmsSupabase.storage.from('pakaram-media').getPublicUrl(path);
      onUploaded(data.publicUrl);
      setNotice('Image uploaded.');
    }
    setBusy(false);
  };

  const uploadDigitalFile = async (file: File, onUploaded: (path: string) => void) => {
    if (!cmsSupabase) return;
    setBusy(true);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-');
    const path = `products/${Date.now()}-${safeName}`;
    const { error } = await cmsSupabase.storage.from('digital-products').upload(path, file, { upsert: false, contentType: file.type || 'application/octet-stream' });
    if (error) setNotice(error.message);
    else { onUploaded(path); setNotice('Digital file uploaded to private product storage.'); }
    setBusy(false);
  };

  const saveSettings = async () => {
    if (!cmsSupabase) return;
    setBusy(true);
    const { error } = await cmsSupabase.from('site_settings').upsert({ id: 1, ...settings, updated_at: new Date().toISOString() });
    setBusy(false); setNotice(error ? error.message : 'Homepage settings saved.');
  };

  if (!ready) return <div className="min-h-screen bg-[#0b0b0b] text-[#f5ebdd] grid place-items-center">Loading THE OTHER PERSON Studio…</div>;
  if (!configured) return <div className="min-h-screen bg-[#0b0b0b] text-[#f5ebdd] p-8 grid place-items-center"><div className="max-w-lg"><p className="text-[#d14f1f] text-xs tracking-[.2em] uppercase">THE OTHER PERSON Studio</p><h1 className="mt-3 text-4xl font-bold">Connection needed</h1><p className="mt-4 text-white/70">Add VITE_CMS_SUPABASE_URL and VITE_CMS_SUPABASE_PUBLISHABLE_KEY in the Render environment variables, then reload the site.</p></div></div>;
  if (recoveryMode || inviteSetupMode) return (
    <main className="min-h-screen bg-[#0b0b0b] text-[#f5ebdd] flex items-center justify-center px-5 py-12">
      <form onSubmit={saveNewPassword} className="w-full max-w-md border border-white/15 bg-[#151515] p-8 md:p-10">
        <p className="text-[#d14f1f] text-xs font-semibold uppercase tracking-[.22em]">THE OTHER PERSON Studio</p>
        <h1 className="mt-3 text-3xl font-black">{inviteSetupMode ? 'Create your admin password' : 'Set a new password'}</h1>
        {inviteSetupMode && <p className="mt-3 text-sm text-white/60">Welcome to THE OTHER PERSON Studio. Create a password to finish setting up your admin account.</p>}
        <label className="block mt-8 text-sm">New password<input required minLength={8} type="password" autoComplete="new-password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="mt-2 w-full bg-black border border-white/20 px-4 py-3 text-white outline-none focus:border-[#d14f1f]"/></label>
        {resetNotice && <p role="status" className="mt-4 text-sm text-[#ffb69f]">{resetNotice}</p>}
        <button disabled={busy} className="mt-7 w-full bg-[#d14f1f] px-5 py-4 text-sm font-bold uppercase tracking-widest text-white disabled:opacity-50">{busy ? 'Updating…' : 'Update password'}</button>
      </form>
    </main>
  );

  if (!admin) return (
    <main className="min-h-screen bg-[#0b0b0b] text-[#f5ebdd] flex items-center justify-center px-5 py-12">
      <form onSubmit={signIn} className="w-full max-w-md border border-white/15 bg-[#151515] p-8 md:p-10">
        <Link to="/" className="text-sm text-white/60 hover:text-white inline-flex items-center gap-2"><ArrowLeft size={16}/> Back to THE OTHER PERSON</Link>
        <p className="mt-10 text-[#d14f1f] text-xs font-semibold uppercase tracking-[.22em]">Private editorial workspace</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight">THE OTHER PERSON<br/><span className="text-[#d14f1f]">STUDIO.</span></h1>
        <p className="mt-4 text-white/60">Sign in with your authorised editorial account.</p>
        <label className="block mt-8 text-sm">Email<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full bg-black border border-white/20 px-4 py-3 text-white outline-none focus:border-[#d14f1f]"/></label>
        <label className="block mt-5 text-sm">Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full bg-black border border-white/20 px-4 py-3 text-white outline-none focus:border-[#d14f1f]"/></label>
        {loginError && <p role="alert" className="mt-4 text-sm text-[#ff9b89]">{loginError}</p>}
        {resetNotice && <p role="status" className="mt-4 text-sm text-[#ffb69f]">{resetNotice}</p>}
        <button disabled={busy} className="mt-7 w-full bg-[#d14f1f] px-5 py-4 text-sm font-bold uppercase tracking-widest text-white disabled:opacity-50">{busy ? 'Signing in…' : 'Enter Studio'}</button>
        <div className="mt-7 border-t border-white/10 pt-5">
          <p className="text-sm font-semibold">Forgot your password?</p>
          <p className="mt-1 text-xs leading-relaxed text-white/45">Enter your authorised admin email and we’ll request a secure reset link.</p>
          <label className="mt-4 block text-sm">Admin email for reset<input required type="email" autoComplete="email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full bg-black border border-white/20 px-4 py-3 text-white outline-none focus:border-[#d14f1f]"/></label>
          <button type="button" disabled={busy} onClick={()=>void requestPasswordReset()} className="mt-4 w-full border border-[#d14f1f] px-4 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50">{busy ? 'Sending reset request…' : 'Email me a reset link'}</button>
          {resetNotice && <p role="status" aria-live="polite" className="mt-4 text-sm leading-relaxed text-[#ffb69f]">{resetNotice}</p>}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-white/40">Access is restricted to accounts explicitly added by a THE OTHER PERSON administrator.</p>
      </form>
    </main>
  );

  const title = NAV.find(item => item.id === tab)?.label || 'Overview';
  const openEditor = (kind: 'article' | 'product' | 'category' | 'author', row: Row | null = null) => {
    const source: Row = row ? { ...row } : kind === 'article' ? { ...emptyArticle } : kind === 'product' ? { ...emptyProduct } : kind === 'author' ? { ...emptyAuthor } : { name: '', slug: '', description: '', is_active: true };
    if (kind === 'article' && row) source.body = row.body || '';
    if (kind === 'product' && row) { source.fabric = joinJson(row.fabric); source.fit = joinJson(row.fit); source.sizes = joinJson(row.sizes); source.gallery = (row.gallery || []).map((v: Row) => v.src).join('\n'); }
    setEditor({ kind, row: source });
  };
  const field = (label: string, key: string, value: any, change: (v: any) => void, opts: { multiline?: boolean; type?: string; placeholder?: string } = {}) => <label className="block text-sm text-white/70">{label}{opts.multiline ? <textarea rows={5} value={value ?? ''} onChange={e=>change(e.target.value)} placeholder={opts.placeholder} className="mt-2 w-full border border-white/15 bg-black/30 p-3 text-white outline-none focus:border-[#d14f1f]"/> : <input type={opts.type || 'text'} value={value ?? ''} onChange={e=>change(e.target.value)} placeholder={opts.placeholder} className="mt-2 w-full border border-white/15 bg-black/30 p-3 text-white outline-none focus:border-[#d14f1f]"/>}</label>;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#f5ebdd]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#101010]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-8">
          <div><p className="text-lg font-black tracking-tight">THE OTHER PERSON <span className="text-[#d14f1f]">▲</span> <span className="ml-2 text-xs font-medium tracking-[.2em] text-white/40">STUDIO</span></p><p className="mt-1 text-[10px] uppercase tracking-[.2em] text-white/35">Another Way of Seeing Things</p></div>
          <div className="flex items-center gap-4"><span className="hidden text-xs text-white/50 sm:block">{admin.name}</span><Link to="/" className="text-xs text-white/60 hover:text-white">View site</Link><button onClick={signOut} className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-[#d14f1f]"><LogOut size={15}/> Sign out</button></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1600px] md:grid-cols-[240px_1fr]">
        <aside className="border-b border-white/10 p-4 md:min-h-[calc(100vh-73px)] md:border-b-0 md:border-r md:p-5">
          <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[.2em] text-white/30">Workspace</p>
          <nav className="grid grid-cols-2 gap-1 md:grid-cols-1">{NAV.map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>{setTab(item.id);setEditor(null);setNotice('');}} className={`flex items-center gap-3 px-3 py-3 text-left text-sm transition ${tab===item.id?'bg-[#d14f1f] text-white':'text-white/60 hover:bg-white/5 hover:text-white'}`}><Icon size={16}/>{item.label}{item.id==='submissions'&&counts.pending>0&&<span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-[10px]">{counts.pending}</span>}</button>})}</nav>
          <div className="mt-8 border-t border-white/10 pt-5"><div className="flex items-center gap-2 text-xs text-emerald-300"><ShieldCheck size={15}/> Private admin access</div><p className="mt-2 text-[11px] leading-relaxed text-white/35">Only accounts listed in the THE OTHER PERSON admin database can enter this workspace.</p></div>
        </aside>
        <main className="min-w-0 p-5 md:p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.24em] text-[#d14f1f]">Editorial control room</p><h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">{title}</h1><p className="mt-2 text-sm text-white/45">Manage the publication, community and THE OTHER PERSON label.</p></div>
            {(['stories','products','categories','authors'] as Tab[]).includes(tab)&&<button onClick={()=>openEditor(tab==='stories'?'article':tab==='products'?'product':tab==='authors'?'author':'category')} className="inline-flex items-center gap-2 bg-[#d14f1f] px-4 py-3 text-xs font-bold uppercase tracking-widest"><Plus size={16}/> Add {tab==='stories'?'story':tab==='products'?'product':tab==='authors'?'author':'category'}</button>}
          </div>
          {notice&&<div className="mt-6 flex items-center justify-between border border-[#d14f1f]/40 bg-[#d14f1f]/10 px-4 py-3 text-sm text-[#ffd0c1]">{notice}<button onClick={()=>setNotice('')}><X size={15}/></button></div>}
          {editor&&<section className="mt-8 border border-white/15 bg-[#151515] p-5 md:p-7">
            <div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold">{editor.row?.id?'Edit':'New'} {editor.kind}</h2><button onClick={()=>setEditor(null)}><X/></button></div>
            {editor.kind==='article'&&<div className="grid gap-5 md:grid-cols-2">
              {field('Title','title',editor.row.title,v=>setEditor({...editor,row:{...editor.row,title:v,slug:editor.row.id?editor.row.slug:slugify(v)}}))}
              {field('Slug','slug',editor.row.slug,v=>setEditor({...editor,row:{...editor.row,slug:v}}))}
              {field('Short excerpt','excerpt',editor.row.excerpt,v=>setEditor({...editor,row:{...editor.row,excerpt:v}}),{multiline:true})}
              {field('Editorial dek','dek',editor.row.dek,v=>setEditor({...editor,row:{...editor.row,dek:v}}),{multiline:true})}
              {field('Cover image URL','cover_image_url',editor.row.cover_image_url,v=>setEditor({...editor,row:{...editor.row,cover_image_url:v}}))}<label className="block text-sm text-white/70">Or upload cover image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e=>{const file=e.target.files?.[0];if(file)void uploadImage(file,url=>setEditor(current=>current?{...current,row:{...current.row,cover_image_url:url}}:current));}} className="mt-2 block w-full text-xs text-white/60"/></label>
              {field('Image alt text','image_alt',editor.row.image_alt,v=>setEditor({...editor,row:{...editor.row,image_alt:v}}))}
              {field('Author name','author_name',editor.row.author_name,v=>setEditor({...editor,row:{...editor.row,author_name:v}}))}
              {field('Author role','author_role',editor.row.author_role,v=>setEditor({...editor,row:{...editor.row,author_role:v}}))}
              <label className="text-sm text-white/70">Section<select value={editor.row.section} onChange={e=>setEditor({...editor,row:{...editor.row,section:e.target.value}})} className="mt-2 w-full bg-black border border-white/15 p-3 text-white">{['stories','opinion','culture','fashion'].map(v=><option key={v}>{v}</option>)}</select></label>
              <label className="text-sm text-white/70">Content type<select value={editor.row.content_type} onChange={e=>setEditor({...editor,row:{...editor.row,content_type:e.target.value}})} className="mt-2 w-full bg-black border border-white/15 p-3 text-white">{['culture','fashion','opinion','football','world_affairs','community'].map(v=><option key={v}>{v}</option>)}</select></label>
              <label className="text-sm text-white/70">Category<select value={editor.row.category_id||''} onChange={e=>setEditor({...editor,row:{...editor.row,category_id:e.target.value}})} className="mt-2 w-full bg-black border border-white/15 p-3 text-white"><option value="">No category</option>{data.categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
              {field('Reading time (minutes)','reading_time',editor.row.reading_time,v=>setEditor({...editor,row:{...editor.row,reading_time:v}}),{type:'number'})}
              {field('Article body (separate paragraphs with blank lines)','body',editor.row.body,v=>setEditor({...editor,row:{...editor.row,body:v}}),{multiline:true})}
              <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={editor.row.featured} onChange={e=>setEditor({...editor,row:{...editor.row,featured:e.target.checked}})}/> Feature on homepage</label>
              <label className="text-sm text-white/70">Status<select value={editor.row.status} onChange={e=>setEditor({...editor,row:{...editor.row,status:e.target.value}})} className="mt-2 w-full bg-black border border-white/15 p-3 text-white"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
            </div>}
            {editor.kind==='product'&&<div className="grid gap-5 md:grid-cols-2">
              {field('Product name','name',editor.row.name,v=>setEditor({...editor,row:{...editor.row,name:v,slug:editor.row.id?editor.row.slug:slugify(v)}}))}
              {field('Slug','slug',editor.row.slug,v=>setEditor({...editor,row:{...editor.row,slug:v}}))}
              {field('Price (INR)','price',editor.row.price,v=>setEditor({...editor,row:{...editor.row,price:v}}),{type:'number'})}
              {field('Category / collection','category',editor.row.category,v=>setEditor({...editor,row:{...editor.row,category:v}}),{placeholder:'Tees, Totes, Posters, Calendars…'})}
              {field('Tagline','tagline',editor.row.tagline,v=>setEditor({...editor,row:{...editor.row,tagline:v}}))}
              {field('Main image URL','image_url',editor.row.image_url,v=>setEditor({...editor,row:{...editor.row,image_url:v}}))}<label className="block text-sm text-white/70">Or upload product image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e=>{const file=e.target.files?.[0];if(file)void uploadImage(file,url=>setEditor(current=>current?{...current,row:{...current.row,image_url:url,gallery:url}}:current));}} className="mt-2 block w-full text-xs text-white/60"/></label>
              {field('External product / checkout URL','external_url',editor.row.external_url,v=>setEditor({...editor,row:{...editor.row,external_url:v}}))}
              {field('Description','description',editor.row.description,v=>setEditor({...editor,row:{...editor.row,description:v}}),{multiline:true})}
              {field('Fabric details (one per line)','fabric',editor.row.fabric,v=>setEditor({...editor,row:{...editor.row,fabric:v}}),{multiline:true})}
              {field('Fit details (one per line)','fit',editor.row.fit,v=>setEditor({...editor,row:{...editor.row,fit:v}}),{multiline:true})}
              {field('Sizes (comma separated)','sizes',editor.row.sizes,v=>setEditor({...editor,row:{...editor.row,sizes:v}}))}
              {field('Additional image URLs (one per line)','gallery',editor.row.gallery,v=>setEditor({...editor,row:{...editor.row,gallery:v}}),{multiline:true})}
              <label className="text-sm text-white/70">Product type<select value={editor.row.product_type} onChange={e=>setEditor({...editor,row:{...editor.row,product_type:e.target.value}})} className="mt-2 w-full bg-black border border-white/15 p-3 text-white">{['apparel','accessory','poster','calendar','stationery','digital','other'].map(v=><option key={v}>{v}</option>)}</select></label>
              <label className="text-sm text-white/70">Product kind<select value={editor.row.product_kind||'physical'} onChange={e=>setEditor({...editor,row:{...editor.row,product_kind:e.target.value}})} className="mt-2 w-full bg-black border border-white/15 p-3 text-white"><option value="physical">Physical</option><option value="digital">Digital download</option></select></label>
              <label className="text-sm text-white/70">Inventory / fulfilment<select value={editor.row.inventory_mode||'made_to_order'} onChange={e=>setEditor({...editor,row:{...editor.row,inventory_mode:e.target.value}})} className="mt-2 w-full bg-black border border-white/15 p-3 text-white"><option value="made_to_order">Made to order</option><option value="track_stock">Track stock</option><option value="unlimited">Unlimited</option></select></label>
              {field('Compare-at price (INR)','compare_at_price',editor.row.compare_at_price,v=>setEditor({...editor,row:{...editor.row,compare_at_price:v}}),{type:'number'})}
              {editor.row.product_kind==='digital'&&<label className="block text-sm text-white/70">Digital delivery file (PDF)<input type="file" accept="application/pdf" onChange={e=>{const file=e.target.files?.[0];if(file)void uploadDigitalFile(file,path=>setEditor(current=>current?{...current,row:{...current.row,digital_file_path:path}}:current));}} className="mt-2 block w-full text-xs text-white/60"/></label>}
              {editor.row.digital_file_path&&<p className="text-xs text-white/45">Private file saved: {editor.row.digital_file_path}</p>}
              {field('Printify shop ID','printify_shop_id',editor.row.printify_shop_id,v=>setEditor({...editor,row:{...editor.row,printify_shop_id:v}}))}
              {field('Printify product ID','printify_product_id',editor.row.printify_product_id,v=>setEditor({...editor,row:{...editor.row,printify_product_id:v}}))}
              {field('Printify variant ID','printify_variant_id',editor.row.printify_variant_id,v=>setEditor({...editor,row:{...editor.row,printify_variant_id:v}}))}
              {field('Printify blueprint ID','printify_blueprint_id',editor.row.printify_blueprint_id,v=>setEditor({...editor,row:{...editor.row,printify_blueprint_id:v}}))}
              {field('Printify provider ID','printify_provider_id',editor.row.printify_provider_id,v=>setEditor({...editor,row:{...editor.row,printify_provider_id:v}}))}
              <label className="text-sm text-white/70">Status<select value={editor.row.status} onChange={e=>setEditor({...editor,row:{...editor.row,status:e.target.value}})} className="mt-2 w-full bg-black border border-white/15 p-3 text-white"><option value="draft">Draft</option><option value="active">Active</option><option value="archived">Archived</option></select></label>
            </div>}
            {editor.kind==='category'&&<div className="grid gap-5 md:grid-cols-2">{field('Name','name',editor.row.name,v=>setEditor({...editor,row:{...editor.row,name:v,slug:editor.row.id?editor.row.slug:slugify(v)}}))}{field('Slug','slug',editor.row.slug,v=>setEditor({...editor,row:{...editor.row,slug:v}}))}{field('Description','description',editor.row.description,v=>setEditor({...editor,row:{...editor.row,description:v}}))}<label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={editor.row.is_active} onChange={e=>setEditor({...editor,row:{...editor.row,is_active:e.target.checked}})}/> Active</label></div>}
            {editor.kind==='author'&&<div className="grid gap-5 md:grid-cols-2">{field('Name','name',editor.row.name,v=>setEditor({...editor,row:{...editor.row,name:v,slug:editor.row.id?editor.row.slug:slugify(v)}}))}{field('Slug','slug',editor.row.slug,v=>setEditor({...editor,row:{...editor.row,slug:v}}))}{field('Role','role',editor.row.role,v=>setEditor({...editor,row:{...editor.row,role:v}}))}{field('Avatar URL','avatar_url',editor.row.avatar_url,v=>setEditor({...editor,row:{...editor.row,avatar_url:v}}))}{field('Website / social URL','website_url',editor.row.website_url,v=>setEditor({...editor,row:{...editor.row,website_url:v}}))}{field('Bio','bio',editor.row.bio,v=>setEditor({...editor,row:{...editor.row,bio:v}}),{multiline:true})}<label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={editor.row.is_active} onChange={e=>setEditor({...editor,row:{...editor.row,is_active:e.target.checked}})}/> Active author</label></div>}
            <div className="mt-7 flex justify-end gap-3"><button onClick={()=>setEditor(null)} className="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest">Cancel</button><button disabled={busy} onClick={()=>void saveRow(editor.kind,editor.row)} className="inline-flex items-center gap-2 bg-[#d14f1f] px-5 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50"><Save size={15}/> Save</button></div>
          </section>}
          {tab==='overview'&&<><div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{label:'Stories',value:counts.stories,sub:`${counts.published} published`,icon:BookOpen},{label:'Pending submissions',value:counts.pending,sub:'Awaiting editorial review',icon:FileText},{label:'Products',value:counts.products,sub:'In your catalogue',icon:Box},{label:'Newsletter readers',value:counts.subscribers,sub:'Email subscribers',icon:Mail}].map(card=>{const Icon=card.icon;return <div key={card.label} className="border border-white/10 bg-[#151515] p-6"><Icon className="text-[#d14f1f]" size={20}/><p className="mt-5 text-3xl font-bold">{card.value}</p><p className="mt-1 text-sm">{card.label}</p><p className="mt-2 text-xs text-white/35">{card.sub}</p></div>})}</div><div className="mt-8 grid gap-5 lg:grid-cols-2"><div className="border border-white/10 bg-[#151515] p-6"><h2 className="font-bold">Editorial queue</h2>{data.contributions.slice(0,5).map(row=><div key={row.id} className="mt-4 flex items-center justify-between border-t border-white/10 pt-3"><div><p className="text-sm">{row.proposed_title}</p><p className="mt-1 text-xs text-white/40">{row.contributor_name} · {prettyDate(row.created_at)}</p></div><span className="text-xs text-[#d14f1f]">{row.status}</span></div>)}{!data.contributions.length&&<p className="mt-4 text-sm text-white/40">No submissions yet.</p>}</div><div className="border border-white/10 bg-[#151515] p-6"><h2 className="font-bold">Recently updated stories</h2>{data.articles.slice(0,5).map(row=><div key={row.id} className="mt-4 flex items-center justify-between border-t border-white/10 pt-3"><div><p className="text-sm">{row.title}</p><p className="mt-1 text-xs text-white/40">{row.status} · {prettyDate(row.updated_at||row.created_at)}</p></div><ChevronRight size={16} className="text-white/30"/></div>)}{!data.articles.length&&<p className="mt-4 text-sm text-white/40">Your first story can be created in Stories.</p>}</div></div></>}
          {tab==='stories'&&<div className="mt-8 space-y-3">{data.articles.map(row=><div key={row.id} className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-[#151515] p-5"><div className="min-w-0"><p className="font-semibold">{row.title}</p><p className="mt-1 text-xs text-white/40">{row.section} · {row.status} · {row.featured?'Featured · ':''}{prettyDate(row.updated_at||row.created_at)}</p></div><div className="flex gap-2"><button onClick={()=>openEditor('article',row)} className="border border-white/20 px-4 py-2 text-xs">Edit</button><button onClick={()=>void removeRow('article',row)} className="border border-red-400/30 px-4 py-2 text-xs text-red-300">Delete</button></div></div>)}{!data.articles.length&&<p className="border border-white/10 p-8 text-sm text-white/40">No stories yet. Create your first story.</p>}</div>}
          {tab==='submissions'&&<div className="mt-8 space-y-4">{data.contributions.map(row=><article key={row.id} className="border border-white/10 bg-[#151515] p-5 md:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-lg font-semibold">{row.proposed_title}</p><p className="mt-1 text-xs text-white/45">{row.contributor_name} · {row.contributor_email} · {row.category||'Uncategorised'} · {prettyDate(row.created_at)}</p></div><span className="bg-white/10 px-3 py-1 text-xs uppercase tracking-wider">{row.status}</span></div><p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/70">{row.content}</p>{row.author_bio&&<p className="mt-3 text-xs text-white/40">Bio: {row.author_bio}</p>}{row.reference_link&&<a className="mt-3 inline-block text-xs text-[#f18b63] underline" href={row.reference_link} target="_blank" rel="noreferrer">Reference / images</a>}<div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]"><textarea defaultValue={row.admin_notes||''} id={`note-${row.id}`} placeholder="Internal editorial notes…" rows={2} className="w-full bg-black/40 border border-white/15 p-3 text-sm"/><div className="flex flex-wrap gap-2"><button onClick={()=>void updateSubmission(row,{status:'in_review',admin_notes:(document.getElementById(`note-${row.id}`) as HTMLTextAreaElement)?.value||''})} className="border border-white/20 px-3 py-2 text-xs">In review</button><button onClick={()=>void createDraftFromSubmission(row)} className="bg-[#d14f1f] px-3 py-2 text-xs font-bold">Create draft</button><button onClick={()=>void updateSubmission(row,{status:'rejected',admin_notes:(document.getElementById(`note-${row.id}`) as HTMLTextAreaElement)?.value||''})} className="border border-red-400/30 px-3 py-2 text-xs text-red-300">Reject</button></div></div></article>)}{!data.contributions.length&&<p className="border border-white/10 p-8 text-sm text-white/40">No reader submissions yet.</p>}</div>}
          {tab==='products'&&<>
            <section className="mt-8 border border-white/10 bg-[#151515] p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div><h2 className="font-bold">Printify connection</h2><p className="mt-1 text-xs text-white/45">Connect your Printify API shop to prepare product and order syncing.</p></div>
                <button onClick={()=>void connectPrintify()} disabled={printifyBusy} className="bg-[#d14f1f] px-4 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50">{printifyBusy?'Connecting…':'Connect Printify'}</button>
              </div>
              {printifyShops.length>0&&<div className="mt-5 flex flex-wrap items-end gap-3">
                <label className="min-w-[220px] flex-1 text-xs text-white/60">Printify shop<select value={printifyShopId} onChange={e=>setPrintifyShopId(e.target.value)} className="mt-2 w-full border border-white/15 bg-black p-3 text-white">{printifyShops.map(shop=><option key={shop.id} value={shop.id}>{shop.title||shop.name||`Shop ${shop.id}`} · {shop.id}</option>)}</select></label>
                <button onClick={()=>void syncPrintifyProducts()} disabled={printifyBusy} className="border border-white/20 px-4 py-3 text-xs uppercase tracking-widest disabled:opacity-50">Check products</button>
              </div>}
              {printifyStatus&&<p role="status" className="mt-4 text-sm text-[#f2a17f]">{printifyStatus}</p>}
            </section>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">{data.products.map(row=><div key={row.id} className="flex gap-4 border border-white/10 bg-[#151515] p-4"><div className="h-28 w-24 shrink-0 bg-black">{row.image_url&&<img src={row.image_url} alt="" className="h-full w-full object-cover"/>}</div><div className="min-w-0 flex-1"><p className="font-semibold">{row.name}</p><p className="mt-1 text-sm text-white/50">₹{row.price??'—'} · {row.status}</p><p className="mt-1 text-xs text-white/35">{row.category||row.product_type}</p><div className="mt-4 flex gap-2"><button onClick={()=>openEditor('product',row)} className="border border-white/20 px-3 py-2 text-xs">Edit</button><button onClick={()=>void removeRow('product',row)} className="border border-red-400/30 px-3 py-2 text-xs text-red-300">Delete</button></div></div></div>)}{!data.products.length&&<p className="border border-white/10 p-8 text-sm text-white/40">No products yet.</p>}</div>
          </>}
          {tab==='orders'&&<div className="mt-8 space-y-4">
            {data.store_orders.map(row=><article key={row.id} className="border border-white/10 bg-[#151515] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="font-semibold">{row.order_number||'Order'} · {row.product_name}</p><p className="mt-1 text-xs text-white/45">{row.customer_name} · {row.customer_email} · Qty {row.quantity} · ₹{row.amount}</p><p className="mt-1 text-xs text-white/35">{prettyDate(row.created_at)} · {row.payment_method}</p></div>
                <span className="text-xs uppercase tracking-wider text-[#f2a17f]">{row.payment_status} / {row.fulfilment_status}</span>
              </div>
              {row.shipping_address&&<p className="mt-3 text-xs text-white/50">{[row.shipping_address.address1,row.shipping_address.address2,row.shipping_address.city,row.shipping_address.region,row.shipping_address.zip,row.shipping_address.country].filter(Boolean).join(', ')}</p>}
              {row.payment_reference&&<p className="mt-2 text-xs text-white/50">Payment reference: {row.payment_reference}</p>}
              {row.tracking_url&&<a className="mt-2 inline-block text-xs text-[#f18b63] underline" href={row.tracking_url} target="_blank" rel="noreferrer">Tracking link</a>}
              <div className="mt-4 flex flex-wrap gap-2">
                {row.payment_method==='upi'&&row.payment_status==='pending'&&<button onClick={()=>{const reference=window.prompt('Enter the UPI transaction ID / UTR after checking your bank or UPI app:');if(reference&&reference.trim())void updateOrder(row,{payment_status:'verified',payment_reference:reference.trim(),fulfilment_status:'ready_to_deliver'});}} className="border border-white/20 px-3 py-2 text-xs">Verify UPI payment</button>}
                <button onClick={()=>void updateOrder(row,{payment_status:'rejected',fulfilment_status:'cancelled'})} className="border border-red-400/30 px-3 py-2 text-xs text-red-300">Reject / cancel</button>
                {row.payment_status==='verified'&&!row.printify_order_id&&data.products.find(product=>product.id===row.product_id)?.product_kind!=='digital'&&<button disabled={printifyBusy} onClick={()=>void createPrintifyOrder(row)} className="bg-[#d14f1f] px-3 py-2 text-xs font-bold disabled:opacity-50">Create Printify order</button>}{row.payment_status==='verified'&&row.printify_order_id&&<button disabled={printifyBusy} onClick={()=>void sendPrintifyToProduction(row)} className="border border-[#d14f1f] px-3 py-2 text-xs text-[#f18b63] disabled:opacity-50">Send to production</button>}<button onClick={()=>void updateOrder(row,{fulfilment_status:'delivered'})} className="border border-white/20 px-3 py-2 text-xs">Mark delivered</button>
              </div>
            </article>)}
            {!data.store_orders.length&&<p className="border border-white/10 p-8 text-sm text-white/40">No customer orders yet. New website orders will appear here.</p>}
          </div>}
          {tab==='categories'&&<div className="mt-8 space-y-3">{data.categories.map(row=><div key={row.id} className="flex items-center justify-between border border-white/10 bg-[#151515] p-4"><div><p className="font-semibold">{row.name}</p><p className="text-xs text-white/40">{row.slug} · {row.is_active?'Active':'Inactive'}</p></div><div className="flex gap-2"><button onClick={()=>openEditor('category',row)} className="border border-white/20 px-4 py-2 text-xs">Edit</button><button onClick={()=>void removeRow('category',row)} className="border border-red-400/30 px-4 py-2 text-xs text-red-300">Delete</button></div></div>)}</div>}
          {tab==='authors'&&<div className="mt-8 grid gap-3 md:grid-cols-2">{data.authors.map(row=><div key={row.id} className="flex items-center gap-4 border border-white/10 bg-[#151515] p-4">{row.avatar_url?<img src={row.avatar_url} alt="" className="h-14 w-14 rounded-full object-cover"/>:<div className="grid h-14 w-14 place-items-center rounded-full bg-white/10">{row.name?.slice(0,1)}</div>}<div className="min-w-0 flex-1"><p className="font-semibold">{row.name}</p><p className="text-xs text-white/40">{row.role}</p></div><button onClick={()=>openEditor('author',row)} className="border border-white/20 px-3 py-2 text-xs">Edit</button></div>)}</div>}
          {tab==='homepage'&&<div className="mt-8 max-w-3xl border border-white/10 bg-[#151515] p-6"><p className="mb-6 text-sm text-white/45">Control the editorial hero and choose the story highlighted on the homepage.</p><div className="space-y-5">{field('Hero eyebrow','hero_eyebrow',settings.hero_eyebrow,v=>setSettings({...settings,hero_eyebrow:v}))}{field('Hero title','hero_title',settings.hero_title,v=>setSettings({...settings,hero_title:v}))}{field('Hero description','hero_description',settings.hero_description,v=>setSettings({...settings,hero_description:v}),{multiline:true})}<label className="block text-sm text-white/70">Featured story<select value={settings.featured_article_id||''} onChange={e=>setSettings({...settings,featured_article_id:e.target.value||null})} className="mt-2 w-full border border-white/15 bg-black p-3 text-white"><option value="">Use default featured story</option>{data.articles.filter(a=>a.status==='published').map(a=><option key={a.id} value={a.id}>{a.title}</option>)}</select></label><button onClick={()=>void saveSettings()} disabled={busy} className="inline-flex items-center gap-2 bg-[#d14f1f] px-5 py-3 text-xs font-bold uppercase tracking-widest"><Save size={15}/> Save homepage</button></div></div>}
          {tab==='newsletter'&&<div className="mt-8 overflow-x-auto border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/5 text-xs uppercase tracking-wider text-white/40"><tr><th className="p-4">Email</th><th className="p-4">Subscribed</th></tr></thead><tbody>{data.newsletter_subscribers.map(row=><tr key={row.id} className="border-t border-white/10"><td className="p-4">{row.email}</td><td className="p-4 text-white/45">{prettyDate(row.created_at)}</td></tr>)}</tbody></table>{!data.newsletter_subscribers.length&&<p className="p-6 text-sm text-white/40">No subscribers found in this CMS database yet.</p>}</div>}
          <footer className="mt-14 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] uppercase tracking-[.18em] text-white/25"><span>THE OTHER PERSON · Private editorial workspace</span><span>Another Way of Seeing Things</span></footer>
        </main>
      </div>
    </div>
  );
}
