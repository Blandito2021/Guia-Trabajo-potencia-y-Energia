/* ==========================================================================
   APLICACIÓN PRINCIPAL: ORQUESTADOR GENERAL Y EXPERIENCIA DE USUARIO
   Coordinación: Prof. Luis Hernando Blandón Dávila - Coordinador Física PAFEM
   Colegios: I.E. Diego Maya Salazar, I.E. Jaime Salazar Robledo, I.E. Hugo Ángel Mejía
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Simuladores de Física
  initAllSimulators();

  // 2. Inicializar Taller Evaluativo
  QuizManager.init();

  // 3. Inicializar Navegación entre Hojas (Paginación 1 a 8 con Scroll y Progreso)
  initNavigation();

  // 4. Inicializar Selector de 6 Temas Visuales
  initThemeManager();

  // 5. Inicializar Formulario y Perfil del Estudiante
  initStudentProfile();

  // 6. Inicializar Visor de Imágenes en Pantalla Completa (Lightbox)
  initImageLightbox();

  // 7. Inicializar Acciones de Exportación a PDF y Envío de Resultados
  initExportAndSubmission();

  // 8. Renderizar Tipografía Matemática KaTeX
  renderKaTeXFormulas();

  // 9. Botón flotante para volver arriba y barra de progreso
  initBackToTopAndProgress();
});

/* ==========================================================================
   1. INICIALIZACIÓN DE SIMULADORES INTERACTIVOS
   ========================================================================== */
