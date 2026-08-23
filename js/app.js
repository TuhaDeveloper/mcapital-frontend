/**
 * mCapital — Premium Investment Platform
 * Handcrafted Institutional Logic & Interactive Modules
 */

let globalLeafletMap = null;

const REGION_COORDS = {
  'london': [51.5074, -0.1278],
  'dubai': [25.2048, 55.2708],
  'ny': [40.7128, -74.0060],
  'dhaka': [23.8103, 90.4125]
};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMarketplaceFilters();
  initOpportunityModal();
  initPortfolioDashboard();
  initHubSelector();
  initLeafletGlobalMap();
  initSearchOverlay();
  initScrollReveal();
  initCounterAnimation();
  initScrollSpy();
  initEcosystemProcessUI();
});

/* ==========================================================================
   01. NAVIGATION & QUICK SEARCH OVERLAY
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add('bg-brandDark/85', 'backdrop-blur-md', 'border-b', 'border-white/10', 'shadow-2xl', 'py-3');
      header.classList.remove('bg-transparent', 'border-transparent', 'py-4');
    } else {
      header.classList.remove('bg-brandDark/85', 'backdrop-blur-md', 'border-b', 'border-white/10', 'shadow-2xl', 'py-3');
      header.classList.add('bg-transparent', 'border-transparent', 'py-4');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial state check
}

function initSearchOverlay() {
  const searchBtn = document.getElementById('headerSearchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchCloseBtn = document.getElementById('searchCloseBtn');

  if (!searchOverlay) return;

  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
  }

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearch);
  }

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const resultsContainer = document.getElementById('searchResults');
      if (!resultsContainer) return;

      if (!term) {
        resultsContainer.innerHTML = '<span class="text-xs text-slate-400">Type a keyword to filter deal prospectuses...</span>';
        return;
      }

      let matches = [];
      if (term.includes('health') || term.includes('bd-hc') || term.includes('fund')) {
        matches.push({ title: 'Specialized Healthcare Infrastructure Fund II', ticker: 'BD-HC-2026', link: '#opportunities' });
      }
      if (term.includes('solar') || term.includes('energy') || term.includes('bd-en') || term.includes('direct')) {
        matches.push({ title: '500MW National Solar Grid Expansion Phase I', ticker: 'BD-EN-2026', link: '#opportunities' });
      }
      if (term.includes('dashboard') || term.includes('terminal') || term.includes('irr')) {
        matches.push({ title: 'Investor Portfolio Terminal', ticker: 'LIVE-VALUATION', link: '#dashboard' });
      }
      if (term.includes('hub') || term.includes('london') || term.includes('dubai') || term.includes('nrb')) {
        matches.push({ title: 'NRB Hosts & Global Advisory Network', ticker: '100-HUBS', link: '#global-hubs' });
      }

      if (matches.length > 0) {
        resultsContainer.innerHTML = matches.map(m => `
          <a href="${m.link}" onclick="closeSearch()" class="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-200/80 mb-2">
            <span class="text-[10px] font-mono font-bold text-brandTeal uppercase block mb-0.5">${m.ticker}</span>
            <span class="text-xs font-extrabold text-brandNavy block">${m.title}</span>
          </a>
        `).join('');
      } else {
        resultsContainer.innerHTML = '<span class="text-xs text-slate-400">No matching deals found. Try "Healthcare", "Solar", or "Terminal".</span>';
      }
    });
  }
}

function openSearch() {
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  if (searchOverlay) {
    searchOverlay.classList.add('active');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 100);
    }
  }
}

function closeSearch() {
  const searchOverlay = document.getElementById('searchOverlay');
  if (searchOverlay) {
    searchOverlay.classList.remove('active');
  }
}

/* ==========================================================================
   02. MARKETPLACE STRATEGY TAB FILTERING
   ========================================================================== */
