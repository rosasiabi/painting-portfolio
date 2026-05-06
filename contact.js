const params = new URLSearchParams(window.location.search);
const subject = params.get('subject') || 'Siabi Studio enquiry';
const sent = params.get('sent') === '1';

const subjectInput = document.getElementById('visible-subject');
const hiddenSubject = document.getElementById('form-subject');
const nextInput = document.getElementById('form-next');
const thanksMessage = document.getElementById('thanks-message');

subjectInput.value = subject;
hiddenSubject.value = subject;
nextInput.value = `${window.location.origin}/contact.html?sent=1`;

subjectInput.addEventListener('input', () => {
  hiddenSubject.value = subjectInput.value || 'Siabi Studio enquiry';
});

if (sent) {
  thanksMessage.classList.add('show');
}