function initAllSimulators() {
  window.simWork = new WorkSimulator('workSimCanvas');
  window.simWorkEnergy = new WorkEnergySimulator('workEnergyCanvas');
  window.simSpring = new SpringSimulator('springSimCanvas');
  window.simRollerCoaster = new RollerCoasterSimulator('rollerCoasterCanvas');
  window.simPower = new PowerSimulator('powerSimCanvas');

  // Conectar controles UI de la Simulación 1 (Trabajo W = F·d·cosθ)
  const sliderF = document.getElementById('sliderWorkF');
  const sliderTheta = document.getElementById('sliderWorkTheta');
  const sliderD = document.getElementById('sliderWorkD');
  const sliderMu = document.getElementById('sliderWorkMu');

  if (sliderF) {
    sliderF.addEventListener('input', (e) => {
      if (window.simWork) {
        window.simWork.F = parseFloat(e.target.value);
        document.getElementById('valWorkF').innerText = `${window.simWork.F} N`;
        window.simWork.render();
      }
    });
  }
  if (sliderTheta) {
    sliderTheta.addEventListener('input', (e) => {
      if (window.simWork) {
        window.simWork.theta = parseFloat(e.target.value);
        document.getElementById('valWorkTheta').innerText = `${window.simWork.theta}°`;
        window.simWork.render();
      }
    });
  }
  if (sliderD) {
    sliderD.addEventListener('input', (e) => {
      if (window.simWork) {
        window.simWork.d = parseFloat(e.target.value);
        document.getElementById('valWorkD').innerText = `${window.simWork.d} m`;
        window.simWork.render();
      }
    });
  }
  if (sliderMu) {
    sliderMu.addEventListener('input', (e) => {
      if (window.simWork) {
        window.simWork.mu = parseFloat(e.target.value);
        document.getElementById('valWorkMu').innerText = window.simWork.mu.toFixed(2);
        window.simWork.render();
      }
    });
  }

  const btnAnimateWork = document.getElementById('btnAnimateWork');
  const btnResetWork = document.getElementById('btnResetWork');
  if (btnAnimateWork) btnAnimateWork.addEventListener('click', () => window.simWork?.animate());
  if (btnResetWork) btnResetWork.addEventListener('click', () => window.simWork?.reset());

  // Conectar controles de Simulación 2 (Frenado Teorema W-K)
  const sliderV0 = document.getElementById('sliderEnergyV0');
  const sliderMu2 = document.getElementById('sliderEnergyMu');
  if (sliderV0) {
    sliderV0.addEventListener('input', (e) => {
      if (window.simWorkEnergy) {
        window.simWorkEnergy.v0 = parseFloat(e.target.value);
        document.getElementById('valEnergyV0').innerText = `${window.simWorkEnergy.v0} m/s`;
        window.simWorkEnergy.reset();
      }
    });
  }
  if (sliderMu2) {
    sliderMu2.addEventListener('input', (e) => {
      if (window.simWorkEnergy) {
        window.simWorkEnergy.mu = parseFloat(e.target.value);
        document.getElementById('valEnergyMu').innerText = window.simWorkEnergy.mu.toFixed(2);
        window.simWorkEnergy.reset();
      }
    });
  }
  const btnBrake = document.getElementById('btnStartBrake');
  const btnResetEnergy = document.getElementById('btnResetEnergy');
  if (btnBrake) btnBrake.addEventListener('click', () => window.simWorkEnergy?.startBrake());
  if (btnResetEnergy) btnResetEnergy.addEventListener('click', () => window.simWorkEnergy?.reset());

  // Conectar controles de Simulación 3 (Resorte de Hooke)
  const sliderSpringK = document.getElementById('sliderSpringK');
  const sliderSpringX = document.getElementById('sliderSpringX');
  if (sliderSpringK) {
    sliderSpringK.addEventListener('input', (e) => {
      if (window.simSpring) {
        window.simSpring.k = parseFloat(e.target.value);
        document.getElementById('valSpringK').innerText = `${window.simSpring.k} N/m`;
        window.simSpring.render();
      }
    });
  }
  if (sliderSpringX) {
    sliderSpringX.addEventListener('input', (e) => {
      if (window.simSpring) {
        window.simSpring.x = parseFloat(e.target.value);
        document.getElementById('valSpringX').innerText = `${window.simSpring.x.toFixed(2)} m`;
        window.simSpring.render();
      }
    });
  }
  const btnOscillate = document.getElementById('btnToggleSpringOscillate');
  if (btnOscillate) btnOscillate.addEventListener('click', () => window.simSpring?.toggleOscillate());

  // Conectar controles de Simulación 4 (Montaña Rusa)
  const btnPlayCoaster = document.getElementById('btnPlayCoaster');
  const btnResetCoaster = document.getElementById('btnResetCoaster');
  const toggleFriction = document.getElementById('toggleFriction');
  const selectGravity = document.getElementById('selectGravity');

  if (btnPlayCoaster) btnPlayCoaster.addEventListener('click', () => window.simRollerCoaster?.togglePlay());
  if (btnResetCoaster) btnResetCoaster.addEventListener('click', () => window.simRollerCoaster?.reset());
  if (toggleFriction) {
    toggleFriction.addEventListener('change', (e) => {
      if (window.simRollerCoaster) window.simRollerCoaster.frictionEnabled = e.target.checked;
    });
  }
  if (selectGravity) {
    selectGravity.addEventListener('change', (e) => {
      if (window.simRollerCoaster) window.simRollerCoaster.setGravity(parseFloat(e.target.value));
    });
  }

  // Conectar controles de Simulación 5 (Potencia de Grúa)
  const sliderPowerMass = document.getElementById('sliderPowerMass');
  const sliderPowerH = document.getElementById('sliderPowerH');
  const sliderPowerT = document.getElementById('sliderPowerT');
  if (sliderPowerMass) {
    sliderPowerMass.addEventListener('input', (e) => {
      if (window.simPower) {
        window.simPower.mass = parseFloat(e.target.value);
        document.getElementById('valPowerMass').innerText = `${window.simPower.mass} kg`;
        window.simPower.render();
      }
    });
  }
  if (sliderPowerH) {
    sliderPowerH.addEventListener('input', (e) => {
      if (window.simPower) {
        window.simPower.heightTarget = parseFloat(e.target.value);
        document.getElementById('valPowerH').innerText = `${window.simPower.heightTarget} m`;
        window.simPower.render();
      }
    });
  }
  if (sliderPowerT) {
    sliderPowerT.addEventListener('input', (e) => {
      if (window.simPower) {
        window.simPower.timeTarget = parseFloat(e.target.value);
        document.getElementById('valPowerT').innerText = `${window.simPower.timeTarget} s`;
        window.simPower.render();
      }
    });
  }
  const btnLift = document.getElementById('btnStartLift');
  const btnResetPower = document.getElementById('btnResetPower');
  if (btnLift) btnLift.addEventListener('click', () => window.simPower?.lift());
  if (btnResetPower) btnResetPower.addEventListener('click', () => window.simPower?.reset());
}

