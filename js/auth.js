/* ============================================================
 * mCapital — Authentication & Onboarding Utilities (auth.js)
 * ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initPasswordStrengthMeter();
  initAuthFormSubmissions();
});

/**
 * 1. Password Visibility Toggle
 */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetInputId = btn.getAttribute('data-target');
      const input = document.getElementById(targetInputId);
      if (!input) return;

      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');

      const icon = btn.querySelector('i');
      if (icon) {
        if (isPassword) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    });
  });
}

/**
 * 2. Real-time Password Strength Meter
 */
function initPasswordStrengthMeter() {
  const passwordInput = document.getElementById('signupPassword');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  if (!passwordInput || !strengthBar || !strengthText) return;

  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    if (!val) {
      strengthBar.style.width = '0%';
      strengthBar.className = 'h-1.5 rounded-full transition-all duration-300 bg-slate-200';
      strengthText.textContent = 'Password must be at least 8 characters';
      strengthText.className = 'text-[11px] font-mono text-slate-400 block';
      return;
    }

    let score = 0;
    if (val.length >= 8) score += 1;
    if (/[A-Z]/.test(val)) score += 1;
    if (/[0-9]/.test(val)) score += 1;
    if (/[^A-Za-z0-9]/.test(val)) score += 1;

    if (score === 1) {
      strengthBar.style.width = '25%';
      strengthBar.className = 'h-1.5 rounded-full transition-all duration-300 bg-red-500';
      strengthText.textContent = 'Weak — add uppercase, numbers, or symbols';
      strengthText.className = 'text-[11px] font-mono text-red-500 block';
    } else if (score === 2) {
      strengthBar.style.width = '50%';
      strengthBar.className = 'h-1.5 rounded-full transition-all duration-300 bg-amber-500';
      strengthText.textContent = 'Fair — add special symbols or numbers';
      strengthText.className = 'text-[11px] font-mono text-amber-600 block';
    } else if (score === 3) {
      strengthBar.style.width = '75%';
      strengthBar.className = 'h-1.5 rounded-full transition-all duration-300 bg-blue-600';
      strengthText.textContent = 'Good — institutional security level';
      strengthText.className = 'text-[11px] font-mono text-blue-600 block';
    } else if (score === 4) {
      strengthBar.style.width = '100%';
      strengthBar.className = 'h-1.5 rounded-full transition-all duration-300 bg-emerald-500';
      strengthText.textContent = 'Strong — sovereign-grade security';
      strengthText.className = 'text-[11px] font-mono text-emerald-600 font-bold block';
    }
  });
}

/**
 * 3. Form Submission Simulation & Toast Feedback
 */
function initAuthFormSubmissions() {
  const signinForm = document.getElementById('signinForm');
  if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = signinForm.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-flex items-center gap-2">
          <i class="fa-solid fa-circle-notch fa-spin text-sm"></i>
          <span>Authenticating...</span>
        </span>
      `;

      setTimeout(() => {
        showToast('Login Successful!', 'Welcome back to mCapital. Redirecting to your dashboard...');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      }, 1000);
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-flex items-center gap-2">
          <i class="fa-solid fa-circle-notch fa-spin text-sm"></i>
          <span>Creating your account...</span>
        </span>
      `;

      setTimeout(() => {
        showToast('Account Created Successfully!', 'Welcome to mCapital! Redirecting to setup your profile...');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1600);
      }, 1200);
    });
  }
}

/**
 * Global Toast Notification Helper
 */
function showToast(title, message) {
  let toast = document.getElementById('authToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'authToast';
    toast.className = 'fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 max-w-sm bg-midnight border border-gold-500/40 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-3';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-gold-600/20 border border-gold-500 flex items-center justify-center text-gold-400 shrink-0 mt-0.5">
      <i class="fa-solid fa-check text-xs"></i>
    </div>
    <div class="space-y-0.5 text-left">
      <h5 class="text-sm font-bold text-white">${title}</h5>
      <p class="text-xs text-slate-300 leading-relaxed font-normal">${message}</p>
    </div>
  `;

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 4000);
}
