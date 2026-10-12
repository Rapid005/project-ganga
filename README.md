# The Holy Drop

An online store for sacred Gangajal from five holy places along the Ganga — Gangotri, Rishikesh, Haridwar, Prayagraj and Kashi.

**Live site:** https://rapid005.github.io/project-ganga/

The site is plain HTML, CSS and JavaScript. There is no build step and no server: GitHub Pages serves the files as they are.

## What's included

| Page | File |
|---|---|
| Home | `index.html` |
| Shop, with category / source / size filters and sorting | `shop.html` |
| Product details, with size and quantity | `product.html?id=…` |
| Cart, with coupons and a free-shipping meter | `cart.html` |
| Checkout, with address validation | `checkout.html` |
| Order confirmation | `order.html` |
| Our story, FAQ, Shipping & returns, Contact, Privacy, Terms | `about.html`, `faq.html`, `shipping.html`, `contact.html`, `privacy.html`, `terms.html` |

The cart is saved in the visitor's browser, so it survives page reloads.

## Editing the store

Almost everything lives in **`js/products.js`**:

- **Products and prices** — edit the `HD.products` list. Each product has sizes (`variants`) with a `price` and an `mrp` (shown struck through).
- **Shipping** — `freeShippingThreshold` (₹999) and `shippingFee` (₹79).
- **Offers bar** — the rotating messages at the top of every page live in `announcements`. Change them for each festival or sale, or empty the list to hide the bar.
- **Coupons** — `NAVRATRI10` and `HOLYDROP10` (10% off) and `PUJA100` (₹100 off above ₹999). Add or remove codes in `coupons`; `featuredCoupon` is the code suggested in the cart.
- **Contact details** — set `contactEmail` and `contactPhone` to show them on the Contact page.
- **Demo mode** — while `demoMode` is `true`, the checkout and order pages say the store is a demo and no payment is taken. Turn it off only once real payments are connected.

Colours and fonts are defined at the top of `css/style.css`.

### Product images

The bottle illustrations in `img/products/` are placeholders (the Hindi lettering on them is drawn as shapes, so it shows correctly on every device). To use real photos, add square images (about 800 × 800 px) to `img/products/` and change each product's `image` path in `js/products.js`.

### Website copy

The descriptions of how the water is collected, filtered and packed are placeholder text. Before going live, make sure every claim matches what you actually do.

## Hosting on GitHub Pages

1. Make the repository public: **Settings → General → Danger Zone → Change visibility**. (On the free plan, Pages needs a public repository.)
2. **Settings → Pages → Build and deployment**: Source **Deploy from a branch**, Branch **`main`**, folder **`/ (root)`**, then **Save**.
3. After a minute or two the site is live at https://rapid005.github.io/project-ganga/.

Every push to `main` updates the live site automatically.

## Going live: real payments

The checkout is a demo: it shows a confirmation, but no money changes hands and the order isn't sent anywhere. Taking real orders needs a payment provider, for example:

- **Razorpay Payment Links or Payment Button** — UPI, cards and netbanking, and works on a static site.
- **A UPI QR code** on the confirmation page, for manual orders.
- **A hosted store backend** such as Snipcart or Shopify Buy Button.

## Before selling for real

- Sell and label the product **for puja and ritual use only — not for drinking**. Water sold for drinking in India needs FSSAI licensing and BIS certification.
- Don't make health or healing claims.
- Register for GST when your turnover requires it, and issue invoices.
- Use a courier that accepts liquids, and package bottles to be leak-proof.
- Have the Privacy policy and Terms of sale reviewed for your business.
