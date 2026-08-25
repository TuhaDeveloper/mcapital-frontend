/* ============================================================
 * mCapital — Private Investor Live Chat Concierge (chat.js)
 * ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLiveChatConcierge();
});

function initLiveChatConcierge() {
  if (!document.getElementById('mcapitalChatContainer')) {
    injectChatWidgetHTML();
  }

  const triggerBtn = document.getElementById('mcapitalChatTrigger');
  const chatWindow = document.getElementById('mcapitalChatWindow');
  const closeBtn = document.getElementById('mcapitalChatClose');
  const chatMessages = document.getElementById('mcapitalChatMessages');
  const chatInput = document.getElementById('mcapitalChatInput');
  const chatForm = document.getElementById('mcapitalChatForm');

  if (!triggerBtn || !chatWindow) return;

  let isOpen = false;

  function openChat() {
    isOpen = true;
    chatWindow.style.display = 'flex';
    requestAnimationFrame(() => {
      chatWindow.classList.remove('opacity-0', 'scale-95', 'translate-y-6', 'pointer-events-none');
      chatWindow.classList.add('opacity-100', 'scale-100', 'translate-y-0', 'pointer-events-auto');
    });
    // Hide trigger button completely when chat is open to avoid any overlap or clutter
    triggerBtn.style.display = 'none';
    if (chatInput) chatInput.focus();
  }

  function closeChat() {
    isOpen = false;
    chatWindow.classList.add('opacity-0', 'scale-95', 'translate-y-6', 'pointer-events-none');
    chatWindow.classList.remove('opacity-100', 'scale-100', 'translate-y-0', 'pointer-events-auto');
    
    setTimeout(() => {
      if (!isOpen) {
        chatWindow.style.display = 'none';
        triggerBtn.style.display = 'flex';
      }
    }, 250);
  }

  triggerBtn.addEventListener('click', openChat);
  if (closeBtn) closeBtn.addEventListener('click', closeChat);

  // Quick FAQ Prompt Chips
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.chat-quick-prompt');
    if (chip) {
      const question = chip.getAttribute('data-question') || chip.innerText.trim();
      handleUserMessage(question);
    }
  });

  // Chat Form Submission
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = chatInput.value.trim();
      if (!msg) return;
      chatInput.value = '';
      handleUserMessage(msg);
    });
  }

  function handleUserMessage(text) {
    appendMessage(text, 'user');
    const typingId = showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator(typingId);
      const answer = generateAdvisorResponse(text);
      appendMessage(answer, 'bot');
    }, 800);
  }

  function appendMessage(content, sender) {
    if (!chatMessages) return;
    const msgEl = document.createElement('div');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sender === 'user') {
      msgEl.className = 'flex flex-col items-end space-y-1';
      msgEl.innerHTML = `
        <div class="bg-midnight text-white text-xs sm:text-sm px-4 py-2.5 rounded-2xl rounded-tr-xs max-w-[85%] shadow-sm border border-white/10 text-left leading-relaxed">
          ${escapeHtml(content)}
        </div>
        <span class="text-[10px] text-slate-400 mr-1">${time}</span>
      `;
    } else {
      msgEl.className = 'flex items-start gap-2.5';
      msgEl.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-midnight border border-gold-500/50 flex items-center justify-center text-gold-400 text-xs shrink-0 mt-0.5 font-bold shadow-xs">
          m
        </div>
        <div class="flex flex-col items-start space-y-1 max-w-[85%]">
          <div class="bg-slate-100 text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/80 leading-relaxed text-left">
            ${content}
          </div>
          <span class="text-[10px] text-slate-400 ml-1">${time} · mCapital Advisor</span>
        </div>
      `;
    }

    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const id = 'typing_' + Date.now();
    const typingEl = document.createElement('div');
    typingEl.id = id;
    typingEl.className = 'flex items-start gap-2.5';
    typingEl.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-midnight border border-gold-500/50 flex items-center justify-center text-gold-400 text-xs shrink-0 mt-0.5 font-bold">
        m
      </div>
      <div class="bg-slate-100 text-slate-500 px-4 py-3 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-xs border border-slate-200/80">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 0.2s"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 0.4s"></span>
      </div>
    `;
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function generateAdvisorResponse(q) {
    const lower = q.toLowerCase();

    if (lower.includes('minimum') || lower.includes('min investment') || lower.includes('how much') || lower.includes('cost') || lower.includes('amount')) {
      return `Our minimum ticket size starts from <strong>$5,000 USD</strong> for Managed Funds, and <strong>$10,000 USD</strong> for Direct Enterprise Co-investments. Capital can be deposited from any international bank account.`;
    }

    if (lower.includes('bsec') || lower.includes('safe') || lower.includes('security') || lower.includes('guarantee') || lower.includes('protection') || lower.includes('scam')) {
      return `Your capital is 100% safeguarded under <strong>Bangladesh Securities and Exchange Commission (BSEC)</strong> audited escrow accounts, managed by institutional trustees and guided by former Bangladesh Bank leadership.`;
    }

    if (lower.includes('host') || lower.includes('nrb host') || lower.includes('hub') || lower.includes('community')) {
      return `We have 100 global hubs across 30 countries! To apply to lead or host your city's local diaspora chapter, please visit our <a href="signup.html" class="text-gold-700 font-bold underline">Host Application Portal</a> or email <strong>hosts@mcapital.com</strong>.`;
    }

    if (lower.includes('return') || lower.includes('irr') || lower.includes('profit') || lower.includes('interest') || lower.includes('yield')) {
      return `Our historical target net IRR ranges between <strong>16.8% to 24.5%</strong> across master funds and commercial turnaround portfolios. Distributions are paid directly in USD or BDT.`;
    }

    if (lower.includes('account') || lower.includes('register') || lower.includes('sign up') || lower.includes('join')) {
      return `You can open your sovereign investor account in under 2 minutes! <a href="signup.html" class="inline-block mt-1 font-bold text-midnight underline">Click here to Create Free Account →</a>`;
    }

    return `Thank you for your inquiry! A dedicated mCapital Wealth Advisor is available for direct consultation. You can also chat with our private desk on WhatsApp at <a href="https://wa.me/8801700000000" target="_blank" class="text-emerald-700 font-bold underline">+880 1700-000000</a>.`;
  }

  function escapeHtml(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

/**
 * Injects Chat Widget Markup into DOM
 */
