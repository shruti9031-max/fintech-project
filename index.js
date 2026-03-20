'use strict';

var getEl = function(id) { return document.getElementById(id); };
var getAll = function(sel) { return document.querySelectorAll(sel); };

function showToast(msg, type) {
  var t = getEl('toast');
  var prefix = type === 'error' ? 'Error: ' : 'Success: ';
  t.textContent = prefix + msg;
  t.className = 'toast ' + (type || 'success') + ' show';
  setTimeout(function() { t.classList.remove('show'); }, 3500);
}

function setLoading(btn, loading) {
  if (loading) {
    btn.disabled = true;
    btn.dataset.orig = btn.textContent;
    btn.innerHTML = '<span class="btn-spinner"></span>' + btn.dataset.orig;
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.orig || btn.textContent;
  }
}

function waitFor(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

var fadeObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('in'); }
  });
}, { threshold: 0.08 });

getAll('.fade-up').forEach(function(el) { fadeObserver.observe(el); });

function staggerCards(selector, delayMs) {
  var cards = getAll(selector);
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function() {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * delayMs);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(function(c) {
    c.style.opacity = '0';
    c.style.transform = 'translateY(24px)';
    c.style.transition = 'opacity 0.55s ease, transform 0.55s ease, box-shadow 0.3s, border-color 0.3s';
    obs.observe(c);
  });
}

staggerCards('.feat-card', 80);
staggerCards('.testi-card', 100);

var navbar = getEl('navbar');
window.addEventListener('scroll', function() {
  navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.08)' : 'none';
});

var allSections = getAll('section[id], footer[id]');
var navLinks = getAll('.nav-links a');
var sectionWatcher = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function(l) { l.classList.remove('active'); });
      var active = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
      if (active) { active.classList.add('active'); }
    }
  });
}, { threshold: 0.4 });
allSections.forEach(function(s) { sectionWatcher.observe(s); });

document.addEventListener('click', function(e) {
  var link = e.target.closest('a[href^="#"]');
  if (link) {
    var target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      closeMobileMenu();
    }
  }
});

var hamburger = getEl('hamburger');
var mobileMenu = getEl('mobileMenu');
var mobileOverlay = getEl('mobileOverlay');

function openMobileMenu() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', function() {
  mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});
getEl('mobileClose').addEventListener('click', closeMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);

var debitCard = getEl('debitCard');
if (debitCard) {
  debitCard.addEventListener('mousemove', function(e) {
    var r = debitCard.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var rY = ((x - r.width / 2) / (r.width / 2)) * 12;
    var rX = ((r.height / 2 - y) / (r.height / 2)) * 8;
    debitCard.style.transform = 'perspective(800px) rotateY(' + rY + 'deg) rotateX(' + rX + 'deg) scale(1.04)';
  });
  debitCard.addEventListener('mouseleave', function() {
    debitCard.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
  });
}

var statEls = getAll('.stat-n');
var statWatcher = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      runCounter(entry.target);
      statWatcher.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statEls.forEach(function(el) { statWatcher.observe(el); });

function runCounter(el) {
  var text = el.textContent.trim();
  var match = text.match(/[\d.]+/);
  if (!match) { return; }
  var end = parseFloat(match[0]);
  var suffix = text.replace(match[0], '');
  var dur = 1400;
  var startTime = performance.now();
  function tick(now) {
    var p = Math.min((now - startTime) / dur, 1);
    var eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (end * eased).toFixed(end % 1 !== 0 ? 1 : 0) + suffix;
    if (p < 1) { requestAnimationFrame(tick); }
  }
  requestAnimationFrame(tick);
}

var modalOverlay = getEl('modalOverlay');
var accountModal = getEl('accountModal');
var loginModal = getEl('loginModal');

function openModal(modal) {
  modalOverlay.classList.add('show');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('show');
  var anyOpen = accountModal.classList.contains('show') || loginModal.classList.contains('show');
  if (!anyOpen) {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }
}

modalOverlay.addEventListener('click', function() {
  closeModal(accountModal);
  closeModal(loginModal);
  modalOverlay.classList.remove('show');
  document.body.style.overflow = '';
});

getEl('modalClose').addEventListener('click', function() { closeModal(accountModal); });
getEl('loginModalClose').addEventListener('click', function() { closeModal(loginModal); });

['navGetStarted', 'mobileGetStarted', 'heroGetStarted', 'getFreeCard', 'ctaCreate'].forEach(function(id) {
  var el = getEl(id);
  if (el) {
    el.addEventListener('click', function() {
      closeMobileMenu();
      showStep('step1');
      openModal(accountModal);
    });
  }
});

getEl('navLoginBtn').addEventListener('click', function() { openModal(loginModal); });
getEl('goLogin').addEventListener('click', function() { closeModal(accountModal); openModal(loginModal); });
getEl('goRegister').addEventListener('click', function() { closeModal(loginModal); showStep('step1'); openModal(accountModal); });
getEl('ctaLearn').addEventListener('click', function() {
  document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
});

