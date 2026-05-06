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

const noPrintEdition = new Set(['andrew.webp', 'charlie.webp', 'teni.webp', 'milo.webp']);
artworks.forEach((art) => {
  art.printEdition = noPrintEdition.has(art.fileName) ? null : { available: 20, total: 20 };
  art.canEnquireOriginal = art.status === 'available';
  art.canEnquirePrint = Boolean(art.printEdition && art.printEdition.available > 0);
});

const params = new URLSearchParams(window.location.search);
const requestedSlug = params.get('artwork') || artworks[0].slug;
const art = artworks.find((item) => item.slug === requestedSlug) || artworks[0];
const enquireButton = document.getElementById('enquire-artwork');
const enquiryNote = document.getElementById('enquiry-note');
const formats = art.canEnquireOriginal && art.canEnquirePrint
  ? `print edition ${art.printEdition.available}/${art.printEdition.total} or original`
  : art.canEnquirePrint
    ? `print edition ${art.printEdition.available}/${art.printEdition.total}`
    : 'original';
const subject = `Artwork enquiry: ${art.title} - ${formats}`;

document.title = `${art.title} | Siabi Studio Enquiry`;
document.getElementById('art-title').innerText = art.title;
document.getElementById('art-size').innerText = art.size;
document.getElementById('art-edition').innerText = art.printEdition ? `${art.printEdition.available}/${art.printEdition.total}` : 'No prints';
document.getElementById('art-status').innerText = art.status;
document.getElementById('art-medium').innerText = `${art.medium} / ${art.category}`;
document.getElementById('art-format').innerText = art.canEnquireOriginal && art.canEnquirePrint
  ? 'Print or original enquiry'
  : art.canEnquirePrint
    ? 'Print enquiry'
    : art.canEnquireOriginal
      ? 'Original enquiry'
      : 'Unavailable';
document.getElementById('art-image').src = `/images/${art.medium}/${art.fileName}`;
document.getElementById('art-image').alt = art.title;

if (art.canEnquireOriginal || art.canEnquirePrint) {
  enquireButton.href = `/contact.html?subject=${encodeURIComponent(subject)}`;
  enquireButton.innerText = art.canEnquireOriginal && art.canEnquirePrint
    ? 'Enquire about print / original'
    : art.canEnquirePrint
      ? 'Enquire about print'
      : 'Enquire about original';
} else {
  enquireButton.remove();
  enquiryNote.innerText = 'No prints are available for this work.';
}