function injectChatWidgetHTML() {
  const container = document.createElement('div');
  container.id = 'mcapitalChatContainer';
  container.className = 'fixed bottom-6 right-6 z-50';

  container.innerHTML = `
    <!-- FLOATING CHAT POPUP WINDOW (Hidden by default) -->
    <div id="mcapitalChatWindow" style="display: none;" class="opacity-0 scale-95 translate-y-6 pointer-events-none transition-all duration-300 origin-bottom-right w-[92vw] sm:w-[380px] h-[520px] max-h-[calc(100vh-100px)] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col justify-between overflow-hidden">
      
      <!-- Chat Header -->
      <div class="bg-midnight text-white p-4 px-5 flex items-center justify-between border-b border-white/10 shrink-0">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="w-9 h-9 rounded-full bg-white/10 border border-gold-500/40 flex items-center justify-center text-gold-400 font-black text-sm">
              m
            </div>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-midnight absolute bottom-0 right-0"></span>
          </div>
          <div class="text-left">
            <h4 class="text-sm font-bold text-white flex items-center gap-1.5">
              <span>mCapital Concierge</span>
              <i class="fa-solid fa-circle-check text-gold-400 text-xs"></i>
            </h4>
            <p class="text-[11px] text-slate-300">● Online · 24/7 Diaspora Support</p>
          </div>
        </div>

        <button id="mcapitalChatClose" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer" title="Close Chat">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      <!-- Chat Messages Body Container -->
      <div id="mcapitalChatMessages" class="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-left">
        
        <!-- Welcome Message from Advisor -->
        <div class="flex items-start gap-2.5">
          <div class="w-8 h-8 rounded-full bg-midnight border border-gold-500/50 flex items-center justify-center text-gold-400 text-xs shrink-0 mt-0.5 font-bold shadow-xs">
            m
          </div>
          <div class="flex flex-col items-start space-y-1 max-w-[90%]">
            <div class="bg-slate-100 text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/80 leading-relaxed text-left">
              Welcome to <strong>mCapital</strong>! 👋 How can we assist with your diaspora wealth allocation or fund onboarding today?
            </div>
            <span class="text-[10px] text-slate-400 ml-1">Live Advisor Concierge</span>
          </div>
        </div>

        <!-- Quick FAQ Prompt Chips -->
        <div class="space-y-2 pt-1 pl-10">
          <p class="text-[11px] text-slate-400 uppercase font-semibold">Common questions:</p>
          <div class="flex flex-col gap-1.5">
            <button class="chat-quick-prompt text-left text-xs px-3.5 py-2 rounded-xl bg-amber-50/80 hover:bg-amber-100 text-gold-800 border border-amber-200 transition-colors cursor-pointer" data-question="What is the minimum investment?">
              👉 What is the minimum investment?
            </button>
            <button class="chat-quick-prompt text-left text-xs px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer" data-question="How is my money secured by BSEC?">
              👉 How is my money secured by BSEC?
            </button>
            <button class="chat-quick-prompt text-left text-xs px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer" data-question="What are your historical returns (IRR)?">
              👉 What are your historical returns (IRR)?
            </button>
          </div>
        </div>

      </div>

      <!-- Chat Bottom Input Area -->
      <div class="p-3 bg-white border-t border-slate-200 shrink-0">
        <form id="mcapitalChatForm" class="flex items-center gap-2">
          <input 
            type="text" 
            id="mcapitalChatInput" 
            placeholder="Type your question..." 
            class="flex-1 pl-3.5 pr-2 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20"
          >
          <button 
            type="submit" 
            class="w-10 h-10 rounded-xl bg-midnight hover:bg-gold-600 text-white flex items-center justify-center transition-colors shrink-0 shadow-sm cursor-pointer"
            title="Send Message"
          >
            <i class="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </form>
        <div class="flex items-center justify-between pt-2 px-1 text-[10px] text-slate-400">
          <span>🔒 256-bit Secure Encryption</span>
          <a href="https://wa.me/8801700000000" target="_blank" class="text-emerald-700 font-bold hover:underline">
            <i class="fa-brands fa-whatsapp mr-0.5"></i> WhatsApp Desk
          </a>
        </div>
      </div>

    </div>

    <!-- FLOATING TRIGGER BUTTON -->
    <button 
      id="mcapitalChatTrigger" 
      class="flex items-center gap-3 px-5 py-3 rounded-full bg-midnight hover:bg-[#13253d] text-white border border-gold-500/50 shadow-xl shadow-midnight/30 hover:shadow-2xl transition-all duration-300 cursor-pointer"
      title="Ask an Advisor"
    >
      <div class="relative flex items-center justify-center">
        <i class="fa-solid fa-headset text-base text-gold-400"></i>
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-midnight absolute -top-0.5 -right-0.5 animate-pulse"></span>
      </div>
      <div class="text-left hidden sm:block">
        <span class="text-xs font-bold text-white block leading-tight">Ask an Advisor</span>
        <span class="text-[10px] text-gold-400 block leading-tight">● 24/7 Live Concierge</span>
      </div>
    </button>
  `;

  document.body.appendChild(container);
}