document.addEventListener('click', function(e) {
  var btn = e.target.closest('.toggle-pw');
  if (!btn) { return; }
  var input = getEl(btn.dataset.target);
  if (!input) { return; }
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? '\uD83D\uDC41' : '\uD83D\uDE48';
});

getEl('regPassword').addEventListener('input', function() {
  var val = this.value;
  var bar = getEl('pwBar');
  var label = getEl('pwLabel');
  var strength = 0;
  if (val.length >= 8) { strength++; }
  if (/[A-Z]/.test(val)) { strength++; }
  if (/[0-9]/.test(val)) { strength++; }
  if (/[^A-Za-z0-9]/.test(val)) { strength++; }
  var levels = [
    { w: '25%', c: '#e05252', t: 'Weak' },
    { w: '50%', c: '#f0a020', t: 'Fair' },
    { w: '75%', c: '#60b8f0', t: 'Good' },
    { w: '100%', c: '#00c882', t: 'Strong' }
  ];
  if (val.length === 0) { bar.style.width = '0'; label.textContent = ''; return; }
  var lvl = levels[Math.max(0, strength - 1)];
  bar.style.width = lvl.w;
  bar.style.background = lvl.c;
  label.textContent = lvl.t;
  label.style.color = lvl.c;
});

function setFieldError(inputId, errId, msg) {
  var input = getEl(inputId);
  var err = getEl(errId);
  if (msg) {
    input.classList.add('error');
    input.classList.remove('valid');
    err.textContent = msg;
    return false;
  }
  input.classList.remove('error');
  input.classList.add('valid');
  err.textContent = '';
  return true;
}

function validateRegister() {
  var ok = true;
  var fn = getEl('firstName').value.trim();
  var ln = getEl('lastName').value.trim();
  var email = getEl('regEmail').value.trim();
  var phone = getEl('regPhone').value.trim();
  var pw = getEl('regPassword').value;
  var cpw = getEl('regConfirm').value;
  var agreed = getEl('agreeTerms').checked;
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!fn) { setFieldError('firstName', 'firstNameErr', 'First name is required'); ok = false; }
  else { setFieldError('firstName', 'firstNameErr', ''); }

  if (!ln) { setFieldError('lastName', 'lastNameErr', 'Last name is required'); ok = false; }
  else { setFieldError('lastName', 'lastNameErr', ''); }

  if (!email || !emailRe.test(email)) { setFieldError('regEmail', 'regEmailErr', 'Please enter a valid email'); ok = false; }
  else { setFieldError('regEmail', 'regEmailErr', ''); }

  if (!phone || phone.replace(/\D/g, '').length < 7) { setFieldError('regPhone', 'regPhoneErr', 'Please enter a valid phone number'); ok = false; }
  else { setFieldError('regPhone', 'regPhoneErr', ''); }

  if (pw.length < 8) { setFieldError('regPassword', 'regPasswordErr', 'Password must be at least 8 characters'); ok = false; }
  else { setFieldError('regPassword', 'regPasswordErr', ''); }

  if (pw !== cpw) { setFieldError('regConfirm', 'regConfirmErr', 'Passwords do not match'); ok = false; }
  else if (cpw) { setFieldError('regConfirm', 'regConfirmErr', ''); }

  if (!agreed) { getEl('agreeErr').textContent = 'You must agree to the terms'; ok = false; }
  else { getEl('agreeErr').textContent = ''; }

  return ok;
}

var generatedOtp = '';
var storedUser = {};

getEl('registerBtn').addEventListener('click', async function() {
  if (!validateRegister()) { return; }
  var btn = getEl('registerBtn');
  setLoading(btn, true);
  await waitFor(1500);
  setLoading(btn, false);

  storedUser = {
    name: getEl('firstName').value.trim() + ' ' + getEl('lastName').value.trim(),
    email: getEl('regEmail').value.trim(),
    phone: getEl('regPhone').value.trim()
  };

  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Demo OTP:', generatedOtp);

  getEl('otpEmail').textContent = storedUser.email;
  showStep('step2');
  startResendTimer();
  setTimeout(function() { getAll('#otpBoxes .otp-box')[0].focus(); }, 100);
});

var otpBoxes = getAll('#otpBoxes .otp-box');

otpBoxes.forEach(function(box, i) {
  box.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').slice(-1);
    if (this.value) {
      this.classList.add('filled');
      if (i < otpBoxes.length - 1) { otpBoxes[i + 1].focus(); }
    } else {
      this.classList.remove('filled');
    }
  });

  box.addEventListener('keydown', function(e) {
    if (e.key === 'Backspace' && !this.value && i > 0) {
      otpBoxes[i - 1].focus();
      otpBoxes[i - 1].value = '';
      otpBoxes[i - 1].classList.remove('filled');
    }
    if (e.key === 'ArrowLeft' && i > 0) { otpBoxes[i - 1].focus(); }
    if (e.key === 'ArrowRight' && i < otpBoxes.length - 1) { otpBoxes[i + 1].focus(); }
  });

  box.addEventListener('paste', function(e) {
    e.preventDefault();
    var pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
    Array.from(pasted).slice(0, 6).forEach(function(ch, j) {
      if (otpBoxes[j]) { otpBoxes[j].value = ch; otpBoxes[j].classList.add('filled'); }
    });
    otpBoxes[Math.min(pasted.length, 5)].focus();
  });
});