function initMarketplaceFilters() {
  const tabLinks = document.querySelectorAll('.tab-link');
  const dealCards = document.querySelectorAll('.opportunity-card');

  tabLinks.forEach(tab => {
    tab.addEventListener('click', () => {
      tabLinks.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter.toLowerCase();
      
      dealCards.forEach(card => {
        const cat = card.dataset.category ? card.dataset.category.toLowerCase() : '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   03. DEAL PROSPECTUS MODAL DRAWER
   ========================================================================== */
const DEAL_DATA = {
  'healthcare-fund': {
    ticker: 'BD-HC-2026',
    title: 'Bangladesh Specialized Healthcare Infrastructure Fund II',
    sector: 'Healthcare & Diagnostic Infrastructure',
    location: 'Dhaka & Chittagong Commercial Hubs',
    size: '$100,000,000 USD',
    min: '$5,000 USD',
    irr: '16.8% Net Target IRR',
    tenure: '5 Years (Quarterly USD Dividends)',
    progress: '72% Subscribed ($72.0M raised)',
    overview: 'This institutional fund targets high-demand specialized medical diagnostic centers and tertiary oncology hospitals across secondary commercial hubs in Bangladesh. Supported by Bangladesh Bank outward repatriation guidelines.',
    highlights: [
      'Primary off-taker agreements with leading national health networks.',
      'Quarterly USD-denominated dividend payouts directly into foreign accounts.',
      'Independent custodian escrow by Standard Chartered Bank Trust Division.',
      'Comprehensive ESG compliance certified under UNDP frameworks.'
    ]
  },
  'solar-grid': {
    ticker: 'BD-EN-2026',
    title: '500MW National Solar Grid Expansion Phase I',
    sector: 'Clean Energy Infrastructure PPA',
    location: 'Sylhet Division',
    size: '$50,000,000 USD',
    min: '$15,000 USD',
    irr: '18.5% Net Target IRR',
    tenure: '7 Years',
    progress: '88% Subscribed ($44.0M raised)',
    overview: 'Utility-scale solar installation backed by a 20-year sovereign Power Purchase Agreement (PPA) with the Bangladesh Power Development Board (BPDB).',
    highlights: [
      '20-Year Sovereign PPA guarantee with sovereign credit rating alignment.',
      'Inflation-indexed dividend yield structures.',
      'Land acquisition and environmental clearance 100% complete.',
      'Co-invested alongside Asian Development Bank (ADB) syndicate.'
    ]
  }
};

function initOpportunityModal() {
  const modalOverlay = document.getElementById('oppModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContent = document.getElementById('modalContent');
  const triggerBtns = document.querySelectorAll('.open-opp-modal');

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const dealKey = btn.dataset.deal;
      const deal = DEAL_DATA[dealKey];
      if (deal) {
        renderModalContent(modalContent, deal);
        openModal(modalOverlay);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => closeModal(modalOverlay));
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal(modalOverlay);
    });
  }
}

function renderModalContent(container, deal) {
  container.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="deal-ticker" style="margin-bottom: 8px; display: inline-block;">[TICKER: ${deal.ticker}]</span>
      <h3 style="font-family: 'Newsreader', serif; font-size: 26px; font-weight: 400; color: #0B1F3B; margin-bottom: 4px;">${deal.title}</h3>
      <span style="font-size: 12px; color: #667085;">Sector: <strong>${deal.sector}</strong> • Location: <strong>${deal.location}</strong></span>
    </div>

    <table class="prospectus-table-specs" style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
      <tr style="border-bottom: 1px solid #E2E5EC;"><td style="padding: 8px 0; color: #667085;">Target Fund Size</td><td style="text-align: right; font-weight: 700; color: #0B1F3B;">${deal.size}</td></tr>
      <tr style="border-bottom: 1px solid #E2E5EC;"><td style="padding: 8px 0; color: #667085;">Min Commitment</td><td style="text-align: right; font-weight: 700; color: #0B1F3B;">${deal.min}</td></tr>
      <tr style="border-bottom: 1px solid #E2E5EC;"><td style="padding: 8px 0; color: #667085;">Target Net IRR</td><td style="text-align: right; font-weight: 700; color: #075C4C;">${deal.irr}</td></tr>
      <tr style="border-bottom: 1px solid #E2E5EC;"><td style="padding: 8px 0; color: #667085;">Tenure & Structure</td><td style="text-align: right; font-weight: 700; color: #0B1F3B;">${deal.tenure}</td></tr>
    </table>

    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 14px; font-weight: 600; color: #0B1F3B; margin-bottom: 6px;">Executive Summary</h4>
      <p style="font-size: 13px; color: #525E75; line-height: 1.6;">${deal.overview}</p>
    </div>

    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 14px; font-weight: 600; color: #0B1F3B; margin-bottom: 6px;">Institutional Due-Diligence Highlights</h4>
      <ul style="padding-left: 18px; font-size: 13px; color: #525E75; line-height: 1.6;">
        ${deal.highlights.map(h => `<li style="margin-bottom: 4px;">${h}</li>`).join('')}
      </ul>
    </div>

    <div style="display: flex; gap: 12px; border-top: 1px solid #E2E5EC; padding-top: 16px;">
      <a href="#get-started" class="btn btn-primary" style="flex: 1; text-align: center; background: #0B1F3B; color: #fff; padding: 12px; border-radius: 9999px; font-size: 13px; font-weight: 700;" onclick="closeModal(document.getElementById('oppModalOverlay'))">Commit Capital</a>
      <button class="btn btn-secondary" style="flex: 1; background: #FAF9F5; border: 1px solid #CBD5E1; color: #0B1F3B; padding: 12px; border-radius: 9999px; font-size: 13px; font-weight: 700;" onclick="alert('Downloading Data Room Prospectus (PDF)...')">Download Data Room</button>
    </div>
  `;
}

function openModal(overlay) {
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(overlay) {
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

/* ==========================================================================
   04. PORTFOLIO TERMINAL PERIOD SWITCHER
   ========================================================================== */
const PERIOD_DATA = {
  '1Y': {
    val: '$284,650',
    ret: '+$24,120',
    irr: '17.2%',
    moic: '1.24x',
    path: 'M60 170 Q 160 160, 260 145 T 460 110 T 640 60',
    poly: '60,170 160,160 260,145 360,130 460,110 560,85 640,60 640,190 60,190'
  },
  '3Y': {
    val: '$284,650',
    ret: '+$42,850',
    irr: '18.7%',
    moic: '1.42x',
    path: 'M60 180 Q 160 160, 260 135 T 460 75 T 640 42',
    poly: '60,180 160,160 260,135 360,110 460,75 560,55 640,42 640,190 60,190'
  },
  'ALL': {
    val: '$284,650',
    ret: '+$88,400',
    irr: '20.4%',
    moic: '1.68x',
    path: 'M60 185 Q 160 140, 260 110 T 460 60 T 640 30',
    poly: '60,185 160,140 260,110 360,85 460,60 560,45 640,30 640,190 60,190'
  }
};

function initPortfolioDashboard() {
  const periodBtns = document.querySelectorAll('.period-btn');
  const valEl = document.getElementById('dbPortfolioVal');
  const retEl = document.getElementById('dbTotalReturn');
  const irrEl = document.getElementById('dbIrr');
  const moicEl = document.getElementById('dbMoic');
  const chartPath = document.getElementById('chartPath');
  const chartArea = document.getElementById('chartArea');

  periodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      periodBtns.forEach(b => {
        b.classList.remove('active');
        b.classList.remove('bg-brandTeal');
        b.classList.add('text-slate-400');
      });

      btn.classList.add('active', 'bg-brandTeal');
      btn.classList.remove('text-slate-400');
      btn.classList.add('text-white');

      const period = btn.dataset.period;
      const data = PERIOD_DATA[period];

      if (data) {
        if (valEl) valEl.textContent = data.val;
        if (retEl) retEl.textContent = data.ret;
        if (irrEl) irrEl.textContent = data.irr;
        if (moicEl) moicEl.textContent = data.moic;

        if (chartPath && chartArea) {
          chartPath.setAttribute('d', data.path);
          chartArea.setAttribute('points', data.poly);
        }
      }
    });
  });
}

/* ==========================================================================
   05. LEAFLET INTERACTIVE GLOBAL MAP WITH TRAJECTORY ARCS
   ========================================================================== */
function initLeafletGlobalMap() {
  const mapContainer = document.getElementById('leafletGlobalMap');
  if (!mapContainer || typeof L === 'undefined') return;

  globalLeafletMap = L.map('leafletGlobalMap', {
    center: [23.0, 55.0],
    zoom: 2.3,
    minZoom: 1.5,
    maxZoom: 6,
    zoomControl: false,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB &copy; OpenStreetMap',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(globalLeafletMap);

  L.control.zoom({ position: 'bottomright' }).addTo(globalLeafletMap);

  const DHAKA = [23.8103, 90.4125];

  const HUBS = [
    { name: 'London HQ', lat: 51.5074, lng: -0.1278, count: '3,450' },
    { name: 'Dubai DIFC', lat: 25.2048, lng: 55.2708, count: '4,800' },
    { name: 'New York', lat: 40.7128, lng: -74.0060, count: '2,600' },
    { name: 'Toronto', lat: 43.6532, lng: -79.3832, count: '1,200' },
    { name: 'Geneva', lat: 46.2044, lng: 6.1432, count: '850' },
    { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, count: '920' },
    { name: 'Riyadh', lat: 24.7136, lng: 46.6753, count: '3,100' },
    { name: 'Jeddah', lat: 21.5433, lng: 39.1728, count: '1,800' },
    { name: 'Doha', lat: 25.2854, lng: 51.5310, count: '1,650' },
    { name: 'Abu Dhabi', lat: 24.4539, lng: 54.3773, count: '1,400' },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198, count: '1,150' },
    { name: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869, count: '1,950' },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, count: '640' }
  ];

  const dhakaIcon = L.divIcon({
    className: 'custom-dhaka-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <span class="absolute w-12 h-12 rounded-full bg-red-500/40 animate-ping"></span>
        <span class="absolute w-8 h-8 rounded-full bg-accentLime/50 animate-pulse"></span>
        <span class="relative w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg"></span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const dhakaMarker = L.marker(DHAKA, { icon: dhakaIcon }).addTo(globalLeafletMap);
  dhakaMarker.bindTooltip('<div class="px-3 py-1 font-black text-xs bg-red-600 text-white rounded-lg shadow-xl">DHAKA CAPITAL HQ 🇧🇩</div>', {
    permanent: true,
    direction: 'top',
    offset: [0, -12]
  });

  HUBS.forEach(hub => {
    const latlngs = getCurvedPoints(DHAKA, [hub.lat, hub.lng]);
    L.polyline(latlngs, {
      color: '#A8F01D',
      weight: 1.5,
      opacity: 0.55,
      dashArray: '4, 6'
    }).addTo(globalLeafletMap);

    const hubIcon = L.divIcon({
      className: 'custom-hub-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-5 h-5 rounded-full bg-accentLime/40 animate-ping"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-accentLime border border-slate-900 shadow-md"></span>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const marker = L.marker([hub.lat, hub.lng], { icon: hubIcon }).addTo(globalLeafletMap);
    marker.bindTooltip(`
      <div class="p-2 bg-slate-900 text-white rounded-xl shadow-2xl border border-white/10 text-xs">
        <strong class="block text-accentLime font-bold">${hub.name}</strong>
        <span class="text-[11px] text-slate-300">${hub.count} Verified NRB Investors</span>
      </div>
    `, { direction: 'top', offset: [0, -6] });
  });
}

function getCurvedPoints(start, end) {
  const points = [];
  const lat1 = start[0], lng1 = start[1];
  const lat2 = end[0], lng2 = end[1];

  const midLat = (lat1 + lat2) / 2 + (lng2 > lng1 ? 10 : -10);
  const midLng = (lng1 + lng2) / 2;

  for (let t = 0; t <= 1; t += 0.05) {
    const lat = Math.pow(1 - t, 2) * lat1 + 2 * (1 - t) * t * midLat + Math.pow(t, 2) * lat2;
    const lng = Math.pow(1 - t, 2) * lng1 + 2 * (1 - t) * t * midLng + Math.pow(t, 2) * lng2;
    points.push([lat, lng]);
  }
  return points;
}

function initHubSelector() {
  const hubCards = document.querySelectorAll('.hub-card');
  hubCards.forEach(card => {
    card.addEventListener('click', () => {
      hubCards.forEach(c => c.classList.remove('ring-2', 'ring-accentLime', 'bg-white/10'));
      card.classList.add('ring-2', 'ring-accentLime', 'bg-white/10');

      const region = card.dataset.region;
      const coords = REGION_COORDS[region];
      if (coords && globalLeafletMap) {
        globalLeafletMap.flyTo(coords, 4.5, { duration: 1.5 });
      }
    });
  });
}

/* ==========================================================================
   08. SMOOTH SCROLL REVEAL & HERO SCROLLSPY TAB TRACKER
   ========================================================================== */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up').forEach(el => {
    observer.observe(el);
  });
}

function initScrollSpy() {
  const tabs = document.querySelectorAll('.hero-tab-pill');
  if (!tabs.length) return;

  const sections = [
    document.getElementById('trust-leadership'),
    document.getElementById('opportunities'),
    document.getElementById('get-started')
  ];

  window.addEventListener('scroll', () => {
    let currentSectionIdx = 0;
    const scrollPos = window.scrollY + 250;

    sections.forEach((sec, idx) => {
      if (sec && scrollPos >= sec.offsetTop) {
        currentSectionIdx = idx;
      }
    });

    tabs.forEach((tab, idx) => {
      if (idx === currentSectionIdx) {
        tab.classList.add('bg-white', 'text-slate-950', 'shadow-lg');
        tab.classList.remove('bg-white/10', 'text-white/90');
      } else {
        tab.classList.remove('bg-white', 'text-slate-950', 'shadow-lg');
        tab.classList.add('bg-white/10', 'text-white/90');
      }
    });
  });
}

/* ==========================================================================
   09. ECOSYSTEM PROCESS UI INTERACTIVE WORKFLOW
   ========================================================================== */
function initEcosystemProcessUI() {
  const stepBtns = document.querySelectorAll('.eco-step-btn');
  const stepCards = document.querySelectorAll('.eco-card');
  const titleEl = document.getElementById('ecoProcessTitle');
  const badgeEl = document.getElementById('ecoProcessBadge');
  const contentEl = document.getElementById('ecoProcessContent');

  if (!stepCards.length) return;

  const PROCESS_DATA = {
    1: {
      title: "Stage 01 — NRB Investor / mCapital Member Allocation",
      badge: "ACTIVE STAGE 1 OF 4",
      col1: { label: "Primary Responsibility", text: "Non-Resident Bangladeshi investors accessing institutionally curated Funds and direct Private Equity deals." },
      col2: { label: "Compliance & Custody", text: "Escrow-backed commitments protected by Bangladesh Bank FX repatriation guidelines & BSEC regulations." },
      col3: { label: "Ecosystem Outcome", text: "Instant digital onboarding, automated quarterly dividends, and full portfolio visibility." }
    },
    2: {
      title: "Stage 02 — Investment Sponsor Deal Origination",
      badge: "ACTIVE STAGE 2 OF 4",
      col1: { label: "Primary Responsibility", text: "Sponsors who propose and champion vetted high-growth infrastructure, tech, and impact investments for platform funding." },
      col2: { label: "Diligence & Milestone", text: "5-step independent due diligence, prospectus verification, and milestone-tranche capital disbursement." },
      col3: { label: "Ecosystem Outcome", text: "Direct diaspora capital syndication and transparent milestone reporting to all backers." }
    },
    3: {
      title: "Stage 03 — Fund Manager Structuring & Governance",
      badge: "ACTIVE STAGE 3 OF 4",
      col1: { label: "Primary Responsibility", text: "Licensed professionals who structure institutional PE Funds, manage capital calls, and oversee portfolio assets." },
      col2: { label: "Governance Engine", text: "Audit oversight, automated capital calls, and transparent valuation benchmarks (IRR & MOIC)." },
      col3: { label: "Ecosystem Outcome", text: "Seamless automated distribution of dividends and quarterly audited performance reports." }
    },
    4: {
      title: "Stage 04 — NRB Host Global Advisory Hubs",
      badge: "ACTIVE STAGE 4 OF 4",
      col1: { label: "Primary Responsibility", text: "Local hosts operating our network of 100 global advisory hubs across 30 countries worldwide." },
      col2: { label: "Community & Concierge", text: "In-person investor onboarding, local currency advice, and private banking concierge access." },
      col3: { label: "Ecosystem Outcome", text: "Global presence with local trust — bridging diaspora members in UK, US, UAE, and Asia." }
    }
  };

  function activateStep(stepNum) {
    stepBtns.forEach(btn => {
      const bStep = btn.dataset.step;
      const circle = btn.querySelector('div');
      const text = btn.querySelector('span');
      if (bStep === String(stepNum)) {
        btn.classList.add('active');
        if (circle) circle.className = "w-12 h-12 rounded-full bg-brandNavy text-white font-mono text-sm font-extrabold flex items-center justify-center shadow-lg ring-4 ring-[#FAF9F5] scale-110 transition-all";
        if (text) text.className = "text-xs font-black uppercase text-brandNavy tracking-wider";
      } else {
        btn.classList.remove('active');
        if (circle) circle.className = "w-12 h-12 rounded-full bg-white border-2 border-slate-300 text-slate-700 font-mono text-sm font-extrabold flex items-center justify-center shadow-md ring-4 ring-[#FAF9F5] hover:border-brandTeal hover:text-brandTeal transition-all";
        if (text) text.className = "text-xs font-bold uppercase text-slate-500 tracking-wider hover:text-brandNavy";
      }
    });

    stepCards.forEach(card => {
      const cStep = card.dataset.stepCard;
      const stepBadge = card.querySelector('span.font-mono');
      if (cStep === String(stepNum)) {
        card.classList.add('border-2', 'border-brandNavy', 'shadow-xl');
        card.classList.remove('border-slate-200/90', 'shadow-sm');
        if (stepBadge) stepBadge.className = "font-mono text-xs font-black text-white bg-brandNavy px-3 py-1 rounded-full uppercase";
      } else {
        card.classList.remove('border-2', 'border-brandNavy', 'shadow-xl');
        card.classList.add('border-slate-200/90', 'shadow-sm');
        if (stepBadge) stepBadge.className = "font-mono text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full uppercase";
      }
    });

    const data = PROCESS_DATA[stepNum];
    if (data && titleEl && badgeEl && contentEl) {
      titleEl.textContent = data.title;
      badgeEl.textContent = data.badge;
      contentEl.innerHTML = `
        <div class="bg-white/5 p-6 rounded-2xl border border-white/10">
          <span class="text-[11px] font-bold text-slate-400 uppercase block mb-2">${data.col1.label}</span>
          <p class="text-sm text-slate-200 font-medium">${data.col1.text}</p>
        </div>
        <div class="bg-white/5 p-6 rounded-2xl border border-white/10">
          <span class="text-[11px] font-bold text-slate-400 uppercase block mb-2">${data.col2.label}</span>
          <p class="text-sm text-slate-200 font-medium">${data.col2.text}</p>
        </div>
        <div class="bg-white/5 p-6 rounded-2xl border border-white/10">
          <span class="text-[11px] font-bold text-slate-400 uppercase block mb-2">${data.col3.label}</span>
          <p class="text-sm text-accentLime font-extrabold">${data.col3.text}</p>
        </div>
      `;
    }
  }

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.dataset.step;
      activateStep(step);
    });
  });

  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      const step = card.dataset.stepCard;
      activateStep(step);
    });
  });
}

/* ==========================================================================
   08. SCROLL REVEAL INTERSECTION OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   09. METRICS COUNTER ANIMATION
   ========================================================================== */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const formatComma = el.dataset.format === 'comma';
    const duration = 2000;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = target * easeProgress;

      let formattedVal = currentVal.toFixed(decimals);
      if (formatComma) {
        formattedVal = Math.floor(currentVal).toLocaleString('en-US');
      }

      el.textContent = `${prefix}${formattedVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        let finalVal = target.toFixed(decimals);
        if (formatComma) {
          finalVal = target.toLocaleString('en-US');
        }
        el.textContent = `${prefix}${finalVal}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observerOptions = {
    root: null,
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}


