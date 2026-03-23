/**
 * PORTFÓLIO ÉRIKA — script.js
 * JavaScript puro (Vanilla JS), sem frameworks ou bibliotecas externas.
 *
 * Funcionalidades implementadas:
 *   1. Header com efeito de scroll (sombra ao rolar)
 *   2. Menu hamburguer responsivo (mobile)
 *   3. Destaque do link ativo na navegação (IntersectionObserver)
 *   4. Animações de entrada ao rolar (fade-in / timeline)
 *   5. Alternância de tema Claro/Escuro (Dark Mode)
 *   6. Validação do formulário de contato com mensagens de erro
 *   7. Simulação de envio e exibição de modal de sucesso
 */

// =============================================================
// UTILITÁRIO: Obtém elementos do DOM de forma segura
// =============================================================

/**
 * Seleciona um único elemento. Retorna null se não encontrado.
 * @param {string} seletor - Seletor CSS
 * @returns {Element|null}
 */
function qs(seletor) {
  return document.querySelector(seletor);
}

/**
 * Seleciona múltiplos elementos e retorna um Array.
 * @param {string} seletor - Seletor CSS
 * @returns {Element[]}
 */
function qsAll(seletor) {
  return Array.from(document.querySelectorAll(seletor));
}

// =============================================================
// 1. HEADER — EFEITO DE SCROLL
// Adiciona a classe "scrolled" ao header quando o usuário rola
// mais de 50px, ativando o fundo com blur definido no CSS.
// =============================================================

const header = qs('#header');

function atualizarHeader() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

// Ouve o evento de scroll para atualizar o header
window.addEventListener('scroll', atualizarHeader, { passive: true });

// Executa na carga inicial (caso a página já esteja rolada)
atualizarHeader();

// =============================================================
// 2. MENU HAMBURGUER — TOGGLE PARA MOBILE
// Ao clicar no botão hamburguer, abre/fecha o menu de navegação
// e anima o ícone para um "X".
// =============================================================

const hamburguer  = qs('#hamburger');
const navLinks    = qs('#navLinks');

hamburguer.addEventListener('click', function () {
  // Alterna as classes de estado aberto
  const estaAberto = navLinks.classList.toggle('aberto');
  hamburguer.classList.toggle('aberto', estaAberto);

  // Acessibilidade: indica ao leitor de tela o estado do menu
  hamburguer.setAttribute('aria-expanded', String(estaAberto));
});

// Fecha o menu ao clicar em qualquer link de navegação (mobile)
qsAll('.nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('aberto');
    hamburguer.classList.remove('aberto');
    hamburguer.setAttribute('aria-expanded', 'false');
  });
});

// =============================================================
// 3. LINK ATIVO NA NAVEGAÇÃO — INTERSECTION OBSERVER
// Observa as seções da página. Quando uma seção entra na
// viewport, o link correspondente no menu recebe a classe
// "ativo" para indicar visualmente onde o usuário está.
// =============================================================

const secoes   = qsAll('section[id]');
const linksNav = qsAll('.nav-link');

/**
 * Atualiza o link ativo com base no ID da seção visível.
 * @param {string} id - ID da seção atualmente visível
 */
function marcarLinkAtivo(id) {
  linksNav.forEach(function (link) {
    // O href do link é "#secao", então comparamos com "#" + id
    if (link.getAttribute('href') === '#' + id) {
      link.classList.add('ativo');
    } else {
      link.classList.remove('ativo');
    }
  });
}

// Configura o IntersectionObserver para as seções
const observerNavegacao = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      // Quando a seção está visível em ≥ 40% da viewport, marca o link
      if (entrada.isIntersecting) {
        marcarLinkAtivo(entrada.target.id);
      }
    });
  },
  { rootMargin: '-20% 0px -60% 0px' } // Janela de detecção
);

secoes.forEach(function (secao) {
  observerNavegacao.observe(secao);
});

// =============================================================
// 4. ANIMAÇÕES DE ENTRADA — INTERSECTION OBSERVER
// Elementos com a classe "fade-in" ou "timeline-item" entram
// animados (do CSS) quando surgem na viewport.
// =============================================================

// Observa elementos .fade-in (seção sobre, portfolio, contato)
const observerFade = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        // Para de observar após animar (otimização)
        observerFade.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.15 }
);

