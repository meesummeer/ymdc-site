document.getElementById('year').textContent = new Date().getFullYear();

// Subtle shadow on nav after scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(26,10,110,0.08)' : 'none';
});

const WA_NUMBER = '923356733777';

// ---------- Department data (doctor assignments match the Doctors section) ----------
const DEPARTMENTS = {
  dental: {
    icon: '🦷',
    name: 'Dental Care',
    desc: 'General dentistry, root canal treatment, crowns, fillings, and paediatric dental care — for both children and adults.',
    doctors: [
      { name: 'Dr. Yusra Ali', qual: 'BDS — Paediatric Dentist & Aesthetic Practitioner', avail: 'Mon–Sat, 1:00pm – 9:00pm' },
      { name: 'Dr. Ali Moiz', qual: 'BDS, Dental Surgeon', avail: 'Mon–Sat, 1:00pm – 9:00pm' }
    ]
  },
  aesthetics: {
    icon: '✨',
    name: 'Aesthetics & Skin',
    desc: 'Hydrafacial, whitening drip, and glutathione infusion treatments for skin brightening and rejuvenation.',
    doctors: [
      { name: 'Dr. Salman Ali Ahmad', qual: 'MBBS, PAADS Certified Aesthetic Consultant & General Physician', avail: 'Mon–Fri, 3:30pm – 6:00pm' },
      { name: 'Dr. Yusra Ali', qual: 'BDS — Aesthetic Practitioner', avail: 'Mon–Sat, 1:00pm – 9:00pm' }
    ]
  },
  gynae: {
    icon: '👩‍⚕️',
    name: 'Gynaecology',
    desc: 'Consultant gynaecologists and sonologists providing women\'s health consultations and ultrasound-based diagnostics.',
    doctors: [
      { name: 'Dr. Aneela Shaikh', qual: 'MBBS, MCPS, Gynaecologist & Sonologist', avail: 'Mon–Sat, 3:00pm – 5:00pm' },
      { name: 'Dr. Mahjabeen Suhail', qual: 'MBBS, RMP, Gynaecologist & General Physician', avail: 'Mon–Sat, 9:30am – 12:30pm' }
    ]
  },
  ent: {
    icon: '👂',
    name: 'ENT',
    desc: 'Ear, nose & throat consultation and surgical care.',
    doctors: [
      { name: 'Dr. Anwer Majeed', qual: 'DLO, MCPS, ENT Surgeon', avail: 'Mon–Sat, 6:30pm – 9:30pm' }
    ]
  },
  pediatrics: {
    icon: '🧒',
    name: 'Pediatrics',
    desc: 'Family physician consultation for children, alongside paediatric dental care.',
    doctors: [
      { name: 'Dr. A.J. Panhwar', qual: 'MBBS, Family Physician', avail: 'Mon–Sat, 10:00am – 1:00pm' },
      { name: 'Dr. Yusra Ali', qual: 'BDS — Paediatric Dentist', avail: 'Mon–Sat, 1:00pm – 9:00pm' }
    ]
  },
  ortho: {
    icon: '🦴',
    name: 'Orthopedics',
    desc: 'Orthopaedic surgery consultation and treatment for bone, joint, and musculoskeletal conditions.',
    doctors: [
      { name: 'Dr. Sheikh Imran', qual: 'FCPS, Orthopaedic Surgeon', avail: 'Mon, Wed & Fri, 6:30pm – 7:30pm' }
    ]
  },
  imaging: {
    icon: '🩻',
    name: 'Ultrasound & X-Ray',
    desc: 'On-site digital X-ray and ultrasound imaging, with sonologist-reviewed reporting.',
    doctors: [
      { name: 'Dr. Tara Chand', qual: 'MBBS, Sonologist', avail: 'Mon–Sat, 6:00pm – 9:00pm' }
    ]
  },
  lab: {
    icon: '🔬',
    name: 'Laboratory & Diagnostics',
    desc: 'Full sample collection and diagnostic processing on-site, with home collection available on request.',
    doctors: []
  },
  physio: {
    icon: '🏃',
    name: 'Physiotherapy',
    desc: 'Manual and sports therapy with rehabilitation specialists for injury recovery and mobility support.',
    doctors: [
      { name: 'Dr. Rashid Ali Chandio', qual: 'DPT, MSK, Manual & Sports Therapy (Physiotherapist)', avail: 'Mon–Sat, 5:00pm – 10:00pm' },
      { name: 'Dr. Hafiza Sundas', qual: 'DPT, Rehab & MT Specialist', avail: 'Mon–Sat, 5:00pm – 10:00pm' }
    ]
  },
  eye: {
    icon: '👁️',
    name: 'Eye Care',
    desc: 'Eye specialists and surgeons for vision correction, screening, and eye health.',
    doctors: [
      { name: 'Farrukh', qual: 'Optometrist', avail: 'Mon–Sat, 1:00pm – 3:00pm' },
      { name: 'Dr. Maqbool Hussain', qual: 'Eye Surgeon', avail: 'Tuesday, 6:00pm – 8:00pm' }
    ]
  }
};

// ---------- Render department cards ----------
const deptGrid = document.getElementById('deptGrid');
Object.entries(DEPARTMENTS).forEach(([key, d]) => {
  const card = document.createElement('button');
  card.className = 'dept-card';
  card.setAttribute('onclick', `openDept('${key}')`);
  card.innerHTML = `
    <span class="dept-icon">${d.icon}</span>
    <h3>${d.name}</h3>
    <p>${d.desc}</p>
    <span class="learn">Doctors & availability →</span>
  `;
  deptGrid.appendChild(card);
});

// ---------- Department modal ----------
function openDept(key) {
  const d = DEPARTMENTS[key];
  const overlay = document.getElementById('deptModalOverlay');
  const content = document.getElementById('deptModalContent');

  const waMsg = encodeURIComponent(`Hi, I'd like to book an appointment for ${d.name}`);
  const doctorsHtml = d.doctors.length
    ? `<div class="doctor-list-title">Available Doctors</div>` + d.doctors.map(doc => `
        <div class="doc-row">
          <h4>${doc.name}</h4>
          <p class="qual">${doc.qual}</p>
          <p class="avail">🕒 ${doc.avail}</p>
        </div>`).join('')
    : `<p class="desc" style="margin-top:-10px;">On-site technicians handle this department daily — no fixed consultant schedule. Message us to confirm timing.</p>`;

  content.innerHTML = `
    <button class="dept-modal-close" onclick="closeDept()" aria-label="Close">✕</button>
    <span class="icon">${d.icon}</span>
    <h3>${d.name}</h3>
    <p class="desc">${d.desc}</p>
    ${doctorsHtml}
    <a href="https://wa.me/${WA_NUMBER}?text=${waMsg}" class="btn btn-gold" target="_blank" rel="noopener">📱 Book on WhatsApp</a>
  `;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDept() {
  document.getElementById('deptModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDept(); });

// ---------- Carousel arrows (promos + prosthetics) ----------
function scrollCarousel(id, dir) {
  const el = document.getElementById(id);
  const slide = el.children[0];
  const styles = getComputedStyle(el);
  const gap = parseFloat(styles.columnGap || styles.gap) || 0;
  const amount = slide ? slide.getBoundingClientRect().width + gap : 320;
  el.scrollBy({ left: dir * amount, behavior: 'smooth' });
}
