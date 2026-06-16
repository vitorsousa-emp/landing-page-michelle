/* ================================================================
   WS Eventos — interações standalone (vanilla JS, sem libs)
   ================================================================ */


(function () {
  "use strict";

  const WHATSAPP_URL =
    "https://wa.me/558587669268?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20meu%20evento.";

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setYear();
    hideLoadingScreen();
    bindNavScroll();
    spawnParticles();
    renderServices();
    renderMessages();
    renderDiffs();
    renderGallery();
    bindRevealOnScroll();
    bindVideoModal();
    bindLightbox();
    bindFloatingCTA();
    bindModalEscape();
  }

  /* ---------- Footer year ---------- */
  function setYear() {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Loading screen ---------- */
  function hideLoadingScreen() {
    setTimeout(() => $("#loading")?.classList.add("is-hidden"), 2000);
  }

  /* ---------- Nav scroll state ---------- */
  function bindNavScroll() {
    const nav = $("#nav");
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Floating CTA visibility ---------- */
  function bindFloatingCTA() {
    const cta = $("#float-cta");
    const onScroll = () => cta.classList.toggle("is-visible", window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Hero gold particles (puro JS + CSS) ---------- */
  function spawnParticles() {
    const wrap = $("#particles");
    if (!wrap) return;
    const COUNT = 22;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const left = (i * 53) % 100;
      const delay = (i * 0.7) % 12;
      const duration = 12 + ((i * 1.3) % 10);
      const size = 2 + (i % 4);
      const s = document.createElement("span");
      s.style.left = left + "%";
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.opacity = "0.7";
      s.style.boxShadow = `0 0 ${size * 3}px var(--gold)`;
      s.style.animation = `float-up ${duration}s ${delay}s linear infinite`;
      frag.appendChild(s);
    }
    wrap.appendChild(frag);
  }

  /* ---------- Reveal-on-scroll (IntersectionObserver) ---------- */
  function bindRevealOnScroll() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = parseInt(e.target.dataset.delay || "0", 10);
            e.target.style.transitionDelay = delay + "ms";
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Services (expansíveis) ---------- */
  const SERVICES = [
    { icon: "🪩", title: "Bandas", desc: "Animação não vai faltar e toda estrutura de palco e luz está incluída." },
    { icon: "🍹", title: "Coqueteís ilimitados", desc: "Bar temático com drinks durante todo o evento" },
    { icon: "🎊", title: "Decoração", desc: "Vamos criar um ambiente com muitos cenários para registrar esse dia mágico." },
    { icon: "🎁", title: "Brindes", desc: "1. Foto do formando no painel da entrada do buffet 2. Brinde de champanhe para momento do Cerimonial 3. Prismas de identificação para sua mesa 4. Descontos especiais com nossos parceiros em aluguel de vestidos, ternos, smokings, anel, maquiagem etc." },
    { icon: "📸", title: "Cobertura fotografica", desc: "Registre cada momento do seu evento com um fotografo proficional" },
    { icon: "🍛", title: "buffet", desc: "Uma festa também tem que agradar o paladar dos convidados." },
  ];

  function renderServices() {
    const grid = $("#services-grid");
    if (!grid) return;
    SERVICES.forEach((s, i) => {
      const wrap = document.createElement("div");
      wrap.className = "reveal";
      wrap.dataset.delay = String(i * 80);
      wrap.innerHTML = `
        <button type="button" class="service-card">
          <div class="service-card__head">
            <div>
              <div class="service-card__icon">${s.icon}</div>
              <h3 class="service-card__title">${s.title}</h3>
            </div>
            <span class="service-card__toggle" aria-hidden="true">+</span>
          </div>
          <div class="service-card__body">
            <div class="service-card__body-inner">
              <div class="service-card__sep"></div>
              <p class="service-card__desc">${s.desc}</p>
            </div>
          </div>
        </button>
      `;
      const card = wrap.querySelector(".service-card");
      card.addEventListener("click", () => {
        // toggle apenas o card clicado (mesma UX do React: um aberto por vez)
        $$(".service-card.is-open").forEach((c) => c !== card && c.classList.remove("is-open"));
        card.classList.toggle("is-open");
      });
      grid.appendChild(wrap);
    });
  }

  /* ---------- Testimonials (mensagens WhatsApp-like) ---------- */
  /* ---------- Testimonials (cards arrastáveis) ---------- */
  const MESSAGES = [
    { name: "Mariana C.",     time: "casamento",        stars: 5, text: "A WS superou todas as nossas expectativas. Foi simplesmente perfeito." },
    { name: "Rafael & Júlia", time: "cerimônia",         stars: 5, text: "A tranquilidade de saber que tudo estava sob controle não tem preço." },
    { name: "Camila F.",      time: "aniversário",       stars: 5, text: "Faria tudo novamente com eles. Cada detalhe foi pensado com carinho." },
    { name: "Diretoria Vitra",time: "evento corporativo",stars: 5, text: "Profissionalismo absoluto. Nossos convidados ainda comentam o evento." },
  ];

  function renderMessages() {
    const track = $("#testiTrack");
    const dotsWrap = $("#testiDots");
    if (!track) return;

    MESSAGES.forEach((m) => {
      const card = document.createElement("div");
      card.className = "testi-card";
      card.innerHTML = `
        <div class="testi-card__stars">${"★".repeat(m.stars)}${"☆".repeat(5 - m.stars)}</div>
        <p class="testi-card__text">"${m.text}"</p>
        <div class="testi-card__footer">
          <span class="testi-card__name">${m.name}</span>
          <span class="dot">·</span>
          <span>${m.time}</span>
        </div>
      `;
      track.appendChild(card);
    });

    // bolinhas indicadoras
    if (dotsWrap) {
      MESSAGES.forEach((_, i) => {
        const d = document.createElement("span");
        d.className = "testi-dot" + (i === 0 ? " is-active" : "");
        dotsWrap.appendChild(d);
      });
    }

    bindDraggableTrack(track, dotsWrap);
  }

  /* ---------- Drag-to-scroll (mouse) + swipe nativo (touch) ---------- */
  
  function bindDraggableTrack(track, dotsWrap) {
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    // Mouse (desktop) — toque/swipe no celular já funciona nativamente via overflow-x
    track.addEventListener("mousedown", (e) => {
      isDown = true;
      track.classList.add("is-dragging");
      startX = e.pageX;
      scrollStart = track.scrollLeft;
    });
    window.addEventListener("mouseup", () => {
      isDown = false;
      track.classList.remove("is-dragging");
    });
    window.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const dx = e.pageX - startX;
      track.scrollLeft = scrollStart - dx;
    });

    // Atualiza a bolinha ativa conforme o scroll (mouse ou dedo)
    if (!dotsWrap) return;
    const dots = $$(".testi-dot", dotsWrap);
    const updateActiveDot = () => {
      const cardWidth = track.firstElementChild.getBoundingClientRect().width + 16; // +gap
      const index = Math.round(track.scrollLeft / cardWidth);
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    };
    track.addEventListener("scroll", () => {
      window.requestAnimationFrame(updateActiveDot);
    }, { passive: true });
  }

  /* ---------- Differentials ---------- */
  const DIFFS = [
    { i: "✦", t: "Atendimento próximo", d: "Personalizado, do primeiro contato ao último brinde." },
    { i: "❖", t: "Cuidado obsessivo", d: "Cada detalhe pensado, planejado e executado." },
    { i: "✧", t: "Equipe experiente", d: "Profissionais com bagagem em grandes celebrações." },
    { i: "❀", t: "Eventos exclusivos", d: "Nenhum evento é igual ao outro. Como deve ser." },
    { i: "✦", t: "Compromisso real", d: "Excelência não é meta — é ponto de partida." },
    { i: "❖", t: "Experiências que emocionam", d: "O que fica é a memória. E ela precisa ser perfeita." },
  ];

  function renderDiffs() {
    const grid = $("#diffs");
    if (!grid) return;
    DIFFS.forEach((d, i) => {
      const wrap = document.createElement("div");
      wrap.className = "reveal";
      wrap.dataset.delay = String(i * 60);
      wrap.innerHTML = `
        <div class="diff">
          <div class="diff__icon">${d.i}</div>
          <h3 class="diff__title">${d.t}</h3>
          <p class="diff__desc">${d.d}</p>
        </div>
      `;
      grid.appendChild(wrap);
    });
  }

  /* ---------- Gallery + Lightbox ---------- */
  const GALLERY = [
    { src: "images/gallery-1.jpg", alt: "Primeira dança em salão sofisticado", aspect: "34" },
    { src: "images/gallery-2.jpg", alt: "Mesa corporativa de gala", aspect: "11" },
    { src: "images/gallery-4.jpg", alt: "Cerimônia ao pôr do sol", aspect: "34" },
    { src: "images/gallery-3.jpg", alt: "Bolo de aniversário com folhas de ouro", aspect: "11" },
    { src: "images/hero-event.jpg", alt: "Mesa à luz de velas com flores bordô", aspect: "34" },
    { src: "images/about-event.jpg", alt: "Brinde de champanhe", aspect: "11" },
  ];

  function renderGallery() {
    const grid = $("#gallery");
    if (!grid) return;
    GALLERY.forEach((g, i) => {
      const wrap = document.createElement("div");
      wrap.className = "reveal";
      wrap.dataset.delay = String(i * 60);
      wrap.innerHTML = `
        <button type="button" class="gallery__item gallery__item--${g.aspect}" data-index="${i}">
          <img src="${g.src}" alt="${g.alt}" loading="lazy" />
        </button>
      `;
      grid.appendChild(wrap);
    });
  }

  function bindLightbox() {
    const modal = $("#lightbox");
    const img = $("#lightbox-img");
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery__item");
      if (!btn) return;
      const idx = Number(btn.dataset.index);
      const item = GALLERY[idx];
      if (!item) return;
      img.src = item.src;
      img.alt = item.alt;
      openModal(modal);
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.dataset.close !== undefined) closeModal(modal);
    });
  }

  /* ---------- Video modal ---------- */
  function bindVideoModal() {
    const modal = $("#video-modal");
    const iframe = $("#video-iframe");
    const SRC = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0";

    $("#video-open").addEventListener("click", () => {
      iframe.src = SRC;
      openModal(modal);
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.dataset.close !== undefined) {
        closeModal(modal);
        iframe.src = ""; // pausa o vídeo
      }
    });
  }

  /* ---------- Modal helpers ---------- */
  function openModal(m) {
    m.classList.add("is-open");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal(m) {
    m.classList.remove("is-open");
    m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function bindModalEscape() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      $$(".modal.is-open").forEach((m) => {
        closeModal(m);
        if (m.id === "video-modal") $("#video-iframe").src = "";
      });
    });
  }
})();