qsAll('.fade-in').forEach(function (el) {
  observerFade.observe(el);
});

// Observa os itens da timeline (formação)
const observerTimeline = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observerTimeline.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.2 }
);

qsAll('.timeline-item').forEach(function (item, indice) {
  // Delay escalonado: cada item aparece 150ms depois do anterior
  item.style.transitionDelay = indice * 150 + 'ms';
  observerTimeline.observe(item);
});

// Aplica fade-in nos cards de projeto e na seção contato
qsAll('.projeto-card, .section-header, .sobre-texto, .sobre-visual').forEach(
  function (el, i) {
    el.classList.add('fade-in');
    if (i < 3) el.classList.add('delay-' + (i + 1));
    observerFade.observe(el);
  }
);

// =============================================================
// 5. DARK MODE — ALTERNÂNCIA DE TEMA CLARO/ESCURO
// Manipula o atributo data-theme no elemento <html>.
// A preferência é salva no localStorage para persistir entre
// recarregamentos da página.
// =============================================================

const btnTema   = qs('#themeToggle');
const htmlRaiz  = document.documentElement; // Elemento <html>

// Chave usada para salvar preferência no localStorage
const CHAVE_TEMA = 'tema-portfolio-erika';

/**
 * Aplica o tema informado na interface.
 * @param {string} tema - 'light' ou 'dark'
 */
function aplicarTema(tema) {
  htmlRaiz.setAttribute('data-theme', tema);
  localStorage.setItem(CHAVE_TEMA, tema);
}

// Ao clicar no botão, alterna entre claro e escuro
btnTema.addEventListener('click', function () {
  const temaAtual = htmlRaiz.getAttribute('data-theme');
  const novoTema  = temaAtual === 'light' ? 'dark' : 'light';
  aplicarTema(novoTema);
});

// Na inicialização: carrega preferência salva OU usa preferência do SO
(function inicializarTema() {
  const temaSalvo    = localStorage.getItem(CHAVE_TEMA);
  const prefSistema  = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (temaSalvo) {
    // Usuário já definiu uma preferência → usa ela
    aplicarTema(temaSalvo);
  } else if (prefSistema) {
    // Sem preferência salva → respeita o SO
    aplicarTema('dark');
  }
  // Caso contrário, fica no 'light' definido no HTML
})();

// =============================================================
// 6. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
// Verifica se todos os campos foram preenchidos e se o e-mail
// tem formato válido antes de permitir o "envio".
// =============================================================

// Referências aos elementos do formulário
const form        = qs('#contatoForm');
const campoNome   = qs('#nome');
const campoEmail  = qs('#email');
const campoMsg    = qs('#mensagem');

// Referências às mensagens de erro
const erroNome    = qs('#erroNome');
const erroEmail   = qs('#erroEmail');
const erroMensagem= qs('#erroMensagem');

/**
 * Expressão regular para validar formato de e-mail.
 * Garante: usuario@dominio.extensao
 */
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Exibe uma mensagem de erro em um campo e aplica estilo de inválido.
 * @param {HTMLElement} campo    - O input/textarea
 * @param {HTMLElement} spanErro - O elemento <span> que mostra o erro
 * @param {string}      mensagem - Texto do erro
 */
function mostrarErro(campo, spanErro, mensagem) {
  campo.classList.add('invalido');
  spanErro.textContent = mensagem;
}

/**
 * Remove o estado de erro de um campo.
 * @param {HTMLElement} campo
 * @param {HTMLElement} spanErro
 */
function limparErro(campo, spanErro) {
  campo.classList.remove('invalido');
  spanErro.textContent = '';
}

/**
 * Valida todos os campos do formulário.
 * Exibe as mensagens de erro individuais para cada campo inválido.
 * @returns {boolean} true se todos os campos são válidos
 */
