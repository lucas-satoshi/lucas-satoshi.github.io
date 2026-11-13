/**
 * LUCAS SATOSHI CIPRIANO OIKAWA | PORTFÓLIO INTERATIVO
 * Script Core: Gerenciamento de Temas, Filtros, Navegação e Interações
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. GERENCIAMENTO DE TEMA (DARK / LIGHT MODE) COM LOCALSTORAGE
    // -------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Detectar tema salvo ou preferência do sistema operacional
    const savedTheme = localStorage.getItem('oikawa-portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (!prefersDark) {
        htmlElement.setAttribute('data-theme', 'light');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('oikawa-portfolio-theme', targetTheme);
        });
    }

    // -------------------------------------------------------------------------
    // 2. BARRA DE PROGRESSO DE ROLAGEM & BOTÃO VOLTAR AO TOPO
    // -------------------------------------------------------------------------
    const scrollProgressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (scrollHeight > 0 && scrollProgressBar) {
            const progress = (scrollTop / scrollHeight) * 100;
            scrollProgressBar.style.width = `${progress}%`;
        }

        if (backToTopBtn) {
            if (scrollTop > 450) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // -------------------------------------------------------------------------
    // 3. MENU MOBILE DRAWER
    // -------------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen.toString());
            mobileNav.setAttribute('aria-hidden', (!isOpen).toString());
        });

        // Fechar menu mobile ao clicar em um link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
            });
        });
    }

    // -------------------------------------------------------------------------
    // 4. COPIAR E-MAIL COM FEEDBACK VISUAL
    // -------------------------------------------------------------------------
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyTooltip = document.getElementById('copy-tooltip');
    const emailToCopy = 'lucas.satoshi.18@gmail.com';

    if (copyEmailBtn && copyTooltip) {
        copyEmailBtn.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(emailToCopy);
                } else {
                    // Fallback para ambientes restritos
                    const textArea = document.createElement('textarea');
                    textArea.value = emailToCopy;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    textArea.remove();
                }

                copyTooltip.textContent = 'Copiado!';
                copyTooltip.classList.add('show');

                setTimeout(() => {
                    copyTooltip.textContent = 'Copiar';
                    copyTooltip.classList.remove('show');
                }, 2200);
            } catch (err) {
                console.error('Falha ao copiar:', err);
                copyTooltip.textContent = 'Erro ao copiar';
                copyTooltip.classList.add('show');
                setTimeout(() => {
                    copyTooltip.classList.remove('show');
                }, 2000);
            }
        });
    }

    // -------------------------------------------------------------------------
    // 5. FILTROS INTERATIVOS DE PROJETOS
    // -------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.portfolio-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Atualiza estado visual dos botões
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Filtra os cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transition = 'opacity 0.25s ease';
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------------------
    // 6. DESTAQUE AUTOMÁTICO DE LINK ATIVO NA NAVEGAÇÃO (INTERSECTION OBSERVER)
    // -------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${currentId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // -------------------------------------------------------------------------
    // 7. FEEDBACK INTERATIVO DO FORMULÁRIO DE CONTATO (FORMSPREE)
    // -------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit-btn');

    if (contactForm && formStatus && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalBtnContent = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Enviando mensagem...</span>`;
            formStatus.className = 'form-status-msg';
            formStatus.style.display = 'none';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Mensagem enviada com sucesso! Em breve entrarei em contato.';
                    formStatus.className = 'form-status-msg success';
                    contactForm.reset();
                } else {
                    formStatus.textContent = 'Houve uma falha ao enviar. Por favor, tente enviar pelo WhatsApp ou e-mail direto.';
                    formStatus.className = 'form-status-msg error';
                }
            } catch (error) {
                formStatus.textContent = 'Erro de conexão. Por favor, envie uma mensagem diretamente para lucas.satoshi.18@gmail.com.';
                formStatus.className = 'form-status-msg error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                formStatus.style.display = 'block';
            }
        });
    }
});

