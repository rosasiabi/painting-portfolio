const artworks = [
  { fileName: 'charles.webp', title: 'I have meddled...If that is the word', size: 'A2', medium: 'paper', category: 'misc', status: 'available' },
  { fileName: 'charlie.webp', title: 'Charlie', size: '40cm x 50cm x 1.8cm', medium: 'canvas', category: 'portraits', status: 'sold' },
  { fileName: 'teni.webp', title: 'Teni', size: '40cm x 50cm x 1.8cm', medium: 'canvas', category: 'portraits', status: 'sold' },
  { fileName: 'milo.webp', title: 'Milo', size: '40cm x 50cm x 1.8cm', medium: 'canvas', category: 'portraits', status: 'sold' },
  { fileName: 'andrew.webp', title: 'Andrew', size: '40cm x 50cm x 1.8cm', medium: 'canvas', category: 'portraits', status: 'sold' },
  { fileName: 'victor.webp', title: 'I sport new balance to avoid a narrow path', size: '40cm x 50cm', medium: 'canvas', category: 'misc', status: 'available' },
  { fileName: 'bb09.webp', title: 'head', size: 'A5', medium: 'paper', category: 'body builder', status: 'available' },
  { fileName: 'bb01.webp', title: 'leg', size: 'A5', medium: 'paper', category: 'body builder', status: 'available' },
  { fileName: 'bb07.webp', title: 'nipple', size: 'A5', medium: 'paper', category: 'body builder', status: 'sold' },
  { fileName: 'bb03.webp', title: 'half', size: 'A5', medium: 'paper', category: 'body builder', status: 'available' },
  { fileName: 'bb04.webp', title: 'fist', size: 'A5', medium: 'paper', category: 'body builder', status: 'available' },
  { fileName: 'bb05.webp', title: 'v', size: 'A5', medium: 'paper', category: 'body builder', status: 'sold' },
  { fileName: 'bb02.webp', title: 'thigh', size: 'A5', medium: 'paper', category: 'body builder', status: 'sold' },
  { fileName: 'bb06.webp', title: 'chest', size: 'A5', medium: 'paper', category: 'body builder', status: 'available' },
  { fileName: 'bb08.webp', title: 'armpit', size: 'A5', medium: 'paper', category: 'body builder', status: 'available' },
  { fileName: 'bb10.webp', title: 'upper body', size: 'A5', medium: 'paper', category: 'body builder', status: 'available' },
  { fileName: 'CAKE.webp', title: 'Aging backwards', size: 'A5', medium: 'paper', category: 'misc', status: 'sold' },
  { fileName: 'MAKEUP.webp', title: 'All dolled up with nowhere to be', size: 'A4', medium: 'paper', category: 'misc', status: 'available' },
  { fileName: 'tilda.webp', title: 'Tilda do us part', size: 'A5', medium: 'paper', category: 'misc', status: 'available' },
  { fileName: 'franca.webp', title: 'Franca lost her drink', size: 'A5', medium: 'paper', category: 'misc', status: 'sold' },
  { fileName: 'tow.webp', title: 'Turkish Oil Wrestling', size: 'A5', medium: 'paper', category: 'misc', status: 'available' }
].map((art) => ({ ...art, slug: art.fileName.replace(/\.[^.]+$/, '') }));

const params = new URLSearchParams(window.location.search);
const requestedSlug = params.get('artwork') || artworks[0].slug;
const art = artworks.find((item) => item.slug === requestedSlug) || artworks[0];
const paymentStatus = params.get('payment');

const checkoutNote = document.getElementById('checkout-note');
const fallbackNote = document.getElementById('fallback-note');
const enquireLink = document.getElementById('enquire-link');

document.title = `${art.title} | Siabi Studio Shop`;
document.getElementById('art-title').innerText = art.title;
document.getElementById('art-size').innerText = art.size;
document.getElementById('art-status').innerText = art.status;
document.getElementById('art-medium').innerText = `${art.medium} / ${art.category}`;
document.getElementById('art-image').src = `/images/${art.medium}/${art.fileName}`;
document.getElementById('art-image').alt = art.title;
enquireLink.href = `mailto:rosa@siabi.studio?subject=${encodeURIComponent(`Purchase enquiry: ${art.title}`)}`;

function setMessage(message, showFallback = false) {
  checkoutNote.innerText = message;
  fallbackNote.classList.toggle('show', showFallback);
}

function disableButton(button, label) {
  button.href = '#';
  button.innerText = label;
  button.setAttribute('aria-disabled', 'true');
  button.addEventListener('click', (event) => event.preventDefault());
}

function configureButton(id, format, label, disabledLabel) {
  const button = document.getElementById(id);
  if (format === 'original' && art.status !== 'available') {
    disableButton(button, disabledLabel);
    return;
  }

  button.href = '#';
  button.innerText = label;
  button.removeAttribute('aria-disabled');
  button.addEventListener('click', async (event) => {
    event.preventDefault();
    button.setAttribute('aria-disabled', 'true');
    const originalText = button.innerText;
    button.innerText = 'Opening Stripe...';

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ artwork: art.slug, format })
      });
      const payload = await response.json();
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || 'Stripe checkout could not start.');
      }
      window.location.assign(payload.url);
    } catch (error) {
      button.removeAttribute('aria-disabled');
      button.innerText = originalText;
      setMessage(error.message, true);
    }
  });
}

configureButton('buy-print', 'print', 'Buy print', 'Print checkout coming soon');
configureButton('buy-original', 'original', 'Buy original', 'Original sold');

if (paymentStatus === 'success') {
  setMessage('Payment complete. Thank you for collecting this work.');
} else if (paymentStatus === 'cancelled') {
  setMessage('Checkout was cancelled. You can return to Stripe whenever you are ready.');
}
