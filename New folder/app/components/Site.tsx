"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Page =
  | "home"
  | "services"
  | "offers"
  | "our-work"
  | "contact"
  | "delivery-check"
  | "cart"
  | "book-appointment";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Offers", href: "/offers" },
  { label: "Our Work", href: "/our-work" },
  { label: "Contact", href: "/contact" },
];

const services = [
  {
    id: "classic-manicure",
    name: "Classic Manicure",
    category: "CARE & CLASSIC",
    description:
      "Precision shaping, thoughtful cuticle care and a beautifully polished finish.",
    price: 500,
    duration: 45,
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "gel-polish",
    name: "Gel Polish",
    category: "COLOUR & FINISH",
    description:
      "A glossy, lasting finish with carefully selected shades for your style.",
    price: 850,
    duration: 60,
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "nail-extensions",
    name: "Nail Extensions",
    category: "SIGNATURE SETS",
    description:
      "A considered custom set shaped around your style, length and occasion.",
    price: 1800,
    duration: 100,
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "nail-art",
    name: "Signature Nail Art",
    category: "ART & DETAIL",
    description:
      "Expressive nail art, delicate details and personalised designs.",
    price: 1200,
    duration: 75,
    image:
      "https://images.unsplash.com/photo-1619946928632-ab5b8b7e5f89?auto=format&fit=crop&w=1000&q=85",
  },
];

const offers = [
  {
    id: "signature-combo",
    name: "The Signature Edit",
    description:
      "Pair your favourite manicure with a little extra attention to detail.",
    discount: "15% OFF",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "colour-ritual",
    name: "Colour Ritual",
    description:
      "Your next colour refresh, with a little something extra.",
    discount: "SPECIAL OFFER",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=85",
  },
];

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  duration: number;
  kind: "service" | "offer";
  discountPercent?: number;
};

const CART_STORAGE_KEY = "nails-by-love-studio-cart-v1";

type SiteProps = {
  page: Page;
};

