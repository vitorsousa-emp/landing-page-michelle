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
    bindRevealOnScroll();   // ← primeiro: cria o observer
    renderGallery();
    spawnParticles();
    renderServices();
    renderMessages();
    renderDiffs();
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
    setTimeout(() => $("#loading")?.classList.add("is-hidden"), 800);
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
    const isMobile = window.innerWidth < 640;
    const COUNT = isMobile ? 8 : 18;
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
  let revealIO = null;

  function bindRevealOnScroll() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }
    revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = parseInt(e.target.dataset.delay || "0", 10);
            e.target.style.transitionDelay = delay + "ms";
            e.target.classList.add("is-in");
            revealIO.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" }
    );
    $$(".reveal").forEach((el) => revealIO.observe(el));
  }

  function observeNewReveals(container) {
    if (!revealIO) return;
    $$(".reveal", container).forEach((el) => revealIO.observe(el));
  }

  /* ---------- Services (expansíveis) ---------- */
  const SERVICES = [
    { img: "images/banda-img.jpg", title: "Banda ao vivo", desc: "Do primeiro ao último acorde, a energia da noite é garantida. Estrutura completa de palco, iluminação e som profissional inclusos." },
    { img: "images/drinks-img.jpg", title: "Drinks ilimitados", desc: "Bar temático com drinques, drinks sem álcool e bebidas durante toda a noite. Sem limite, sem preocupação." },
    { img: "images/decoracao.jpg", title: "Decoração exclusiva", desc: "Cenários elaborados para cada momento da noite: entrada, mesa dos formandos, área de fotos e muito mais." },
    { img: "images/brindes.jpeg", title: "Brindes inclusos", desc: "Foto do formando no painel de entrada · Brinde de champanhe no cerimonial · Prisma de identificação na mesa · Descontos com parceiros (vestido, terno, maquiagem e muito mais)." },
    { img: "images/fotografico.jpeg", title: "Cobertura fotográfica", desc: "Cada abraço, cada lágrima, cada sorriso registrado por fotógrafo profissional. Memórias que você vai querer guardar para sempre." },
    { img: "images/buffet.png", title: "Buffet completo", desc: "Uma noite inesquecível também passa pelo paladar. Cardápio sofisticado pensado para agradar todos os seus convidados." },
  ];

  function renderServices() {
    const grid = $("#services-grid");
    if (!grid) return;
    SERVICES.forEach((s, i) => {
      const wrap = document.createElement("div");
      wrap.className = "reveal";
      wrap.dataset.delay = String(i * 40);
      wrap.innerHTML = `
      <button type="button" class="service-card">
        <div class="service-card__head">
          <div>
            <img src="${s.img}" alt="${s.title}" class="service-card__img" loading="lazy" decoding="async" />
            <h3 class="service-card__title"><span class="italic"> ${s.title}</span></h3>
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
        $$(".service-card.is-open").forEach((c) => c !== card && c.classList.remove("is-open"));
        card.classList.toggle("is-open");
      });
      grid.appendChild(wrap);
    });
    observeNewReveals(grid);
  }

  /* ---------- Testimonials (cards arrastáveis) ---------- */
  const MESSAGES = [
    { name: "Steffany", stars: 5, text: "Simplesmente impecáveis! A festa foi incrivel e não ha palavras suficientes para descrever o compromisso e qualidade do time @wseventosfortaleza Obrigada por essa festa perfeita, foi 100000 / 10" },
    { name: "Julia", stars: 5, text: "Boa noite! Passando apenas para agradecer à equipe da WS pelo cuidado e pela paciência em todos os momentos. Esse tipo de atitude fez toda a diferença para tornar a sessão mais leve, divertida e confortável." },
    { name: "Lucas .", stars: 5, text: "Boa noite! Realmente foi uma experiência única para vários e a realização de um sonho, queríamos agradecer a equipe por tudo oq fizeram, nos sentimos muito acolhidos e a vontade, foram vários momentos muito diverditos que vão ficar na memória para sempre." },
    { name: "Jenny", stars: 5, text: "Boa noite! A gente gostaria de agradecer à empresa por ter proporcionado esse momento maravilhoso e muito especial. Com a maior atenção, delicadeza organização possível, foi tu lindo e maravilhoso, Estamos muito gratos, gostamos muito e nos divertimos bastante. " },
    { name: "arthur", stars: 5, text: "Boa noite! Hoje o dia foi incrível! Obrigado a equipe de profissionais expecionais e incríveis que nos auxiliaram o dia inteiro. Em nome da turma, eu falo que estamos extremamente gratos!" },
    { name: "Mariah", stars: 5, text: "Boa noite, a experiência foi incrível, a recepção da equipe e dos fotógrafos foram maravilhosos, estávamos muitos felizes ontem e já estamos ansiosos para receber nossas fotos" },
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

    // garante que o container pai (.testi-track-wrap.reveal) apareça
    const wrap = track.closest(".testi-track-wrap");
    if (wrap && revealIO) revealIO.observe(wrap);
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

    // Navegação por setas (desktop only)
    const wrap2 = track.parentElement;
    const prevBtn = document.createElement("button");
    const nextBtn = document.createElement("button");
    prevBtn.className = "testi-arrow testi-arrow--prev is-disabled";
    prevBtn.innerHTML = "‹";
    prevBtn.setAttribute("aria-label", "Anterior");
    nextBtn.className = "testi-arrow testi-arrow--next";
    nextBtn.innerHTML = "›";
    nextBtn.setAttribute("aria-label", "Próximo");
    wrap2.appendChild(prevBtn);
    wrap2.appendChild(nextBtn);

    let desktopIndex = 0;
    const PER_PAGE = 3;
    const total = track.children.length;
    const pages = Math.ceil(total / PER_PAGE);

    function goToPage(page) {
      desktopIndex = Math.max(0, Math.min(page, pages - 1));
      const cardW = track.children[0]?.offsetWidth + 24 || 0;
      track.style.transform = `translateX(-${desktopIndex * PER_PAGE * cardW}px)`;
      prevBtn.classList.toggle("is-disabled", desktopIndex === 0);
      nextBtn.classList.toggle("is-disabled", desktopIndex >= pages - 1);
    }

    prevBtn.addEventListener("click", () => goToPage(desktopIndex - 1));
    nextBtn.addEventListener("click", () => goToPage(desktopIndex + 1));
  }

  /* ---------- Differentials ---------- */
  const DIFFS = [
    { i: "✦", t: "Adesão individual, experiência completa", d: "Você se inscreve sozinho e vive uma noite completa com estrutura de formatura de verdade." },
    { i: "❖", t: "Sem dependência de turma", d: "Não precisa convencer ninguém. Sua decisão é sua. Sua celebração também." },
    { i: "✧", t: "Família e amigos bem-vindos", d: "Leve quem você quer ao seu lado nessa noite. O evento é seu e a memória é de todos." },
    { i: "❀", t: "Segurança e planejamento garantidos", d: "Mais de 22.000 eventos realizados. Você está em mãos experientes, do primeiro contato ao último brinde." },
    { i: "✦", t: "Tudo incluso, sem surpresas", d: "Banda, buffet, open bar, decoração, foto e brindes. Uma única adesão, uma noite completa." },
    { i: "❖", t: "Uma noite feita para você", d: "Do primeiro brinde à última música, cada detalhe é pensado para que você viva a formatura que merece." },
  ];

  function renderDiffs() {
    const grid = $("#diffs");
    if (!grid) return;
    DIFFS.forEach((d, i) => {
      const item = document.createElement("div");
      item.className = "diff reveal";
      item.dataset.delay = String(i * 60);
      item.innerHTML = `
      <div class="diff__head">
        <div class="diff__num">0${i + 1}</div>
        <h3 class="diff__title">${d.t}</h3>
        <div class="diff__arrow">+</div>
      </div>
      <div class="diff__body">
        <div class="diff__body-inner">
          <p class="diff__desc">${d.d}</p>
        </div>
      </div>
    `;
      item.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        $$(".diff.is-open").forEach(el => el.classList.remove("is-open"));
        if (!isOpen) item.classList.add("is-open");
      });
      grid.appendChild(item);
    });
    observeNewReveals(grid);
  }

  /* ---------- Gallery — painel de histórias interativo ---------- */
  const GALLERY = [
    { src: "images/etapa1.jpg", title: "A entrada", },
    { src: "images/etapa2.jpg", title: "A mesa de gala", desc: "Cenário pensado para reunir formandos e família num único brinde." },
    { src: "images/etapa3.jpg", title: "O pôr do sol", desc: "Fotos que ficam para sempre, no horário em que a luz é mais bonita." },
    { src: "images/etapa4.jpg", title: "O brinde de ouro", desc: "Champanhe, folhas douradas e o sabor da conquista." },
    { src: "images/etapa5.jpg", title: "A noite", desc: "Velas, flores bordô e a atmosfera que transforma uma festa em memória." },
    { src: "images/etapa6.jpg", title: "O encontro", desc: "Pessoas que se conhecem ou não, unidas por uma mesma celebração." },
    { src: "images/etapa7.jpg" },
    { src: "images/etapa8.jpg" },
    { src: "images/etapa9.JPG" },
    { src: "images/etapa10.JPG" },
  ];

  function renderGallery() {
    const wrap = $("#gallery");
    if (!wrap) return;

    GALLERY.forEach((g, i) => {
      const panel = document.createElement("div");
      panel.className = "gallery-panel" + (i === 0 ? " is-active" : "");
      panel.dataset.index = String(i);
      panel.innerHTML = `
        <img src="${g.src}" " class="gallery-panel__img" loading="${i < 2 ? 'eager' : 'lazy'}" 
        fetchpriority="${i < 2 ? 'high' : 'auto'}" decoding="async" />
        <span class="gallery-panel__num">0${i + 1}</span>
        <span class="gallery-panel__hint">+</span>
        <div class="gallery-panel__caption">
          
          
        </div>
      `;
      wrap.appendChild(panel);
    });

    bindGalleryPanels(wrap);
  }

  function bindGalleryPanels(wrap) {
    const panels = $$(".gallery-panel", wrap);
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    const openLightbox = (idx) => {
      const item = GALLERY[idx];
      const modal = $("#lightbox");
      const img = $("#lightbox-img");
      img.src = item.src;
      img.alt = item.title;
      openModal(modal);
    };

    panels.forEach((panel) => {
      // Desktop: hover expande o painel
      panel.addEventListener("mouseenter", () => {
        if (isMobile()) return;
        panels.forEach((p) => p.classList.remove("is-active"));
        panel.classList.add("is-active");
      });

      // Desktop: clique abre lightbox
      panel.addEventListener("click", () => {
        if (!isMobile()) {
          openLightbox(Number(panel.dataset.index));
          return;
        }
        // Mobile: primeiro toque expande, segundo toque abre lightbox
        if (panel.classList.contains("is-active")) {
          openLightbox(Number(panel.dataset.index));
        } else {
          panels.forEach((p) => p.classList.remove("is-active"));
          panel.classList.add("is-active");
          panel.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
      });
    });

    // estado inicial: primeiro painel ativo
    panels[0]?.classList.add("is-active");

    // dots de navegação no mobile
    if (isMobile()) buildGalleryDots(wrap, panels);

    // atualiza dot ativo ao arrastar
    wrap.addEventListener("scroll", () => {
      if (!isMobile()) return;
      const panelW = panels[0]?.getBoundingClientRect().width + 8 || 1;
      const idx = Math.min(
        Math.round(wrap.scrollLeft / panelW),
        panels.length - 1
      );
      panels.forEach((p, i) => p.classList.toggle("is-active", i === idx));
      $$(".gallery-dot").forEach((d, i) => d.classList.toggle("is-active", i === idx));
    }, { passive: true });
  }

  function buildGalleryDots(wrap, panels) {
    const existing = $("#gallery-dots");
    if (existing) existing.remove();
    const dots = document.createElement("div");
    dots.id = "gallery-dots";
    dots.className = "gallery-dots";
    panels.forEach((_, i) => {
      const d = document.createElement("span");
      d.className = "gallery-dot" + (i === 0 ? " is-active" : "");
      d.addEventListener("click", () => {
        const panelW = panels[0]?.offsetWidth + 8 || 0;
        wrap.scrollTo({ left: i * panelW, behavior: "smooth" });
      });
      dots.appendChild(d);
    });
    wrap.parentElement.appendChild(dots);
  }

  function bindLightbox() {
    const modal = $("#lightbox");
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.dataset.close !== undefined) closeModal(modal);
    });
  }
  /* ---------- Video modal ---------- */
  function bindVideoModal() {
    const modal = $("#video-modal");
    const iframe = $("#video-iframe");
    const SRC = "https://www.youtube.com/embed/n-0AUck4Vl4?autoplay=1&rel=0&modestbranding=1";
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