/* ==========================================================================
   2. NAVEGACIÓN ENTRE HOJAS TAMAÑO CARTA
   ========================================================================== */
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab-btn');
  const sheets = document.querySelectorAll('.sheet-page');

  function goToSheet(pageId) {
    tabs.forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`.nav-tab-btn[data-page="${pageId}"]`);
    if (activeTab) activeTab.classList.add('active');

    const targetSheet = document.getElementById(pageId);
    if (targetSheet) {
      const navHeight = document.querySelector('.top-navbar')?.offsetHeight || 60;
      const targetPos = targetSheet.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });

      // Redimensionar canvas del simulador activo para evitar deformaciones
      setTimeout(() => {
        if (pageId === 'sheet-2') window.simWork?.resize();
        if (pageId === 'sheet-3') window.simWorkEnergy?.resize();
        if (pageId === 'sheet-4') window.simSpring?.resize();
        if (pageId === 'sheet-5') window.simRollerCoaster?.resize();
        if (pageId === 'sheet-6') window.simPower?.resize();
      }, 250);
    }
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const pageId = btn.getAttribute('data-page');
      if (pageId) goToSheet(pageId);
    });
  });

  const btnHome = document.getElementById('btnNavHome');
  if (btnHome) btnHome.addEventListener('click', () => goToSheet('sheet-1'));

  // Botones de navegación "Siguiente / Anterior" dentro de las hojas
  document.querySelectorAll('[data-nav-target]').forEach(b => {
    b.addEventListener('click', () => {
      const target = b.getAttribute('data-nav-target');
      if (target) goToSheet(target);
    });
  });

  // Botón directo a Portada "Iniciar Guía"
  const btnStartGuide = document.getElementById('btnStartGuide');
  if (btnStartGuide) btnStartGuide.addEventListener('click', () => goToSheet('sheet-2'));

  // Observador de Intersección para iluminar la pestaña activa al hacer scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
        const id = entry.target.id;
        tabs.forEach(t => t.classList.remove('active'));
        const matching = document.querySelector(`.nav-tab-btn[data-page="${id}"]`);
        if (matching) matching.classList.add('active');
      }
    });
  }, { threshold: [0.3] });

  sheets.forEach(s => observer.observe(s));
}

/* ==========================================================================
   3. GESTOR DE 6 TEMAS VISUALES
   ========================================================================== */
function initThemeManager() {
  const btnThemeMenu = document.getElementById('btnThemeMenu');
  const menuPopover = document.getElementById('themeMenuPopover');
  const themeButtons = document.querySelectorAll('.theme-option-btn');

  if (btnThemeMenu && menuPopover) {
    btnThemeMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      menuPopover.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      menuPopover.classList.remove('active');
    });
  }

  function applyTheme(themeClass) {
    document.body.className = '';
    document.body.classList.add(themeClass);
    try {
      localStorage.setItem('pafem_selected_theme', themeClass);
    } catch (e) {}

    // Refrescar simuladores al cambiar tema
    window.simWork?.render();
    window.simWorkEnergy?.render();
    window.simSpring?.render();
    window.simRollerCoaster?.render();
    window.simPower?.render();
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-set-theme');
      if (theme) applyTheme(theme);
      menuPopover?.classList.remove('active');
    });
  });

  // Cargar tema guardado o dark por defecto
  try {
    const saved = localStorage.getItem('pafem_selected_theme') || 'theme-dark';
    applyTheme(saved);
  } catch (e) {
    applyTheme('theme-dark');
  }
}

/* ==========================================================================
   4. PERFIL DEL ESTUDIANTE Y AUTO-GUARDADO
   ========================================================================== */