export default function Site({ page }: SiteProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [cartNotice, setCartNotice] = useState("");
  const [noticeVersion, setNoticeVersion] = useState(0);

  // Each route mounts its own Site instance, so persist the cart between routes.
  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed: unknown = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter(
            (item): item is CartItem =>
              item &&
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              typeof item.price === "number" &&
              typeof item.quantity === "number" &&
              typeof item.duration === "number" &&
              (item.kind === "service" || item.kind === "offer"),
          );
          setCart(validItems);
        }
      }
    } catch {
      // A malformed or unavailable saved cart should not prevent the site from loading.
      setCart([]);
    } finally {
      setCartLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // The current session still works if browser storage is unavailable.
    }
  }, [cart, cartLoaded]);

  useEffect(() => {
    if (!cartNotice) return;
    const version = noticeVersion;
    const timeoutId = window.setTimeout(() => {
      setCartNotice((current) => (version === noticeVersion ? "" : current));
    }, 2800);
    return () => window.clearTimeout(timeoutId);
  }, [cartNotice, noticeVersion]);

  function showCartNotice(message: string) {
    setCartNotice(message);
    setNoticeVersion((version) => version + 1);
  }

  function addToCart(item: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }) {
    setCart((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }
      return [...current, { ...item, quantity: 1, kind: "service" }];
    });
    showCartNotice(`${item.name} added to your bag`);
  }

  function addOfferToCart(offer: (typeof offers)[number]) {
    const itemId = `offer:${offer.id}`;
    if (cart.some((entry) => entry.id === itemId)) {
      showCartNotice(`${offer.name} is already in your bag`);
      return;
    }

    setCart((current) => {
      if (current.some((entry) => entry.id === itemId)) return current;
      return [
        ...current,
        {
          id: itemId,
          name: offer.name,
          price: 0,
          duration: 0,
          quantity: 1,
          kind: "offer",
          ...(offer.id === "signature-combo" ? { discountPercent: 15 } : {}),
        },
      ];
    });
    showCartNotice(`${offer.name} offer added to your bag`);
  }

  function changeQuantity(id: string, change: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce(
    (total, item) =>
      total + (item.kind === "service" ? item.price * item.quantity : 0),
    0,
  );
  const appliedDiscountPercent = cart.reduce(
    (max, item) => Math.max(max, item.kind === "offer" ? item.discountPercent ?? 0 : 0),
    0,
  );
  const offerApplied = cart.some((item) => item.kind === "offer");
  const discount = Math.round((subtotal * appliedDiscountPercent) / 100);
  const total = subtotal - discount;

  const titles: Record<Page, { eyebrow: string; title: string; accent: string; description: string }> = {
    home: {
      eyebrow: "A NAIL ART STUDIO · BENGALURU",
      title: "Colour meets",
      accent: "confidence.",
      description: "Precision, polish and a little bit of magic — made personal.",
    },
    services: {
      eyebrow: "THE SERVICE MENU",
      title: "Your next",
      accent: "favourite.",
      description: "Thoughtful treatments, beautiful finishes and details that make the whole experience feel like yours.",
    },
    offers: {
      eyebrow: "A LITTLE SOMETHING EXTRA",
      title: "Beautiful details,",
      accent: "better together.",
      description: "Explore our featured offers and find a little reason to treat yourself.",
    },
    "our-work": {
      eyebrow: "THE STUDIO JOURNAL",
      title: "Artistry at",
      accent: "your fingertips.",
      description: "A collection of colour, creativity and considered details.",
    },
    contact: {
      eyebrow: "WE WOULD LOVE TO MEET YOU",
      title: "Let's make",
      accent: "time for you.",
      description: "Questions, consultations or help choosing a service? We are here for you.",
    },
    "delivery-check": {
      eyebrow: "A LITTLE MORE PERSONAL",
      title: "Beauty,",
      accent: "at your door.",
      description: "Tell us where you are. Our studio team will check whether your request is possible.",
    },
    cart: {
      eyebrow: "YOUR PERSONAL EDIT",
      title: "Your beauty",
      accent: "bag.",
      description: "Review your selections before choosing your appointment.",
    },
    "book-appointment": {
      eyebrow: "YOUR NEXT STUDIO MOMENT",
      title: "Make it",
      accent: "official.",
      description: "Choose your appointment details. Sign-in will be required before your booking is submitted.",
    },
  };

  const content = titles[page];

  return (
    <main className="studio-site">
      <style jsx global>{`
        .cart-toast {
          position: fixed;
          z-index: 1000;
          top: 22px;
          right: 22px;
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: min(460px, calc(100vw - 32px));
          padding: 14px 16px;
          color: #f8f1f4;
          background: #21191f;
          border: 1px solid rgba(237, 123, 168, 0.55);
          border-radius: 12px;
          box-shadow: 0 18px 55px rgba(0, 0, 0, 0.42);
          font-size: 13px;
          animation: cart-toast-in 260ms cubic-bezier(.2,.8,.2,1) both;
        }
        .cart-toast-icon {
          display: grid;
          flex: 0 0 28px;
          width: 28px;
          height: 28px;
          place-items: center;
          color: #1b1016;
          background: #ffb4d0;
          border-radius: 50%;
          font-weight: 800;
        }
        .cart-toast-link {
          flex: 0 0 auto;
          color: #ffb4d0;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .cart-toast-close {
          padding: 0 2px;
          color: #f8f1f4;
          background: transparent;
          border: 0;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
        }
        @keyframes cart-toast-in {
          from { opacity: 0; transform: translate3d(0, -12px, 0) scale(.98); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cart-toast { animation: none; }
        }
      `}</style>
      {cartNotice && (
        <div className="cart-toast" role="status" aria-live="polite" key={noticeVersion}>
          <span className="cart-toast-icon">✓</span>
          <span>{cartNotice}</span>
          <Link href="/cart" className="cart-toast-link">View bag</Link>
          <button
            type="button"
            className="cart-toast-close"
            aria-label="Dismiss notification"
            onClick={() => setCartNotice("")}
          >
            ×
          </button>
        </div>
      )}
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Nails By Love Studio home">
          <span className="brand-mark">N<span>&</span>L</span>
          <span className="brand-copy">
            <strong>NAILS BY LOVE</strong>
            <small>STUDIO · BEAUTY, WITH FEELING</small>
          </span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "CLOSE −" : "MENU +"}
        </button>

        <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`}>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                (page === "home" && item.href === "/") ||
                item.href === `/${page}`
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book-appointment"
            className="header-book"
            onClick={() => setMenuOpen(false)}
          >
            Book appointment <span>↗</span>
          </Link>
        </nav>

        <Link href="/cart" className="bag-link" aria-label={`Shopping bag, ${cartCount} items`}>
          <span aria-hidden="true">♧</span>
          <span className="bag-label">Bag</span>
          <span className="bag-count">{cartCount}</span>
        </Link>
      </header>

      {page === "home" ? (
        <section className="hero">
          <div className="hero-image" />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>
              {content.title}
              <br />
              <em>{content.accent}</em>
            </h1>
            <p className="hero-description">{content.description}</p>
            <div className="hero-actions">
              <Link href="/services" className="button-primary">
                Explore the studio <span>↗</span>
              </Link>
              <Link href="/book-appointment" className="text-link">
                Book your moment <span>↗</span>
              </Link>
            </div>
          </div>
          <div className="hero-seal">
            <span>NAILS</span>
            <span>BY LOVE</span>
            <span className="seal-star">✧</span>
          </div>
          <div className="scroll-note">SCROLL TO DISCOVER</div>
        </section>
      ) : (
        <section className="page-intro">
          <div>
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>
              {content.title} <em>{content.accent}</em>
            </h1>
          </div>
          <p className="intro-description">{content.description}</p>
        </section>
      )}

      {(page === "home" || page === "services") && (
        <section className="content-section" id="services">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MADE FOR YOUR MOMENT</p>
              <h2>Find your <em>ritual.</em></h2>
            </div>
            <Link href="/services" className="text-link">
              All services ↗
            </Link>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article className="service-card reveal-card" key={service.id} style={{ animationDelay: `${index * 100}ms` }}>
                <Link href="/services" className="card-image-wrap" aria-label={`Explore ${service.name}`}>
                  <img src={service.image} alt={service.name} className="card-image" />
                  <span className="card-index">0{index + 1}</span>
                  <span className="image-arrow">↗</span>
                </Link>
                <div className="service-card-body">
                  <p className="card-category">{service.category}</p>
                  <h3>{service.name}</h3>
                  <p className="card-description">{service.description}</p>
                  <div className="card-meta">
                    <strong>₹{service.price.toLocaleString("en-IN")}</strong>
                    <span>◷ {service.duration} min</span>
                  </div>
                  <button
                    className="button-outline add-button"
                    onClick={() => addToCart(service)}
                  >
                    <span>＋</span> Add to bag
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className="section-footnote">
            Not sure what to choose? Start with what feels like you.
            <Link href="/contact">Let&apos;s find your fit ↗</Link>
          </p>
        </section>
      )}

      {(page === "home" || page === "offers") && (
        <section className="content-section offers-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A LITTLE EXTRA LOVE</p>
              <h2>Something <em>special.</em></h2>
            </div>
            <Link href="/offers" className="text-link">View all offers ↗</Link>
          </div>
          <div className="offer-grid">
            {offers.map((offer, index) => (
              <article className="offer-card reveal-card" key={offer.id} style={{ animationDelay: `${index * 120}ms` }}>
                <Link href="/offers" className="offer-image-wrap" aria-label={`Explore ${offer.name}`}>
                  <img src={offer.image} alt={offer.name} />
                  <span className="offer-tag">{offer.discount}</span>
                </Link>
                <div className="offer-copy">
                  <p className="card-category">STUDIO OFFER</p>
                  <h3>{offer.name}</h3>
                  <p>{offer.description}</p>
                  <button
                    className="text-link"
                    onClick={() => addOfferToCart(offer)}
                  >
                    Add offer to bag <span>＋</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
          {offerApplied && (
            <div className="success-note" role="status">
              <span className="success-icon">✓</span>
Offer added to your bag. {discount > 0 ? `Your estimated discount is ₹${discount.toLocaleString("en-IN")}.` : "Offer details will be confirmed by the studio."}
              <Link href="/cart">Review bag ↗</Link>
            </div>
          )}
        </section>
      )}

      {(page === "home" || page === "our-work") && (
        <section className="content-section work-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">COLOUR, FORM & FEELING</p>
              <h2>Our kind of <em>art.</em></h2>
            </div>
            <Link href="/our-work" className="text-link">Explore our work ↗</Link>
          </div>
          <div className="work-grid">
            {services.map((service, index) => (
              <Link
                href="/our-work"
                className={`work-tile work-tile-${index + 1}`}
                key={service.id}
              >
                <img src={service.image} alt={`${service.name} nail inspiration`} />
                <span>{service.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {page === "contact" && (
        <section className="content-section contact-layout">
          <div className="contact-copy">
            <p className="eyebrow">COME SAY HELLO</p>
            <h2>A little care goes a <em>long way.</em></h2>
            <p>For service questions, custom nail art or help choosing the right treatment, send us a note or book a consultation.</p>
            <div className="contact-detail">
              <span>PHONE</span>
              <strong>Studio contact details will appear here</strong>
            </div>
            <div className="contact-detail">
              <span>LOCATION</span>
              <strong>Bengaluru, India</strong>
            </div>
            <div className="contact-detail">
              <span>APPOINTMENTS</span>
              <strong>Weekdays · 10:00 AM – 8:00 PM</strong>
            </div>
          </div>
          <div className="contact-panel">
            <p className="eyebrow">LET&apos;S TALK</p>
            <h3>How can we help?</h3>
            <p>Choose a starting point and we&apos;ll help you with the next step.</p>
            <Link href="/book-appointment" className="button-primary">Book an appointment ↗</Link>
            <Link href="/delivery-check" className="button-outline">Check delivery availability ↗</Link>
          </div>
        </section>
      )}

      {page === "delivery-check" && (
        <section className="content-section form-layout">
          <div>
            <p className="eyebrow">DELIVERY FEASIBILITY</p>
            <h2>Let&apos;s see if we can come <em>to you.</em></h2>
            <p>Enter your PIN code or locality to begin. This preview does not yet contact the studio or verify a live delivery radius.</p>
          </div>
          <form
            className="studio-form"
            onSubmit={(event) => {
              event.preventDefault();
              setDeliveryMessage(
                postcode.trim()
                  ? "Your location is ready for the studio to review. Live verification will be connected to the backend in the next integration step."
                  : "Please enter a PIN code or locality.",
              );
            }}
          >
            <label htmlFor="postcode">PIN code or locality</label>
            <input
              id="postcode"
              value={postcode}
              onChange={(event) => setPostcode(event.target.value)}
              placeholder="e.g. Indiranagar, Bengaluru"
            />
            <button type="submit" className="button-primary">Check my location ↗</button>
            {deliveryMessage && <p className="form-message" role="status">{deliveryMessage}</p>}
          </form>
        </section>
      )}

      {page === "cart" && (
        <section className="content-section cart-layout">
          <div className="cart-items">
            <p className="eyebrow">YOUR SELECTION</p>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <span className="empty-cart-icon">♡</span>
                <h2>Your bag is waiting.</h2>
                <p>Choose a treatment that feels like you. Your selections will appear here.</p>
                <Link href="/services" className="button-primary">Explore services ↗</Link>
              </div>
            ) : (
              cart.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      {item.kind === "offer"
                        ? item.discountPercent
                          ? `Studio offer · ${item.discountPercent}% off eligible services`
                          : "Studio offer · details confirmed by the team"
                        : `${item.duration} minutes · Studio service`}
                    </p>
                    <div className="quantity-control">
                      <button onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove ${item.name}`}>−</button>
                      <span>{item.quantity}</span>
                      {item.kind === "service" ? (
                        <button onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button>
                      ) : (
                        <span aria-label="Offer quantity"> </span>
                      )}
                    </div>
                  </div>
                  <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                </article>
              ))
            )}
          </div>
          <aside className="cart-summary">
            <p className="eyebrow">ORDER SUMMARY</p>
            <h3>Your bag, at a glance.</h3>
            <div className="summary-row"><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
            {offerApplied && <div className="summary-row discount-row"><span>Offer discount</span><strong>−₹{discount.toLocaleString("en-IN")}</strong></div>}
            <div className="summary-row summary-total"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
            <button
              className="button-outline"
              onClick={() => {
                const signatureOffer = offers.find((offer) => offer.id === "signature-combo");
                if (signatureOffer) addOfferToCart(signatureOffer);
              }}
            >
