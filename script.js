/* ===== Configuração =====
   Troque pelo seu e-mail: é para ele que a mensagem do formulário será enviada. */
const MEU_EMAIL = "seuemail@exemplo.com";

/* ===== 1. Menu responsivo (celular) ===== */
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

function fecharMenu() {
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menu");
}

navToggle.addEventListener("click", () => {
  const aberto = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(aberto));
  navToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});

navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", fecharMenu));

/* ===== 2. Destaca no menu a seção que está na tela ===== */
const links = document.querySelectorAll(".nav__link");
const secoes = document.querySelectorAll("main section[id]");

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + entrada.target.id));
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
secoes.forEach((s) => observador.observe(s));

/* ===== 3. Imagens: esconde o aviso quando a imagem existe ===== */
document.querySelectorAll(".photo-frame img, .project__thumb img").forEach((img) => {
  const marcar = () => img.parentElement.classList.add("has-image");
  const esconder = () => (img.style.display = "none");

  if (img.complete) {
    img.naturalWidth > 0 ? marcar() : esconder();
  } else {
    img.addEventListener("load", marcar);
    img.addEventListener("error", esconder);
  }
});

/* ===== 4. Formulário de contato ===== */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

const regras = {
  email: {
    valido: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
    msg: "Digite um e-mail válido, como voce@email.com.",
  },
  telefone: {
    valido: (v) => {
      const n = v.replace(/\D/g, "");
      return n.length === 10 || n.length === 11;
    },
    msg: "Digite o telefone com DDD, por exemplo (11) 91234-5678.",
  },
  mensagem: {
    valido: (v) => v.trim().length >= 10,
    msg: "Escreva uma mensagem com pelo menos 10 caracteres.",
  },
};

function validarCampo(nome) {
  const campo = form.elements[nome];
  const ok = regras[nome].valido(campo.value);
  campo.closest(".field").classList.toggle("has-error", !ok);
  document.getElementById(nome + "-error").textContent = ok ? "" : regras[nome].msg;
  return ok;
}

/* Máscara do telefone: (00) 00000-0000 */
form.elements.telefone.addEventListener("input", (e) => {
  let n = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (n.length > 10) n = n.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  else if (n.length > 6) n = n.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  else if (n.length > 2) n = n.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  else if (n.length > 0) n = n.replace(/^(\d{0,2})/, "($1");
  e.target.value = n;
});

/* Valida ao sair do campo e corrige enquanto digita se já havia erro */
Object.keys(regras).forEach((nome) => {
  const campo = form.elements[nome];
  campo.addEventListener("blur", () => validarCampo(nome));
  campo.addEventListener("input", () => {
    if (campo.closest(".field").classList.contains("has-error")) validarCampo(nome);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.className = "form__status";

  const todosValidos = Object.keys(regras).map(validarCampo).every(Boolean);
  if (!todosValidos) {
    status.textContent = "Revise os campos destacados e tente de novo.";
    status.classList.add("is-error");
    return;
  }

  /* Abre o app de e-mail do visitante com a mensagem pronta.
     Para enviar sem abrir o app de e-mail, troque por um serviço como Formspree ou EmailJS. */
  const { email, telefone, mensagem } = form.elements;
  const corpo = `${mensagem.value}\n\nE-mail: ${email.value}\nTelefone: ${telefone.value}`;
  window.location.href = `mailto:${MEU_EMAIL}?subject=${encodeURIComponent("Contato pelo portfólio")}&body=${encodeURIComponent(corpo)}`;

  status.textContent = "Mensagem pronta! Confirme o envio no seu app de e-mail.";
  status.classList.add("is-success");
  form.reset();
});

/* ===== 5. Ano atual no rodapé ===== */
document.getElementById("year").textContent = new Date().getFullYear();
