import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis, jump, reduce, SplitText, Magnet, SpotlightCard } from './fx.jsx'
gsap.registerPlugin(ScrollTrigger)

const P = import.meta.env.BASE_URL + 'photos/'
const PHONE = '09228701977', FB = 'fabbkrboy'
// EDIT ME: price '' hides the price until the owner confirms it (e.g. '₱85 / piece')
const MENU = [
  { name: 'Double Dark Marshmallow', desc: 'Rich double chocolate cookie topped with marshmallow.', img: 'mallow.jpg', tag: 'chocolate', price: '' },
  { name: 'Biscoff Cookies', desc: 'Soft cookies with that Biscoff caramel flavor.', img: 'biscoff.jpg', tag: 'biscoff', price: '' },
  { name: 'Black Forest Cookies', desc: 'Chocolate cookies with a cherry-chocolate twist.', img: 'blackforest.jpg', tag: 'chocolate', price: '' },
  { name: 'Matcha Cookies', desc: 'Green tea cookies with white chocolate.', img: 'matcha.jpg', tag: 'matcha', price: '' },
  { name: 'Chocolate Crinkles', desc: 'Packed and ready for gifting.', img: 'crinkles.jpg', tag: 'chocolate', price: '' },
  { name: 'Mixed Cookie Box', desc: 'Red velvet, matcha, chocolate chip and more in one box. Ask what’s available.', img: 'cookiebox.jpg', tag: 'boxes', price: '' },
]
const CHIPS = [['all', 'All'], ['chocolate', 'Chocolate'], ['matcha', 'Matcha'], ['biscoff', 'Biscoff'], ['boxes', 'Gift boxes']]
const GALLERY = ['g1.jpg', 'g2.jpg', 'g3.jpg', 'g4.jpg', 'giftbox.jpg']
// Edit quotes here. Get each customer’s OK before publishing their name.
const REVIEWS = [
  { name: 'Jane C.', text: 'Super sarap ng crinkles. Mas sumarap lalo sya.' },
  { name: 'Facebook customer', text: 'Sa true lang sa crinkles ni Fab Baker! As in naubos ko yun ng isang upuan lang. Hahahaha.' },
  { name: 'Facebook customer', text: 'Nagustuhan ng bisita namin! Take out namin ito papuntang Pampanga, di pa nakakain si Mau ng crinkles hehe.' },
]
const Img = ({ s, alt = '', lazy }) => <img src={P + s} alt={alt} loading={lazy ? 'lazy' : undefined} onError={(e) => e.currentTarget.remove()} />

