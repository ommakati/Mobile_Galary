import { useEffect, useMemo, useRef, useState } from "react";
import heroImage from "../assets/images/showroom-hero.png";
import brandLogo from "../assets/images/mobile-galary-logo.png";
import { products } from "./products";

const instagramUrl = "https://www.instagram.com/mobile_galary_01/";

const seedReviews = [
  { name: "Aarav Mehta", role: "iPhone 15 Pro Max buyer", quote: "The experience felt premium from the first message. I got clear recommendations, fast replies, and a setup that made the upgrade feel easy.", score: "5.0" },
  { name: "Priya Nair", role: "Accessories upgrade", quote: "The catalog is effortless to browse and the product cards feel polished. Checkout was quick, and everything looked just as refined on my phone.", score: "4.9" },
  { name: "Kabir Shah", role: "Trade-in customer", quote: "Good advice, clean presentation, and no pressure. It feels closer to a product studio than a normal store, which makes buying much easier.", score: "5.0" },
  { name: "Nisha Patel", role: "New customer", quote: "I loved how organized everything felt. The product details were easy to understand, and the whole experience looked premium from start to finish.", score: "5.0" },
];

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function Brand({ footer = false }) {
  return (
    <a className={`brand ${footer ? "brand-footer" : ""}`} href="#top" aria-label="Mobile Galary home">
      <img className="brand-logo" src={brandLogo} alt="" />
      <span className="brand-name">MOBILE <strong>GALARY</strong><small>Best brands. Best service.</small></span>
    </a>
  );
}

function Header({ cartCount, onCartOpen, onSearch, activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "top", label: "Home" },
    { id: "catalog", label: "Shop" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "reviews", label: "Reviews" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="shell header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(({ id, label }) => (
            <a key={id} className={activeSection === id ? "active" : ""} href={`#${id}`}>{label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button search-trigger" type="button" aria-label="Search products" onClick={onSearch}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg></button>
          <button className="icon-button cart-trigger" type="button" aria-label="Open cart" onClick={onCartOpen}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L20.5 8H6.2M9.5 20h.01M17 20h.01" /></svg><span className="cart-count" aria-label={`${cartCount} items in cart`}>{cartCount}</span></button>
          <button className="icon-button menu-trigger" type="button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg></button>
        </div>
      </div>
      <nav className={`mobile-nav ${menuOpen ? "open" : ""}`} aria-label="Mobile navigation">
        {navItems.map(({ id, label }) => (
          <a key={id} className={activeSection === id ? "active" : ""} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />
      <img className="hero-image" src={heroImage} alt="" fetchPriority="high" />
      <div className="shell hero-content">
        <p className="eyebrow"><span /> New generation tech</p>
        <h1 id="hero-title">Upgrade your<br /><em>everyday.</em></h1>
        <p className="hero-copy">Discover flagship phones and accessories, presented with a clean, premium look built for the way you shop.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#catalog">Explore collection <span aria-hidden="true">+</span></a>
          <button className="play-link" type="button" onClick={() => document.querySelector("#services")?.scrollIntoView()}><span className="play-icon" aria-hidden="true">+</span> Why shop with us</button>
        </div>
        <dl className="hero-stats"><div><dt>50+</dt><dd>Premium devices</dd></div><div><dt>2 yr</dt><dd>Store warranty</dd></div><div><dt>4.9</dt><dd>Customer rating</dd></div></dl>
      </div>
      <a className="scroll-cue" href="#catalog" aria-label="Scroll to products"><span>Scroll to discover</span><svg viewBox="0 0 20 28" aria-hidden="true"><rect x="1" y="1" width="18" height="26" rx="9" /><path d="M10 7v5" /></svg></a>
    </section>
  );
}

function DeviceVisual({ product }) {
  return <div className={`device-art ${product.category === "accessory" ? "accessory-art" : "phone-art"}`} aria-hidden="true"><div className="product-photo-wrap" style={{ background: product.background }}><img className="product-photo" src={product.image} alt="" loading="lazy" style={{ objectFit: product.imageFit || "contain", maxWidth: product.imageSize || "92%" }} /></div></div>;
}

function ProductCard({ product, favorite, onFavorite, onAdd, onDetails }) {
  return (
    <article className="product-card">
      <div className="product-visual" style={{ "--card-bg": product.background }}>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <DeviceVisual product={product} />
      </div>
      <div className="product-info"><span className="product-meta">{product.label}</span><h3>{product.name}</h3><p>{product.description}</p><div className="product-buy"><span className="product-price"><small>from </small>{money.format(product.price)}</span><div className="product-actions"><button className={`favorite-button favorite-button-inline ${favorite ? "active" : ""}`} type="button" onClick={() => onFavorite(product.id)} aria-label={`${favorite ? "Remove" : "Add"} ${product.name} ${favorite ? "from" : "to"} favorites`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg></button><button className="add-button" type="button" onClick={() => onAdd(product.id)} aria-label={`Add ${product.name} to cart`}>+</button></div></div></div>
      <button className="product-detail-trigger" type="button" onClick={() => onDetails(product)} aria-label={`View ${product.name} details`} />
    </article>
  );
}

function Catalog({ favorites, onFavorite, onAdd, onDetails, searchRef }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatch = filter === "all" || product.category === filter;
      const queryMatch = !normalized || `${product.name} ${product.label} ${product.description}`.toLowerCase().includes(normalized);
      return categoryMatch && queryMatch;
    });
  }, [filter, query]);

  const filters = [["all", "All products"], ["phone", "Phones"], ["accessory", "Accessories"]];

  return (
    <section className="catalog section" id="catalog" aria-labelledby="catalog-title">
      <div className="shell">
        <div className="section-heading"><div><p className="eyebrow eyebrow-dark"><span /> Curated for you</p><h2 id="catalog-title">Find your next favorite.</h2></div><p>Flagship power, everyday reliability, and the accessories that bring it all together.</p></div>
        <div className="catalog-toolbar"><div className="filter-tabs" role="group" aria-label="Filter products by category">{filters.map(([value, label]) => <button className={`filter-button ${filter === value ? "active" : ""}`} type="button" key={value} onClick={() => setFilter(value)}>{label}</button>)}</div><label className="search-box"><span className="sr-only">Search products</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg><input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search collection" /></label></div>
        <div className="product-grid" aria-live="polite">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} onFavorite={onFavorite} onAdd={onAdd} onDetails={onDetails} />)}</div>
        {visibleProducts.length === 0 && <p className="empty-state">No products match your search.</p>}
      </div>
    </section>
  );
}

