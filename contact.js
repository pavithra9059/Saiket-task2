/**
 * LUXE MARKET — Contact Page Script
 * Handles: contact form validation and success state.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateContactForm()) submitContact();
  });

  // Live validation: clear error when user starts typing
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errEl = document.getElementById('err-' + field.id);
      if (errEl) errEl.classList.remove('visible');
    });
  });
});


function validateContactForm() {
  let valid = true;

  const rules = [
    ['contact-name',    'err-contact-name',
      val => val.trim().length >= 2,
      'Please enter your name (at least 2 characters).'],
    ['contact-email',   'err-contact-email',
      val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Enter a valid email address.'],
    ['contact-message', 'err-contact-message',
      val => val.trim().length >= 10,
      'Message must be at least 10 characters.'],
  ];

  rules.forEach(([id, errId, fn, msg]) => {
    const input = document.getElementById(id);
    const errEl = document.getElementById(errId);
    if (!input) return;
    const ok = fn(input.value);
    input.classList.toggle('error', !ok);
    if (errEl) { errEl.textContent = msg; errEl.classList.toggle('visible', !ok); }
    if (!ok) valid = false;
  });

  return valid;
}


function submitContact() {
  // Hide the form, show success
  const formEl    = document.getElementById('contact-form');
  const successEl = document.getElementById('contact-success');

  if (formEl)    formEl.style.display    = 'none';
  if (successEl) successEl.classList.add('visible');

  showToast('✓ Message sent successfully!');
}