function initStudentProfile() {
  const inputName = document.getElementById('inputStudentName');
  const selectSchool = document.getElementById('selectSchool');
  const customSchoolWrapper = document.getElementById('customSchoolWrapper');
  const inputCustomSchool = document.getElementById('inputCustomSchool');
  const selectGrade = document.getElementById('selectGrade');
  const inputGroup = document.getElementById('inputGroup');
  const inputDate = document.getElementById('inputDate');

  if (inputDate) {
    const now = new Date();
    inputDate.value = now.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  if (selectSchool && customSchoolWrapper) {
    selectSchool.addEventListener('change', () => {
      if (selectSchool.value === 'Otra') {
        customSchoolWrapper.style.display = 'block';
      } else {
        customSchoolWrapper.style.display = 'none';
      }
      saveProfile();
    });
  }

  function saveProfile() {
    const profile = {
      name: inputName?.value || '',
      school: selectSchool?.value === 'Otra' ? (inputCustomSchool?.value || 'Otra') : (selectSchool?.value || ''),
      grade: selectGrade?.value || '',
      group: inputGroup?.value || '1',
      date: inputDate?.value || ''
    };
    try {
      localStorage.setItem('pafem_student_profile', JSON.stringify(profile));
    } catch (e) {}
    updateSummaryBadge(profile);
  }

  function updateSummaryBadge(profile) {
    const el = document.getElementById('summaryStudentInfo');
    if (el) {
      el.innerHTML = `
        <strong><i class="fas fa-user-graduate"></i> Estudiante:</strong> ${profile.name || 'Sin registrar'} |
        <strong>Institución:</strong> ${profile.school || 'PAFEM'} |
        <strong>Grado:</strong> ${profile.grade} (${profile.group}) |
        <strong>Fecha:</strong> ${profile.date}
      `;
    }
  }

  [inputName, inputCustomSchool, selectGrade, inputGroup].forEach(inp => {
    if (inp) inp.addEventListener('input', saveProfile);
  });

  // Cargar datos previos si existen
  try {
    const saved = localStorage.getItem('pafem_student_profile');
    if (saved) {
      const p = JSON.parse(saved);
      if (inputName && p.name) inputName.value = p.name;
      if (selectSchool && p.school) {
        if (['I.E. Diego Maya Salazar', 'I.E. Jaime Salazar Robledo', 'I.E. Hugo Ángel Mejía'].includes(p.school)) {
          selectSchool.value = p.school;
        } else {
          selectSchool.value = 'Otra';
          if (customSchoolWrapper) customSchoolWrapper.style.display = 'block';
          if (inputCustomSchool) inputCustomSchool.value = p.school;
        }
      }
      if (selectGrade && p.grade) selectGrade.value = p.grade;
      if (inputGroup && p.group) inputGroup.value = p.group;
      updateSummaryBadge(p);
    }
  } catch (e) {}

  const btnValidate = document.getElementById('btnValidateData');
  if (btnValidate) {
    btnValidate.addEventListener('click', () => {
      const name = inputName?.value.trim();
      if (!name) {
        alert('Por favor escribe tu Nombre Completo para registrar tu trabajo.');
        inputName?.focus();
      } else {
        alert(`¡Datos validados exitosamente!\nBienvenido(a), ${name}.\nPuedes proceder a estudiar la guía y realizar las simulaciones.`);
      }
    });
  }
}

/* ==========================================================================
   5. VISOR LIGHTBOX PARA ILUSTRACIONES EN PANTALLA COMPLETA
   ========================================================================== */
function initImageLightbox() {
  const modal = document.getElementById('imageLightboxModal');
  const imgEl = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxCloseBtn');

  if (!modal || !imgEl) return;

  document.querySelectorAll('.scientific-figure-card img, .cover-image-container img').forEach(img => {
    img.addEventListener('click', () => {
      imgEl.src = img.src;
      const caption = img.closest('.scientific-figure-card')?.querySelector('.figure-caption')?.innerText || img.alt;
      if (captionEl) captionEl.innerText = caption;
      modal.classList.add('active');
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

/* ==========================================================================
   6. EXPORTACIÓN A PDF Y ENVÍO DE RESULTADOS
   ========================================================================== */
function initExportAndSubmission() {
  const btnExportPdfTop = document.getElementById('btnExportPdfTop');
  const btnExportPdfMain = document.getElementById('btnExportPdfMain');
  const btnSubmitResults = document.getElementById('btnSubmitResults');
  const modalSubmission = document.getElementById('modalSubmission');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const reportPreviewText = document.getElementById('reportPreviewText');
  const btnCopyReport = document.getElementById('btnCopyReport');
  const btnDownloadTxt = document.getElementById('btnDownloadTxt');

  function exportPDF() {
    window.print(); // Solución universal, sin desbordamiento, optimizada con CSS @media print
  }

  if (btnExportPdfTop) btnExportPdfTop.addEventListener('click', exportPDF);
  if (btnExportPdfMain) btnExportPdfMain.addEventListener('click', exportPDF);

  function generateSubmissionReport() {
    const results = window.quizInstance ? window.quizInstance.gradeAll() : { score: '0.0', percentage: 0 };
    const profile = JSON.parse(localStorage.getItem('pafem_student_profile') || '{}');

    let report = `==========================================================\n`;
    report += `REPORTE OFICIAL PAFEM: TRABAJO, POTENCIA Y ENERGÍA\n`;
    report += `Coordinador de Física: Prof. Luis Hernando Blandón Dávila\n`;
    report += `==========================================================\n\n`;
    report += `ESTUDIANTE: ${profile.name || 'Sin nombre registrado'}\n`;
    report += `INSTITUCIÓN: ${profile.school || 'I.E. PAFEM'}\n`;
    report += `GRADO/GRUPO: ${profile.grade || '11°'} - Grupo ${profile.group || '1'}\n`;
    report += `FECHA DE ENTREGA: ${profile.date || new Date().toLocaleDateString()}\n\n`;
    report += `----------------------------------------------------------\n`;
    report += `DESEMPEÑO EN EL TALLER EVALUATIVO:\n`;
    report += `Preguntas Acertadas: ${results.correctCount} / ${results.totalCount}\n`;
    report += `Calificación Escala MEN (1.0 a 5.0): ${results.score}\n`;
    report += `Porcentaje de Logro: ${results.percentage}%\n`;
    report += `Nivel de Desempeño: ${results.score >= 4.6 ? 'SUPERIOR' : results.score >= 4.0 ? 'ALTO' : results.score >= 3.0 ? 'BÁSICO' : 'BAJO'}\n`;
    report += `----------------------------------------------------------\n\n`;
    report += `MANDATO METODOLÓGICO Y ÉTICA ACADÉMICA:\n`;
    report += `- Todos los cálculos, diagramas de fuerzas vectoriales, gráficas de energía\n`;
    report += `  y justificaciones conceptuales han sido transcritos de puño y letra\n`;
    report += `  en el cuaderno oficial de física o block cuadriculado tamaño carta.\n\n`;
    report += `Firma del Estudiante: _____________________________________\n`;
    report += `Vo.Bo. Docente de Física: Prof. Luis Hernando Blandón D.\n`;

    return report;
  }

  if (btnSubmitResults && modalSubmission && reportPreviewText) {
    btnSubmitResults.addEventListener('click', () => {
      const text = generateSubmissionReport();
      reportPreviewText.innerText = text;
      modalSubmission.classList.add('active');
    });
  }

  if (modalCloseBtn && modalSubmission) {
    modalCloseBtn.addEventListener('click', () => modalSubmission.classList.remove('active'));
    modalSubmission.addEventListener('click', (e) => {
      if (e.target === modalSubmission) modalSubmission.classList.remove('active');
    });
  }

  if (btnCopyReport && reportPreviewText) {
    btnCopyReport.addEventListener('click', () => {
      navigator.clipboard.writeText(reportPreviewText.innerText).then(() => {
        alert('¡Reporte copiado al portapapeles! Listo para pegar en WhatsApp o correo institucional.');
      }).catch(() => {
        alert('Selecciona y copia el texto del reporte manualmente.');
      });
    });
  }

  if (btnDownloadTxt && reportPreviewText) {
    btnDownloadTxt.addEventListener('click', () => {
      const blob = new Blob([reportPreviewText.innerText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_Fisica_Trabajo_Energia_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}

/* ==========================================================================
   7. RENDERIZACIÓN DE TIPOGRAFÍA MATEMÁTICA KATEX
   ========================================================================== */
function renderKaTeXFormulas() {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  }
}

/* ==========================================================================
   8. BARRA DE PROGRESO DE LECTURA Y BOTÓN FLOTANTE
   ========================================================================== */
function initBackToTopAndProgress() {
  const progressBar = document.getElementById('navProgressBar');
  const btnTop = document.getElementById('btnBackToTop');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    if (progressBar) progressBar.style.width = `${scrolled}%`;

    if (btnTop) {
      if (winScroll > 400) {
        btnTop.style.display = 'flex';
      } else {
        btnTop.style.display = 'none';
      }
    }
  });

  if (btnTop) {
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