function Services() {
  const services = [
    { number: "01", title: "Expert setup", text: "We transfer your data, optimize your settings, and make sure everything works before you leave.", icon: <><path d="M3 7.5 12 3l9 4.5L12 12 3 7.5Z" /><path d="m3 12 9 4.5 9-4.5M3 16.5l9 4.5 9-4.5" /></> },
    { number: "02", title: "Trusted warranty", text: "Straightforward protection, backed by fast diagnostics and reliable support.", icon: <><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></> },
    { number: "03", title: "Easy trade-in", text: "Bring your current phone and get an instant, transparent credit toward your next upgrade.", icon: <><path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.5" /><path d="M20 3v5.5h-5.5" /></> },
  ];

  return <section className="services section" id="services" aria-labelledby="services-title"><div className="shell"><div className="section-heading service-heading"><div><p className="eyebrow"><span /> The Mobile Galary standard</p><h2 id="services-title">More than a device.</h2></div><p>Real support from people who know the technology, before and after your purchase.</p></div><div className="service-grid">{services.map((service) => <article key={service.number}><span className="service-number">{service.number}</span><div className="service-icon"><svg viewBox="0 0 24 24" aria-hidden="true">{service.icon}</svg></div><h3>{service.title}</h3><p>{service.text}</p></article>)}</div></div></section>;
}

function About() {
  return <section className="about section" id="about"><div className="shell about-card"><div><p className="eyebrow eyebrow-dark"><span /> Technology made personal</p><h2>Good advice.<br />Better technology.</h2></div><div className="about-copy"><p>Mobile Galary is built around a simple idea: buying technology should feel clear, affordable, and personal.</p><a href="#catalog">Browse the collection <span aria-hidden="true">+</span></a></div></div></section>;
}

function Reviews({ reviews, onAddReview }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const marqueeReviews = [...reviews, ...reviews];

  const renderStars = (value) => {
    const starCount = Math.max(1, Math.min(5, Math.round(Number(value) || 0)));
    return "★★★★★".slice(0, starCount).padEnd(5, "☆");
  };

  const submitReview = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedQuote = quote.trim();
    const trimmedRole = role.trim();
    if (!trimmedName || !trimmedQuote) return;
    onAddReview({
      id: `${Date.now()}`,
      name: trimmedName,
      role: trimmedRole || "Verified customer",
      quote: trimmedQuote,
      score: `${rating}.0`,
    });
    setName("");
    setRole("");
    setQuote("");
    setRating(5);
  };

  return (
    <section className="reviews section" id="reviews" aria-labelledby="reviews-title">
      <div className="shell">
        <div className="reviews-layout">
          <div className="reviews-main">
            <div className="section-heading reviews-heading">
              <div><p className="eyebrow"><span /> Real customer reviews</p><h2 id="reviews-title">Write your review and let it join the scroll.</h2></div>
            </div>
            <form className="review-form" onSubmit={submitReview}>
              <div className="review-form-grid">
                <label>
                  Your name
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" />
                </label>
                <label>
                  Role or product
                  <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="e.g. iPhone 15 buyer" />
                </label>
              </div>
              <label className="review-textarea-label">
                Your review
                <textarea value={quote} onChange={(event) => setQuote(event.target.value)} placeholder="Write your review line by line. Each line will animate in the card." rows={6} />
              </label>
              <div className="review-rating-group" role="group" aria-label="Select star rating">
                <span>How many stars would you give?</span>
                <div className="review-rating-buttons">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      className={`review-rating-button ${rating === value ? "active" : ""}`}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-pressed={rating === value}
                      aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    >
                      {value}★
                    </button>
                  ))}
                </div>
              </div>
              <div className="review-form-actions">
                <span>Your review joins the scrolling carousel below.</span>
                <button className="button button-primary" type="submit">Post review <span aria-hidden="true">+</span></button>
              </div>
            </form>
          </div>
          <div className="review-side">
            <div className="review-strip"><div><strong>4.9/5</strong><span>Average rating</span></div><div><strong>1,200+</strong><span>Happy customers</span></div><div><strong>Live</strong><span>Auto-scrolling feed</span></div></div>
          </div>
        </div>
        <div className="review-marquee" aria-label="Customer reviews auto-scrolling gallery">
          <div className="review-track">
            {marqueeReviews.map((review, index) => {
              const lines = review.quote.split(/\n+/).map((line) => line.trim()).filter(Boolean);
              return (
                <article className="review-card" key={`${review.name}-${index}`}>
                  <div className="review-top">
                    <div className="review-avatar" aria-hidden="true">{review.name.charAt(0)}</div>
                    <div>
                      <h3>{review.name}</h3>
                      <p>{review.role}</p>
                    </div>
                    <span className="review-score">{review.score}</span>
                  </div>
                  <div className="review-lines" aria-label={`Review from ${review.name}`}>
                    {lines.map((line, lineIndex) => (
                      <span className="review-line" key={`${review.name}-${lineIndex}`} style={{ "--line-index": lineIndex }}>{line}</span>
                    ))}
                  </div>
                  <div className="review-stars" aria-label={`${review.score} out of 5 stars`}><span>{renderStars(review.score)}</span></div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return <section className="contact section" id="contact" aria-labelledby="contact-title"><div className="shell contact-card"><div className="contact-logo-wrap"><img src={brandLogo} alt="Mobile Galary logo" /></div><div className="contact-copy"><p className="eyebrow"><span /> Contact us</p><h2 id="contact-title">Let&apos;s find your next phone.</h2><p>Message Mobile Galary on Instagram for current prices, availability, product questions, and purchase support.</p><a className="button instagram-button" href={instagramUrl} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" className="instagram-dot" /></svg><span><small>Message us on Instagram</small>@mobile_galary_01</span><b aria-hidden="true">+</b></a></div></div></section>;
}

function CartDrawer({ open, cart, onClose, onUpdate, onRemove, onCheckout }) {
  const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  const total = entries.reduce((sum, [id, quantity]) => sum + (products.find((item) => item.id === id)?.price || 0) * quantity, 0);

  useEffect(() => {
    const handleEscape = (event) => event.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  return <><div className={`overlay ${open ? "open" : ""}`} onClick={onClose} /><aside className={`cart-drawer ${open ? "open" : ""}`} aria-labelledby="cart-title" aria-hidden={!open}><div className="drawer-header"><div><p className="eyebrow eyebrow-dark"><span /> Your selection</p><h2 id="cart-title">Shopping bag</h2></div><button className="icon-button drawer-close" type="button" aria-label="Close cart" onClick={onClose}>X</button></div><div className="cart-items">{entries.map(([id, quantity]) => { const product = products.find((item) => item.id === id); if (!product) return null; return <div className="cart-item" key={id}><div className="cart-item-art" style={{ color: "var(--blue)" }}>{product.name.charAt(0)}</div><div><h3>{product.name}</h3><p>{product.label}</p><div className="quantity"><button type="button" onClick={() => onUpdate(id, -1)} aria-label={`Decrease ${product.name} quantity`}>-</button><span>{quantity}</span><button type="button" onClick={() => onUpdate(id, 1)} aria-label={`Increase ${product.name} quantity`}>+</button></div></div><div className="cart-item-price">{money.format(product.price * quantity)}<button className="remove-item" type="button" onClick={() => onRemove(id)}>Remove</button></div></div>; })}</div>{entries.length === 0 ? <div className="cart-empty"><span>0</span><h3>Your bag is empty</h3><p>Add a device or accessory to get started.</p></div> : <div className="cart-summary"><div><span>Subtotal</span><strong>{money.format(total)}</strong></div><p>Message us to confirm availability, final price, and delivery.</p><button className="button button-primary checkout-button" type="button" onClick={onCheckout}>Order on Instagram <span>+</span></button></div>}</aside></>;
}

function ProductDialog({ product, onClose, onAdd }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (product && dialog && !dialog.open) dialog.showModal();
    if (!product && dialog && dialog.open) dialog.close();
  }, [product]);

  return <dialog ref={dialogRef} className="product-dialog" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => event.target === event.currentTarget && onClose()}><button className="dialog-close" type="button" aria-label="Close product details" onClick={onClose}>X</button>{product && <div className="dialog-layout"><div className="dialog-visual" style={{ "--dialog-bg": product.background }}><DeviceVisual product={product} /></div><div className="dialog-info"><span className="product-meta">{product.label}</span><h2>{product.name}</h2><p className="dialog-description">{product.description}</p><ul className="feature-list">{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><div className="dialog-purchase"><span className="dialog-price">{money.format(product.price)}</span><button className="button button-primary" type="button" onClick={() => onAdd(product.id)}>Add to bag <span>+</span></button></div></div></div>}</dialog>;
}

function App() {
  const [cart, setCart] = useState(() => readStorage("mobile-galary-cart", readStorage("nova-cart", {})));
  const [favorites, setFavorites] = useState(() => readStorage("mobile-galary-favorites", readStorage("nova-favorites", [])));
  const [reviews, setReviews] = useState(() => readStorage("mobile-galary-reviews", seedReviews));
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState("");
  const [activeSection, setActiveSection] = useState("top");
  const searchRef = useRef(null);

  useEffect(() => {
    const sectionIds = ["top", "catalog", "services", "about", "reviews", "contact"];
    const handleScroll = () => {
      const headerH = 120;
      let current = "top";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= headerH) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  useEffect(() => localStorage.setItem("mobile-galary-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("mobile-galary-favorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem("mobile-galary-reviews", JSON.stringify(reviews)), [reviews]);
  useEffect(() => { document.body.classList.toggle("no-scroll", cartOpen || Boolean(selectedProduct)); return () => document.body.classList.remove("no-scroll"); }, [cartOpen, selectedProduct]);
  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(""), 2200); return () => window.clearTimeout(timer); }, [toast]);

  const addToCart = (id, openCart = false) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    setToast(`${product.name} added to your bag`);
    if (openCart) {
      setSelectedProduct(null);
      setCartOpen(true);
    }
  };

  const focusSearch = () => {
    document.querySelector("#catalog")?.scrollIntoView();
    window.setTimeout(() => searchRef.current?.focus(), 500);
  };

  return <><a className="skip-link" href="#catalog">Skip to products</a><Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} onSearch={focusSearch} activeSection={activeSection} /><main><Hero /><Catalog favorites={favorites} onFavorite={(id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])} onAdd={(id) => addToCart(id, true)} onDetails={setSelectedProduct} searchRef={searchRef} /><Services /><About /><Reviews reviews={reviews} onAddReview={(review) => setReviews((current) => [review, ...current])} /><Contact /></main><footer><div className="shell footer-inner"><div className="footer-brand-block"><Brand footer /><p>Premium phones, accessories, and guidance shaped with the same care as the products we sell.</p></div><div className="footer-columns"><div><h3>Explore</h3><a href="#catalog">Shop</a><a href="#services">Services</a><a href="#reviews">Reviews</a></div><div><h3>Connect</h3><a className="footer-instagram" href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a><a href="#contact">Contact</a><a href="#top">Back to top</a></div></div><div className="footer-cta"><p>Ready to upgrade?</p><a className="button button-primary" href="#catalog">Browse collection <span aria-hidden="true">+</span></a><small>Copyright {new Date().getFullYear()} Mobile Galary</small></div></div></footer><CartDrawer open={cartOpen} cart={cart} onClose={() => setCartOpen(false)} onUpdate={(id, change) => setCart((current) => { const quantity = (current[id] || 0) + change; if (quantity <= 0) { const next = { ...current }; delete next[id]; return next; } return { ...current, [id]: quantity }; })} onRemove={(id) => setCart((current) => { const next = { ...current }; delete next[id]; return next; })} onCheckout={() => window.open(instagramUrl, "_blank", "noopener,noreferrer")} /><ProductDialog product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={(id) => addToCart(id, true)} /><div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">{toast}</div><a className="mobile-contact" href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Contact Mobile Galary on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg><span>Contact us</span></a></>;
}

export default App;