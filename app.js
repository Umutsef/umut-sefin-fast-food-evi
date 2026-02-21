// Sayfalar arası geçiş ve etkileşim mantığı
const ADMIN_LOGIN_ENDPOINT = 'http://localhost:8787/api/admin-login';

function setActiveNav(id) {
  document.querySelectorAll('a[data-page]').forEach((link) => {
    const isActive = link.dataset.page === id;
    link.classList.toggle('active-link', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function showPage(id) {
  const target = document.getElementById(id);
  if (!target) {
    id = 'home';
  }

  document.querySelectorAll('.page-content').forEach((content) => {
    content.classList.remove('active');
  });

  const current = document.getElementById(id);
  if (!current) return;
  current.classList.add('active');
  setActiveNav(id);

  if (id === 'admin-panel') {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-content').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminMessage').style.display = 'none';
  }

  window.location.hash = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loginAdmin(event) {
  event.preventDefault();
  const passwordInput = document.getElementById('adminPassword');
  const messageDiv = document.getElementById('adminMessage');
  const enteredPassword = passwordInput.value.trim();

  if (!enteredPassword) {
    messageDiv.className = 'message error';
    messageDiv.textContent = 'Lütfen şifrenizi girin.';
    messageDiv.style.display = 'block';
    return false;
  }

  try {
    const response = await fetch(ADMIN_LOGIN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: enteredPassword })
    });

    if (!response.ok) {
      throw new Error('Kimlik doğrulama başarısız.');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Yanlış şifre.');
    }

    messageDiv.className = 'message success';
    messageDiv.textContent = 'Giriş başarılı! Yönetici paneline yönlendiriliyorsunuz...';
    messageDiv.style.display = 'block';
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
  } catch (error) {
    messageDiv.className = 'message error';
    messageDiv.textContent = 'Giriş yapılamadı. Lütfen yönetici API servisini kontrol edin.';
    messageDiv.style.display = 'block';
    passwordInput.value = '';
  }

  return false;
}

function toggleAnswer(button) {
  const answer = button.nextElementSibling;
  const isOpen = button.getAttribute('aria-expanded') === 'true';

  document.querySelectorAll('.faq-question').forEach((q) => q.setAttribute('aria-expanded', 'false'));
  document.querySelectorAll('.faq-answer').forEach((ans) => {
    ans.style.display = 'none';
  });

  if (!isOpen) {
    button.setAttribute('aria-expanded', 'true');
    answer.style.display = 'block';
  }
}

function setupNavigation() {
  document.querySelectorAll('[data-page]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      showPage(element.dataset.page);
    });
  });
}

function setupFaq() {
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => toggleAnswer(button));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupFaq();

  const requestedPage = window.location.hash ? window.location.hash.substring(1) : 'home';
  showPage(requestedPage);

  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', loginAdmin);
  }
});