export default function App() {
  useLenis()
  const root = useRef()
  const [qty, setQty] = useState(MENU.map(() => 0))
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [ri, setRi] = useState(0)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({ name: '', mode: 'Pickup', when: '', note: '' })
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('top')
  const total = qty.reduce((a, b) => a + b, 0)
  const say = (t) => { setToast(t); clearTimeout(window._t); window._t = setTimeout(() => setToast(''), 1900) }
  const add = (i) => { setQty((a) => a.map((n, k) => (k === i ? n + 1 : n))); say('Added ' + MENU[i].name + ' 🍪') }
  const shown = useMemo(() => MENU.map((m, i) => ({ ...m, i })).filter((m) => (cat === 'all' || m.tag === cat) && m.name.toLowerCase().includes(q.trim().toLowerCase())), [cat, q])
  const message = useMemo(() => {
    const lines = qty.map((n, i) => (n > 0 ? `• ${n} × ${MENU[i].name}` : '')).filter(Boolean)
    return ['Hi Fabulous Bakery (Fab Bkr Boy)! I’d like to order:', lines.length ? lines.join('\n') : '• (please add items)', '',
      'Name: ' + (form.name || '—'), form.mode + (form.when ? ' · ' + form.when : ''), form.note ? 'Notes: ' + form.note : ''].filter((x, i, a) => x !== '' || a[i - 1] !== '').join('\n').trim()
  }, [qty, form])
  const sendSms = (e) => { if (!total) { e.preventDefault(); say('Add at least one item first') } }
  const sendMsgr = async () => {
    if (!total) return say('Add at least one item first')
    try { await navigator.clipboard.writeText(message) } catch {}
    say('Order copied. Paste it in Messenger!'); window.open('https://m.me/' + FB, '_blank')
  }
  useEffect(() => { const t = setInterval(() => setRi((n) => (n + 1) % REVIEWS.length), 7000); return () => clearInterval(t) }, [ri])

  // Motion: intro, pinned hero (desktop), parallax, reveals
  useEffect(() => {
    if (reduce()) return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.giant span', { yPercent: 40, opacity: 0, stagger: 0.12, duration: 1 })
        .from('.stack', { scale: 0.7, opacity: 0, rotate: -12, duration: 1.1 }, 0.1)
        .from('.badge', { scale: 0, rotate: -40, duration: 0.8, ease: 'back.out(2)' }, 0.7)
        .from('.b-hero h1,.hero-foot > *', { y: 24, opacity: 0, stagger: 0.1, duration: 0.7 }, 0.5)
        .from('.b-owner,.b-fresh', { y: 50, opacity: 0, stagger: 0.12, duration: 0.8 }, 0.3)
      gsap.to('.stack', { y: -22, repeat: -1, yoyo: true, duration: 3, ease: 'sine.inOut' })
      const mm = gsap.matchMedia()
      mm.add('(min-width: 901px)', () => {
        gsap.timeline({ scrollTrigger: { trigger: '.bento', start: 'top 130px', end: 'bottom top', scrub: 0.6 } })
          .to('.stack', { scale: 1.15, rotate: 6, ease: 'none' }, 0)
          .to('.giant', { yPercent: -14, ease: 'none' }, 0)
                })
      ScrollTrigger.batch('.pc,.step,.item,.gal div,.pick', { start: 'top 90%', once: true,
        onEnter: (b) => gsap.fromTo(b, { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power2.out' }) })
      gsap.utils.toArray('.pc .ph img').forEach((i) => gsap.fromTo(i, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: i.parentNode, scrub: true } }))
      gsap.fromTo('.collage .main img', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top 85%', end: 'top 20%', scrub: true } })
      gsap.from('.note', { rotate: -6, y: 60, opacity: 0, duration: 0.9, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.tm', start: 'top 75%', once: true } })
      ScrollTrigger.refresh()
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -45% 0px' })
    ;['top', 'menu', 'order'].forEach((id) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [])

  const L = ({ id, children, ...p }) => <a href={'#' + id} onClick={(e) => { jump(e, id); setMenuOpen(false) }} {...p}>{children}</a>
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const review = REVIEWS[ri]

  return (
    <div ref={root}>
      <a className="skip" href="#menu">Skip to menu</a>
      <div className="mock" role="note"><strong>CONCEPT MOCKUP</strong><span className="mt-l">Unofficial design concept. Not the official website of Fabulous Bakery / Fab Baker Boy.</span><span className="mt-s">Unofficial design concept. Not the official website.</span></div>
      <header>
        <nav className="nav" aria-label="Main">
          <L id="top" className="brand"><Img s="logo.jpg" alt="Fab Bkr Boy logo" /><span><b>Fabulous Bakery</b><small>Home of Fab Baker Boy</small></span></L>
          <div className={'links' + (menuOpen ? ' open' : '')} id="links">
            <L id="menu">Menu</L><L id="story">Our Story</L><L id="gallery">Gallery</L><L id="reviews">Reviews</L><L id="order">Order</L>
          </div>
          <Magnet className="order-wrap"><L id="order" className="pill order-link">ORDER NOW</L></Magnet>
          <button className="pill menu-btn" aria-expanded={menuOpen} aria-controls="links" onClick={() => setMenuOpen(!menuOpen)}>MENU</button>
        </nav>
      </header>

      <main id="top">
        <div className="bento">
          <section className="card b-hero" aria-label="Welcome" style={{ padding: 34 }}>
            <h1>Every cookie tells a story.</h1>
            <div className="giant" aria-hidden="true"><span>COOKIES</span><span>&amp; CRINKLES</span></div>
            <img className="stack" src={P + 'stack.jpg'} alt="" />
            <img className="badge" src={P + 'badge.png'} alt="" aria-hidden="true" />
            <div className="hero-foot">
              <p>Homemade. Heartmade. Cookies and crinkles from our sweet corner in Tagaytay.</p>
              <div className="stat"><b>4.7K</b><small>Facebook followers</small></div>
              <Magnet><L id="menu" className="btn">Explore our menu</L></Magnet>
            </div>
          </section>
          <section className="card b-owner" aria-label="Meet the baker">
            <h2>Meet Daddy O</h2>
            <div className="ph"><Img s="story.jpg" alt="Daddy O, the baker behind Fab Bkr Boy" /></div>
            <p>Baked fresh daily with his magic touch.</p>
            <Magnet><L id="story" className="btn dark">Our story</L></Magnet>
          </section>
          <section className="card b-fresh" aria-label="Fresh from the oven">
            <Img s="crumb.jpg" lazy /><div><h2>Fresh from the oven</h2><p>Soft, gooey and made with love.</p></div>
          </section>
        </div>

        <div className="wrap" style={{ marginTop: 16 }}>
          <section className="card b-picks" aria-labelledby="picksH">
            <h2 id="picksH">Top{' '}<br />picks</h2>
            <span className="swipe" aria-hidden="true">Swipe →</span>
            <ul className="picks">
              {MENU.slice(0, 4).map((m, i) => (
                <li className="pick" key={m.name}><Img s={m.img} /><div><b>{m.name}</b></div><span>{m.desc}</span>
                  <button className="mini add" type="button" style={{ width: 'auto', margin: 0 }} aria-label={'Add ' + m.name} onClick={() => add(i)}>+ Add<img className="plus" src={P + 'plus.png'} alt="" aria-hidden="true" /></button></li>
              ))}
            </ul>
          </section>
        </div>

        <section id="menu"><div className="wrap">
          <p className="eyebrow">The menu</p>
          <SplitText tag="h2" className="sec-h" text="Browse what’s baking" />
          <p className="lead">Tap “Add to order” on anything you like. Prices and availability are confirmed by the bakery when you send your order.</p>
          <div className="tools">
            <label className="sr" htmlFor="search">Search the menu</label>
            <input id="search" type="search" placeholder="Search cookies…" value={q} onChange={(e) => setQ(e.target.value)} />
            <div className="chips" role="group" aria-label="Filter by flavor">
              {CHIPS.map(([k, label]) => <button key={k} type="button" className="chip" aria-pressed={cat === k} onClick={() => setCat(k)}>{label}</button>)}
            </div>
          </div>
          <div className="grid">
            {shown.map((m) => (
              <SpotlightCard className="pc" key={m.name}>
                <div className="ph"><Img s={m.img} alt={m.name} lazy /></div>
                <div className="body"><h3>{m.name}</h3><p>{m.desc}</p><div className="price">{m.price || <><span className="pl">Ask for today’s price</span><span className="ps">Ask price</span></>}</div>
                  <button className="add" type="button" onClick={() => add(m.i)}>+ Add to order</button></div>
              </SpotlightCard>
            ))}
          </div>
          {!shown.length && <p id="none">No match yet. Message us on Messenger and we’ll help you find something sweet.</p>}
        </div></section>

        <section className="story" id="story"><div className="wrap two">
          <div className="copy">
            <p className="eyebrow">Our story</p>
            <SplitText tag="h2" className="sec-h" text="Homemade with heart" />
            <p>Welcome to the Fabulous Bakery, home of Fab Baker Boy. A sweet corner in Tagaytay where every cookie and crinkle tells a story of love, warmth and a sprinkle of fun.</p>
            <ul className="vals">
              <li><span aria-hidden="true">🍪</span><div><b>Baked fresh daily</b><small>Made with Daddy O’s magic touch.</small></div></li>
              <li><span aria-hidden="true">♥</span><div><b>Homemade. Heartmade.</b><small>Love, warmth and a sprinkle of fun in every batch.</small></div></li>
              <li><span aria-hidden="true">📍</span><div><b>A sweet corner in Tagaytay</b><small>Order by Messenger or call 0922-8701977.</small></div></li>
            </ul>
            <Magnet><L id="order" className="btn">Order a box</L></Magnet>
          </div>
          <div className="collage">
            <div className="main"><Img s="hero.jpg" alt="Inside the Fab Bkr Boy shop in Tagaytay" lazy /><span className="cap">Our little shop in Tagaytay</span></div>
            <div className="mini-ph"><Img s="story.jpg" alt="Daddy O, the baker" lazy /></div>
            <img className="fl fbbadge" src={P + 'fb-badge.png'} alt="4.7K Facebook followers" />
          </div>
        </div></section>

        <section id="gallery"><div className="wrap"><div className="panel">
          <p className="eyebrow">Fresh from our kitchen</p>
          <SplitText tag="h2" className="sec-h" text="Gallery" />
          <p className="lead">More on <a href="https://www.facebook.com/fabbkrboy/photos" target="_blank" rel="noopener">our Facebook photos</a>.</p>
          <div className="gal">{GALLERY.map((g) => <div key={g}><Img s={g} alt="Fabulous Bakery treats" lazy /></div>)}</div>
        </div></div></section>

        <section id="reviews" style={{ paddingTop: 20 }}><div className="wrap"><div className="tm">
          <Img s="crinkles.jpg" lazy />
          <div className="left"><p className="eyebrow" style={{ color: 'var(--peach)' }}>Testimonials</p><h2>A shared love for cookies</h2><p>Hear from customers who’ve tried our crinkles and cookies.</p>
            <div className="arrows"><button aria-label="Previous review" onClick={() => setRi((ri + REVIEWS.length - 1) % REVIEWS.length)}>←</button><button aria-label="Next review" onClick={() => setRi((ri + 1) % REVIEWS.length)}>→</button></div></div>
          <figure className="note" aria-live="polite"><small>From:</small><cite>{review.name}</cite><q>{review.text}</q><em>Facebook customer message</em></figure>
        </div></div></section>

        <section className="order" id="order"><div className="wrap">
          <p className="eyebrow">How to order</p>
          <SplitText tag="h2" className="sec-h" text="Order in three easy steps" />
          <div className="steps">
            {[['Pick your treats', 'Add items from the menu or choose quantities below.'], ['Add your details', 'Name, pickup or delivery, date and notes.'], ['Send it', 'Text or message us your ready-made order.']].map(([t, d], i) => (
              <div className="step" key={t}><b>{i + 1}</b><h3>{t}</h3><p>{d}</p></div>))}
          </div>
          <div className="form">
            <div>
              <div className="items">{MENU.map((m, i) => (
                <div className="item" key={m.name}><Img s={m.img} /><label htmlFor={'q' + i}>{m.name}</label>
                  <input id={'q' + i} type="number" min="0" value={qty[i]} onChange={(e) => setQty(qty.map((n, k) => (k === i ? Math.max(0, +e.target.value || 0) : n)))} /></div>))}</div>
              <div className="fields">
                <div className="fg"><label className="fld" htmlFor="name">Your name</label><input id="name" autoComplete="name" placeholder="Juan Dela Cruz" value={form.name} onChange={set('name')} /></div>
                <div className="fg"><label className="fld" htmlFor="mode">Pickup or delivery</label><select id="mode" value={form.mode} onChange={set('mode')}><option>Pickup</option><option>Delivery</option></select></div>
                <div className="fg"><label className="fld" htmlFor="when">Preferred date / time</label><input id="when" placeholder="e.g. Saturday afternoon" value={form.when} onChange={set('when')} /></div>
                <div className="fg"><label className="fld" htmlFor="note">Notes</label><textarea id="note" rows="2" placeholder="Gift box, allergies, delivery address…" value={form.note} onChange={set('note')} /></div>
              </div>
            </div>
            <div className="sum">
              <h3>Your order summary</h3>
              <pre aria-live="polite">{message}</pre>
              <div className="actions">
                <a className="btn" href={'sms:' + PHONE + '?&body=' + encodeURIComponent(message)} onClick={sendSms}>Text 0922-8701977</a>
                <button className="btn dark" type="button" onClick={sendMsgr}>Copy &amp; open Messenger</button>
              </div>
              <p className="fine">Concept demo: sending this opens a message to the bakery’s public contact number, and it is not a confirmed order. Availability, price and details would be confirmed by the bakery.</p>
            </div>
          </div>
        </div></section>
      </main>

      <footer><div className="wrap">
        <span className="disp">Fabulous Bakery</span>
        <p>Home of Fab Baker Boy · Homemade ♥ Heartmade · Tagaytay</p>
        <p style={{ marginTop: 8 }}><a href="tel:+639228701977">0922-8701977</a> · <a href="https://www.facebook.com/fabbkrboy" target="_blank" rel="noopener">Facebook: Fab Baker Boy</a></p>
        <p className="legal"><strong>Disclaimer:</strong> This website is an unofficial concept mockup created for design demonstration only. It is not affiliated with, endorsed by, or operated by Fabulous Bakery / Fab Baker Boy. All business names, logos and photographs belong to their respective owners. Some images are stock or illustrative and do not show the bakery’s actual products. Prices, availability and reviews are placeholders until confirmed by the owner.</p>
      </div></footer>

      <nav className="bn" aria-label="Quick navigation">
        <L id="top" className={active === 'top' ? 'on' : ''}><svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></svg>Home</L>
        <L id="menu" className={active === 'menu' ? 'on' : ''}><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><circle cx="9" cy="10" r="1" /><circle cx="14" cy="9" r="1" /><circle cx="14" cy="15" r="1" /><circle cx="9" cy="15" r="1" /></svg>Menu</L>
        <L id="order" className={active === 'order' ? 'on' : ''}><svg viewBox="0 0 24 24"><path d="M6 6h15l-2 9H8zM6 6L5 3H2" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>{total > 0 && <span className="cb" style={{ display: 'block' }}>{total}</span>}Cart</L>
        <a href="tel:+639228701977"><svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>Call</a>
      </nav>
      <a id="bar" className={total > 0 ? 'on' : ''} href="#order" onClick={(e) => jump(e, 'order')}>🛒 <span>{total}</span> in your order · Review →</a>
      <div id="toast" className={toast ? 'on' : ''} role="status">{toast}</div>
    </div>
  )
}