getEl('verifyOtpBtn').addEventListener('click', async function() {
  var entered = Array.from(otpBoxes).map(function(b) { return b.value; }).join('');
  if (entered.length < 6) { getEl('otpErr').textContent = 'Please enter all 6 digits'; return; }
  getEl('otpErr').textContent = '';

  var btn = getEl('verifyOtpBtn');
  setLoading(btn, true);
  await waitFor(1200);
  setLoading(btn, false);

  if (entered === generatedOtp || entered === '123456') {
    showStep('step3');
    getEl('successDetails').innerHTML = '<strong>Name:</strong> ' + storedUser.name + '<br><strong>Email:</strong> ' + storedUser.email + '<br><strong>Phone:</strong> ' + storedUser.phone;
  } else {
    getEl('otpErr').textContent = 'Incorrect code. Use 123456 for this demo.';
    otpBoxes.forEach(function(b) { b.style.borderColor = '#e05252'; });
    setTimeout(function() { otpBoxes.forEach(function(b) { b.style.borderColor = ''; }); }, 1000);
  }
});

var resendInterval;
function startResendTimer() {
  var secs = 30;
  var timerEl = getEl('resendTimer');
  var resendBtn = getEl('resendOtp');
  resendBtn.disabled = true;
  resendBtn.style.opacity = '0.4';
  clearInterval(resendInterval);
  resendInterval = setInterval(function() {
    timerEl.textContent = '(' + secs + 's)';
    secs--;
    if (secs < 0) {
      clearInterval(resendInterval);
      timerEl.textContent = '';
      resendBtn.disabled = false;
      resendBtn.style.opacity = '1';
    }
  }, 1000);
}

getEl('resendOtp').addEventListener('click', function() {
  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('New OTP:', generatedOtp);
  showToast('Code resent. Use 123456 for demo.');
  startResendTimer();
  otpBoxes.forEach(function(b) { b.value = ''; b.classList.remove('filled'); });
  otpBoxes[0].focus();
});

getEl('goToDashboard').addEventListener('click', function() {
  closeModal(accountModal);
  showToast('Welcome to Smartpay!');
});

getEl('closeSuccess').addEventListener('click', function() { closeModal(accountModal); });

getEl('loginBtn').addEventListener('click', async function() {
  var email = getEl('loginEmail').value.trim();
  var pw = getEl('loginPassword').value;
  var ok = true;
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRe.test(email)) { setFieldError('loginEmail', 'loginEmailErr', 'Please enter a valid email'); ok = false; }
  else { setFieldError('loginEmail', 'loginEmailErr', ''); }

  if (!pw) { setFieldError('loginPassword', 'loginPasswordErr', 'Password is required'); ok = false; }
  else { setFieldError('loginPassword', 'loginPasswordErr', ''); }

  if (!ok) { return; }

  var btn = getEl('loginBtn');
  setLoading(btn, true);
  await waitFor(1400);
  setLoading(btn, false);

  closeModal(loginModal);
  showToast('Logged in successfully');
});

getEl('forgotPw').addEventListener('click', function() {
  var email = getEl('loginEmail').value.trim();
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && emailRe.test(email)) {
    showToast('Reset link sent to ' + email);
  } else {
    showToast('Enter your email first', 'error');
    getEl('loginEmail').focus();
  }
});

var videoOverlay = getEl('videoOverlay');
var videoModal = getEl('videoModal');
var YT_ID = 'SZEflIVnhH8';

getEl('heroWatchDemo').addEventListener('click', function() {
  getEl('videoIframe').src = 'https://www.youtube.com/embed/' + YT_ID + '?autoplay=1&rel=0&modestbranding=1';
  videoOverlay.classList.add('show');
  videoModal.classList.add('show');
  document.body.style.overflow = 'hidden';
});

function closeVideoModal() {
  var iframe = getEl('videoIframe');
  if (iframe) { iframe.src = ''; }
  videoOverlay.classList.remove('show');
  videoModal.classList.remove('show');
  document.body.style.overflow = '';
}

getEl('videoClose').addEventListener('click', closeVideoModal);
videoOverlay.addEventListener('click', closeVideoModal);

function showStep(id) {
  ['step1', 'step2', 'step3'].forEach(function(s) {
    var el = getEl(s);
    if (el) { el.classList.toggle('hidden', s !== id); }
  });
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal(accountModal);
    closeModal(loginModal);
    closeVideoModal();
    closeMobileMenu();
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }
});

getEl('regEmail').addEventListener('blur', function() {
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (this.value && !emailRe.test(this.value)) {
    setFieldError('regEmail', 'regEmailErr', 'Please enter a valid email');
  } else {
    setFieldError('regEmail', 'regEmailErr', '');
  }
});

getEl('regConfirm').addEventListener('input', function() {
  if (this.value && this.value !== getEl('regPassword').value) {
    setFieldError('regConfirm', 'regConfirmErr', 'Passwords do not match');
  } else {
    setFieldError('regConfirm', 'regConfirmErr', '');
  }
});