function validarFormulario() {
  let valido = true;

  // --- Validação do Nome ---
  const nome = campoNome.value.trim();
  if (nome === '') {
    mostrarErro(campoNome, erroNome, 'Por favor, informe seu nome.');
    valido = false;
  } else if (nome.length < 2) {
    mostrarErro(campoNome, erroNome, 'Nome deve ter pelo menos 2 caracteres.');
    valido = false;
  } else {
    limparErro(campoNome, erroNome);
  }

  // --- Validação do E-mail ---
  const email = campoEmail.value.trim();
  if (email === '') {
    mostrarErro(campoEmail, erroEmail, 'Por favor, informe seu e-mail.');
    valido = false;
  } else if (!REGEX_EMAIL.test(email)) {
    // Verifica se o e-mail tem o formato correto (ex: usuario@dominio.com)
    mostrarErro(campoEmail, erroEmail, 'Informe um e-mail válido (ex: usuario@dominio.com).');
    valido = false;
  } else {
    limparErro(campoEmail, erroEmail);
  }

  // --- Validação da Mensagem ---
  const mensagem = campoMsg.value.trim();
  if (mensagem === '') {
    mostrarErro(campoMsg, erroMensagem, 'Por favor, escreva sua mensagem.');
    valido = false;
  } else if (mensagem.length < 10) {
    mostrarErro(campoMsg, erroMensagem, 'A mensagem deve ter pelo menos 10 caracteres.');
    valido = false;
  } else {
    limparErro(campoMsg, erroMensagem);
  }

  return valido;
}

// Remove o estado de erro ao digitar (feedback em tempo real)
[campoNome, campoEmail, campoMsg].forEach(function (campo) {
  campo.addEventListener('input', function () {
    if (campo.classList.contains('invalido')) {
      campo.classList.remove('invalido');
    }
  });
});

// =============================================================
// 7. ENVIO DO FORMULÁRIO — SIMULAÇÃO E MODAL DE SUCESSO
// Ao submeter o formulário, valida os campos. Se tudo OK:
//   • Limpa os campos
//   • Exibe o modal de confirmação
// =============================================================

const modalSucesso = qs('#modalSucesso');
const btnFecharModal = qs('#fecharModal');

/**
 * Exibe o modal de sucesso com animação.
 */
function abrirModal() {
  modalSucesso.removeAttribute('hidden'); // Remove o atributo hidden
  // Pequeno delay para garantir que a transição CSS funcione
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      modalSucesso.classList.add('visivel');
    });
  });
}

/**
 * Fecha o modal com animação e o esconde.
 */
function fecharModal() {
  modalSucesso.classList.remove('visivel');
  // Aguarda a animação CSS terminar antes de aplicar hidden
  modalSucesso.addEventListener('transitionend', function handler() {
    modalSucesso.setAttribute('hidden', '');
    modalSucesso.removeEventListener('transitionend', handler);
  });
}

// Fecha o modal ao clicar no botão "Fechar"
btnFecharModal.addEventListener('click', fecharModal);

// Fecha o modal ao clicar no overlay (fora da caixa)
modalSucesso.addEventListener('click', function (evento) {
  // Verifica se o clique foi no overlay e não na caixa interna
  if (evento.target === modalSucesso) {
    fecharModal();
  }
});

// Fecha o modal com tecla Escape (acessibilidade)
document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape' && !modalSucesso.hasAttribute('hidden')) {
    fecharModal();
  }
});

// Listener principal: intercepta o submit do formulário
form.addEventListener('submit', function (evento) {
  // Previne o comportamento padrão (recarregar a página / enviar para servidor)
  evento.preventDefault();

  // Executa a validação de todos os campos
  const formularioValido = validarFormulario();

  if (formularioValido) {
    // ── SIMULAÇÃO DE ENVIO ──
    // Em um projeto real, aqui seria feita uma chamada fetch/AJAX para o backend.
    // Por enquanto, apenas simulamos o envio limpando o formulário.

    // Limpa todos os campos após o "envio"
    form.reset();

    // Garante que os estilos de erro também sejam removidos
    [campoNome, campoEmail, campoMsg].forEach(function (campo) {
      campo.classList.remove('invalido');
    });
    [erroNome, erroEmail, erroMensagem].forEach(function (span) {
      span.textContent = '';
    });

    // Exibe o modal de confirmação: "Mensagem enviada com sucesso!"
    abrirModal();
  } else {
    // Foca no primeiro campo inválido para melhor usabilidade
    const primeiroInvalido = form.querySelector('.invalido');
    if (primeiroInvalido) {
      primeiroInvalido.focus();
    }
  }
});