Add 15% studio offer
            </button>
            <Link
              href={cart.length ? "/book-appointment" : "/services"}
              className={`button-primary ${!cart.length ? "button-muted" : ""}`}
            >
              {cart.length ? "Continue to booking ↗" : "Explore services ↗"}
            </Link>
            <p className="summary-note">You&apos;ll sign in before submitting a booking request. No guest identity is created.</p>
          </aside>
        </section>
      )}

      {page === "book-appointment" && (
        <section className="content-section form-layout booking-layout">
          <div>
            <p className="eyebrow">YOUR APPOINTMENT</p>
            <h2>Make a little space for <em>you.</em></h2>
            <p>Review your selected treatments, then continue to sign-in when customer authentication is connected.</p>
            <div className="booking-preview">
              <span>SELECTED TREATMENTS</span>
              {cart.length ? (
                cart.map((item) => (
                  <div key={item.id} className="summary-row">
                    <span>{item.name} × {item.quantity}{item.kind === "offer" ? " · Offer" : ""}</span>
                    <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                  </div>
                ))
              ) : (
                <p>Your bag is empty. Add a service before booking.</p>
              )}
              <div className="summary-row summary-total"><span>Estimated total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
            </div>
          </div>
          <div className="contact-panel">
            <p className="eyebrow">BOOKING FLOW</p>
            <h3>One more little step.</h3>
            <p>Authentication will be required before the booking is created. The real booking API and confirmation animation will be connected after the identity flow is ready.</p>
            <button
              className="button-primary"
              onClick={() => window.alert("Authentication is not connected yet. Your selection is safe in this page while you continue building the customer sign-in flow.")}
              disabled={!cart.length}
            >
              Continue to sign in ↗
            </button>
            <Link href="/services" className="text-link">Add another service ↗</Link>
          </div>
        </section>
      )}

      <footer className="site-footer">
        <Link href="/" className="footer-brand">NAILS BY LOVE <span>STUDIO</span></Link>
        <p>Thoughtful details. Beautifully personal.</p>
        <div className="footer-links">
          <Link href="/services">Services</Link>
          <Link href="/offers">Offers</Link>
          <Link href="/our-work">Our work</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <span className="footer-copyright">© {new Date().getFullYear()} Nails By Love Studio</span>
      </footer>
    </main>
  );
}
