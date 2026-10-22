/* ==========================================================================
   TALLER EVALUATIVO INTERACTIVO: TRABAJO, POTENCIA Y ENERGÍA
   Coordinación: Prof. Luis Hernando Blandón Dávila - Coordinador Física PAFEM
   Colegios: I.E. Diego Maya Salazar, I.E. Jaime Salazar Robledo, I.E. Hugo Ángel Mejía
   Banco de Problemas, Evaluación Numérica, Desglose Didáctico y Rúbrica MEN
   ========================================================================== */

const WORKSHOP_QUESTIONS = [
  {
    id: 1,
    type: 'numeric',
    topic: 'Trabajo Mecánico con Ángulo (F·d·cosθ)',
    badge: 'Cálculo Numérico',
    question: `Un trineo de masa \\(m = 20\\text{ kg}\\) es jalado a lo largo de un suelo horizontal mediante una cuerda con una fuerza constante \\(F = 50\\text{ N}\\) que forma un ángulo \\(\\theta = 37^\\circ\\) con la horizontal. El trineo se desplaza \\(d = 10\\text{ m}\\). Considerando \\(g = 9.8\\text{ m/s}^2\\) y \\(\\cos 37^\\circ = 0.8\\), calcula el trabajo realizado por la fuerza aplicada \\(W_F\\) en Joules (J).`,
    correctAnswer: 400,
    tolerance: 10, // Acepta de 390 a 410 J
    unit: 'J',
    hint: 'Aplica la definición de trabajo para fuerza constante: W = F · d · cos(θ).',
    solution: {
      datos: 'F = 50 N, d = 10 m, θ = 37°, cos(37°) = 0.8',
      formula: 'W_F = F \\cdot d \\cdot \\cos(\\theta)',
      despeje: 'Sustitución directa de valores numéricos',
      calculo: 'W_F = 50\\text{ N} \\times 10\\text{ m} \\times 0.8 = 400\\text{ J}',
      conclusion: 'La componente horizontal eficaz de la fuerza es F_x = 40 N, por lo que transfiere 400 Joules de energía al trineo.'
    }
  },
  {
    id: 2,
    type: 'choice',
    topic: 'Concepto de Trabajo Nulo (θ = 90°)',
    badge: 'Análisis Conceptual',
    question: `Un estudiante sostiene un morral de \\(15\\text{ kg}\\) en reposo durante 10 minutos esperando el transporte y luego camina \\(30\\text{ m}\\) a rapidez constante en una calle horizontal manteniendo el morral a la misma altura. ¿Cuánto trabajo mecánico realiza la fuerza vertical que ejercen los hombros del estudiante sobre el morral durante el desplazamiento horizontal?`,
    options: [
      { text: 'A) 4500 J, porque se multiplica el peso por la distancia recorrida.', isCorrect: false },
      { text: 'B) 0 J, porque la fuerza aplicada es perpendicular al desplazamiento horizontal (cos 90° = 0).', isCorrect: true },
      { text: 'C) 150 J, equivalente al peso del morral.', isCorrect: false },
      { text: 'D) Depende del tiempo que tarde en caminar los 30 metros.', isCorrect: false }
    ],
    hint: 'Recuerda que si el ángulo entre el vector fuerza y el vector desplazamiento es 90°, cos(90°) = 0.',
    solution: {
      datos: 'Fuerza hacia arriba (vertical), Desplazamiento hacia adelante (horizontal) -> θ = 90°',
      formula: 'W = F \\cdot d \\cdot \\cos(90^\\circ)',
      despeje: '\\cos(90^\\circ) = 0',
      calculo: 'W = F \\cdot d \\cdot 0 = 0\\text{ J}',
      conclusion: 'Físicamente no se realiza trabajo mecánico sobre el morral porque la fuerza no tiene componente a lo largo del movimiento.'
    }
  },
  {
    id: 3,
    type: 'numeric',
    topic: 'Teorema Trabajo y Energía Cinética (Frenado)',
    badge: 'Cálculo Numérico',
    question: `Un automóvil de masa \\(1200\\text{ kg}\\) viaja por una avenida recta a una velocidad de \\(72\\text{ km/h}\\) (es decir, \\(20\\text{ m/s}\\)). El conductor frena a fondo bloqueando las ruedas sobre asfalto seco con coeficiente de fricción cinética \\(\\mu_k = 0.50\\) y \\(g = 9.8\\text{ m/s}^2\\). Utilizando el Teorema del Trabajo y la Energía Cinética (\\(W_{neto} = \\Delta K\\)), calcula la distancia mínima de frenado (en metros) hasta detenerse.`,
    correctAnswer: 40.8,
    tolerance: 1.5, // 39.3 a 42.3 m
    unit: 'm',
    hint: 'W_fricción = -f_k · d = 0 - (1/2) · m · v_0^2, donde f_k = μ_k · m · g. Despeja d.',
    solution: {
      datos: 'm = 1200 kg, v_0 = 20 m/s, v_f = 0, μ_k = 0.50, g = 9.8 m/s²',
      formula: '-f_k \\cdot d = -\\frac{1}{2} m v_0^2 \\implies -(\\mu_k m g) \\cdot d = -\\frac{1}{2} m v_0^2',
      despeje: 'd = \\frac{v_0^2}{2 \\mu_k g}',
      calculo: 'd = \\frac{20^2}{2(0.50)(9.8)} = \\frac{400}{9.8} \\approx 40.82\\text{ m}',
      conclusion: 'La distancia de frenado es proporcional al cuadrado de la velocidad e independiente de la masa del vehículo.'
    }
  },
  {
    id: 4,
    type: 'numeric',
    topic: 'Ley de Hooke y Energía Potencial Elástica',
    badge: 'Cálculo Numérico',
    question: `El resorte de un lanzador de juguete tiene una constante elástica \\(k = 250\\text{ N/m}\\). Se comprime una distancia \\(x = 0.20\\text{ m}\\) desde su posición de equilibrio. ¿Cuánta energía potencial elástica \\(U_e\\) (en Joules) queda almacenada en el resorte?`,
    correctAnswer: 5.0,
    tolerance: 0.2, // 4.8 a 5.2 J
    unit: 'J',
    hint: 'Aplica la ecuación de energía elástica del resorte de Serway: U_e = (1/2) · k · x².',
    solution: {
      datos: 'k = 250 N/m, x = 0.20 m',
      formula: 'U_e = \\frac{1}{2} k x^2',
      despeje: 'Sustitución directa en Joules',
      calculo: 'U_e = 0.5 \\times 250\\text{ N/m} \\times (0.20\\text{ m})^2 = 125 \\times 0.04 = 5.0\\text{ J}',
      conclusion: 'Al liberarse el resorte sin fricción, estos 5.0 Joules se transformarán íntegramente en energía cinética.'
    }
  },
  {
    id: 5,
    type: 'choice',
    topic: 'Conservación de la Energía Mecánica en Bucle',
    badge: 'Análisis Conceptual',
    question: `Un carro de montaña rusa sin fricción parte del reposo desde una altura \\(H\\). Entra en un rizo vertical circular de radio \\(R\\). Para que el carro logre completar el rizo sin despegarse de la vía en el punto más alto (donde la altura es \\(2R\\)), la altura mínima de partida \\(H_{min}\\) debe ser:`,
    options: [
      { text: 'A) H = 2R, exactamente la altura máxima del rizo.', isCorrect: false },
      { text: 'B) H = 2.5R (cinco medios del radio), para garantizar la rapidez crítica mínima v = √(gR).', isCorrect: true },
      { text: 'C) H = 3R, independientemente de la gravedad.', isCorrect: false },
      { text: 'D) H = 1.5R, gracias a la inercia centrífuga.', isCorrect: false }
    ],
    hint: 'En el punto más alto, la velocidad mínima exige m*v²/R = mg. Luego usa E_inicial = E_superior.',
    solution: {
      datos: 'h_inicial = H, h_superior = 2R, v_critica = √(gR)',
      formula: 'm g H = m g (2R) + \\frac{1}{2} m (\\sqrt{gR})^2',
      despeje: 'g H = 2 g R + 0.5 g R = 2.5 g R \\implies H = 2.5 R',
      calculo: 'H = 2.5 R',
      conclusion: 'La altura inicial debe superar en un 25% la altura del rizo para que el carro conserve la rapidez suficiente y no caiga.'
    }
  },
  {
    id: 6,
    type: 'numeric',
    topic: 'Fuerzas No Conservativas y Energía Disipada',
    badge: 'Cálculo Numérico',
    question: `Una caja de masa \\(m = 5.0\\text{ kg}\\) se desliza desde el reposo por una rampa de altura vertical \\(h = 4.0\\text{ m}\\). Al llegar a la base de la rampa, su rapidez medida es \\(v = 6.0\\text{ m/s}\\). Considerando \\(g = 9.8\\text{ m/s}^2\\), ¿cuánta energía mecánica (en Joules) se disipó en forma de calor (energía interna \\(\\Delta E_{int}\\)) por efecto del rozamiento?`,
    correctAnswer: 106.0,
    tolerance: 3.0, // 103 a 109 J
    unit: 'J',
    hint: 'E_inicial = mgh. E_final = (1/2) m v². La energía disipada es la diferencia: ΔE = E_inicial - E_final.',
    solution: {
      datos: 'm = 5.0 kg, h = 4.0 m, v = 6.0 m/s, g = 9.8 m/s²',
      formula: 'E_i = m g h, \\quad E_f = \\frac{1}{2} m v^2, \\quad \\Delta E_{term} = E_i - E_f',
      despeje: '\\Delta E_{term} = (5)(9.8)(4) - 0.5(5)(6^2)',
      calculo: 'E_i = 196.0\\text{ J}, \\quad E_f = 90.0\\text{ J} \\implies \\Delta E_{term} = 196.0 - 90.0 = 106.0\\text{ J}',
      conclusion: 'El rozamiento transformó 106 Joules de energía mecánica útil en calentamiento de la caja y de la rampa.'
    }
  },
  {
    id: 7,
    type: 'numeric',
    topic: 'Potencia Mecánica de un Elevador (P = W/t)',
    badge: 'Cálculo Numérico',
    question: `El ascensor de una institución educativa eleva una masa total de \\(800\\text{ kg}\\) a velocidad constante hasta una altura de \\(15\\text{ m}\\) en un tiempo de \\(10\\text{ segundos}\\) (usar \\(g = 9.8\\text{ m/s}^2\\)). Calcula la potencia media útil entregada por el motor en Watts (W).`,
    correctAnswer: 11760,
    tolerance: 150, // 11610 a 11910 W
    unit: 'W',
    hint: 'W = m · g · h. Potencia = W / t.',
    solution: {
      datos: 'm = 800 kg, h = 15 m, t = 10 s, g = 9.8 m/s²',
      formula: 'P = \\frac{W}{t} = \\frac{m g h}{t}',
      despeje: 'P = \\frac{(800)(9.8)(15)}{10}',
      calculo: 'W = 117,600\\text{ J} \\implies P = \\frac{117,600}{10} = 11,760\\text{ W} \\approx 11.76\\text{ kW}',
      conclusion: 'En caballos de fuerza representa 11,760 / 745.7 ≈ 15.77 HP desarrollados por el motor.'
    }
  },
  {
    id: 8,
    type: 'choice',
    topic: 'DBA / Transición Energética y Eficiencia',
    badge: 'Argumentación Científica',
    question: `En una central hidroeléctrica que abastece al Eje Cafetero, el agua cae desde una represa transformando energía potencial gravitacional en cinética y luego en energía eléctrica mediante generadores. Según el principio de conservación de la energía y las leyes de la física, ¿por qué la energía eléctrica obtenida es siempre MENOR que la energía potencial gravitacional original del agua embalsada?`,
    options: [
      { text: 'A) Porque parte de la energía se destruye inevitablemente al golpear los alabes de la turbina.', isCorrect: false },
      { text: 'B) Porque parte de la energía se degrada en energía térmica y sonora por fricción viscosa en tuberías, turbulencias y resistencia eléctrica (E_total se conserva pero la útil disminuye).', isCorrect: true },
      { text: 'C) Porque la ley de conservación de energía solo es válida para partículas aisladas en el vacío.', isCorrect: false },
      { text: 'D) Porque la gravedad disminuye a medida que el agua desciende por la tubería forzada.', isCorrect: false }
    ],
    hint: 'La energía no se crea ni se destruye, pero en sistemas reales las fuerzas no conservativas disipan energía mecánica útil en energía térmica.',
    solution: {
      datos: 'Sistema abierto no conservativo con rozamiento y resistencia',
      formula: 'E_{potencial} = E_{electrica} + E_{termica} + E_{sonora} + E_{turbulencia}',
      despeje: 'Eficiencia = (E_{electrica} / E_{potencial}) < 1.0 (100%)',
      calculo: 'La energía total del Universo permanece constante, pero la calidad/disponibilidad energética disminuye.',
      conclusion: 'Ningún proceso macroscópico tiene 100% de eficiencia debido a la disipación irreversible en forma de calor.'
    }
  }
];

class QuizManager {
  constructor() {
    this.questions = WORKSHOP_QUESTIONS;
    this.userAnswers = {};
    this.isFullMode = true; // 8 preguntas vs 5 preguntas
  }

  static init() {
    window.quizInstance = new QuizManager();
    window.quizInstance.renderQuestions();
    window.quizInstance.bindEvents();
    window.quizInstance.loadSavedState();
  }

  setMode(full) {
    this.isFullMode = full;
    this.renderQuestions();
    this.loadSavedState();
  }

  renderQuestions() {
    const container = document.getElementById('quizQuestionsContainer');
    if (!container) return;

    const count = this.isFullMode ? 8 : 5;
    const activeQuestions = this.questions.slice(0, count);

    container.innerHTML = activeQuestions.map((q, idx) => {
      let inputHtml = '';
      if (q.type === 'numeric') {
        inputHtml = `
          <div class="calc-input-row">
            <label for="q_input_${q.id}" style="font-size:0.75rem; font-weight:700; color:#475569;">Tu resultado numérico:</label>
            <input type="number" step="any" id="q_input_${q.id}" class="calc-input-field" placeholder="Escribe aquí..." data-qid="${q.id}">
            <span class="calc-unit-tag">${q.unit}</span>
            <button type="button" class="btn-action btn-secondary" onclick="window.quizInstance.checkSingleQuestion(${q.id})" style="padding:0.35rem 0.75rem; font-size:0.75rem;">
              <i class="fas fa-check"></i> Verificar
            </button>
          </div>
        `;
      } else if (q.type === 'choice') {
        inputHtml = `
          <div class="options-grid">
            ${q.options.map((opt, optIdx) => `
              <div class="option-item" onclick="window.quizInstance.selectOption(${q.id}, ${optIdx}, this)">
                <input type="radio" name="opt_${q.id}" id="opt_${q.id}_${optIdx}" value="${optIdx}">
                <label for="opt_${q.id}_${optIdx}" style="cursor:pointer; flex:1;">${opt.text}</label>
              </div>
            `).join('')}
          </div>
        `;
      }

      return `
        <article class="question-card" id="qcard_${q.id}">
          <div class="question-meta-row">
            <span class="question-badge">Problema ${idx + 1} de ${count} • ${q.badge}</span>
            <span style="color:#0284c7; font-weight:700;">${q.topic}</span>
          </div>
          <div class="question-text">
            ${q.question}
          </div>
          ${inputHtml}
          
          <button type="button" class="btn-solution-toggle" onclick="window.quizInstance.toggleSolution(${q.id})">
            <i class="fas fa-lightbulb"></i> Ver Procedimiento Detallado (Despeje y Solución)
          </button>
          
          <div class="solution-details-box" id="sol_${q.id}">
            <strong><i class="fas fa-check-circle"></i> Procedimiento Analítico Paso a Paso:</strong>
            <p style="margin:0.25rem 0;"><strong>1. Datos e Incógnita:</strong> ${q.solution.datos}</p>
            <p style="margin:0.25rem 0;"><strong>2. Ecuación Física Fundamental:</strong> \\(${q.solution.formula}\\)</p>
            <p style="margin:0.25rem 0;"><strong>3. Despeje / Sustitución:</strong> ${q.solution.despeje}</p>
            <p style="margin:0.25rem 0;"><strong>4. Cálculo Numérico:</strong> ${q.solution.calculo}</p>
            <p style="margin:0.25rem 0; color:#15803d; font-weight:600;"><strong>5. Interpretación Física:</strong> ${q.solution.conclusion}</p>
            <div style="background:#fef3c7; border:1px solid #fde68a; padding:0.35rem 0.5rem; border-radius:4px; margin-top:0.35rem; color:#92400e; font-size:0.7rem;">
              <i class="fas fa-pen-fancy"></i> <strong>Mandato del Docente:</strong> Transcribe este procedimiento completo y legible con regla en tu cuaderno de física.
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Re-render KaTeX si está disponible
    if (window.renderMathInElement) {
      window.renderMathInElement(container, {
        delimiters: [
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ]
      });
    }
  }

  selectOption(qId, optIdx, element) {
    const card = document.getElementById(`qcard_${qId}`);
    if (!card) return;
    card.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    const radio = element.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;

    this.userAnswers[qId] = optIdx;
    this.saveState();

    const q = this.questions.find(item => item.id === qId);
    if (q) {
      const isCorrect = q.options[optIdx].isCorrect;
      card.classList.remove('status-correct', 'status-incorrect');
      card.classList.add(isCorrect ? 'status-correct' : 'status-incorrect');
    }
  }

  checkSingleQuestion(qId) {
    const q = this.questions.find(item => item.id === qId);
    const card = document.getElementById(`qcard_${qId}`);
    const input = document.getElementById(`q_input_${qId}`);
    if (!q || !card || !input) return;

    const val = parseFloat(input.value);
    if (isNaN(val)) {
      alert('Por favor ingresa un número válido.');
      return;
    }

    this.userAnswers[qId] = val;
    this.saveState();

    const isCorrect = Math.abs(val - q.correctAnswer) <= q.tolerance;
    card.classList.remove('status-correct', 'status-incorrect');
    card.classList.add(isCorrect ? 'status-correct' : 'status-incorrect');

    if (isCorrect) {
      alert(`¡Excelente trabajo! La respuesta (${val} ${q.unit}) es correcta.`);
    } else {
      alert(`Tu respuesta fue ${val} ${q.unit}. Verifica tus cálculos o consulta el acordeón de solución paso a paso.`);
    }
  }

  toggleSolution(qId) {
    const box = document.getElementById(`sol_${qId}`);
    if (box) {
      box.classList.toggle('active');
    }
  }

  gradeAll() {
    const count = this.isFullMode ? 8 : 5;
    const activeQuestions = this.questions.slice(0, count);
    let correctCount = 0;

    activeQuestions.forEach(q => {
      const card = document.getElementById(`qcard_${q.id}`);
      if (!card) return;

      let isCorrect = false;
      if (q.type === 'numeric') {
        const input = document.getElementById(`q_input_${q.id}`);
        const val = input ? parseFloat(input.value) : NaN;
        if (!isNaN(val) && Math.abs(val - q.correctAnswer) <= q.tolerance) {
          isCorrect = true;
        }
      } else if (q.type === 'choice') {
        const selected = this.userAnswers[q.id];
        if (selected !== undefined && q.options[selected] && q.options[selected].isCorrect) {
          isCorrect = true;
        }
      }

      card.classList.remove('status-correct', 'status-incorrect');
      card.classList.add(isCorrect ? 'status-correct' : 'status-incorrect');
      if (isCorrect) correctCount++;
    });

    const score = (correctCount / count) * 5.0; // Calificación escala 1 a 5 MEN
    return {
      correctCount,
      totalCount: count,
      score: score.toFixed(1),
      percentage: Math.round((correctCount / count) * 100)
    };
  }

  saveState() {
    try {
      localStorage.setItem('pafem_energy_workshop_answers', JSON.stringify(this.userAnswers));
    } catch (e) {}
  }

  loadSavedState() {
    try {
      const saved = localStorage.getItem('pafem_energy_workshop_answers');
      if (saved) {
        this.userAnswers = JSON.parse(saved);
        Object.keys(this.userAnswers).forEach(qId => {
          const val = this.userAnswers[qId];
          const q = this.questions.find(item => item.id == qId);
          if (!q) return;

          if (q.type === 'numeric') {
            const input = document.getElementById(`q_input_${qId}`);
            if (input) input.value = val;
          } else if (q.type === 'choice') {
            const radio = document.getElementById(`opt_${qId}_${val}`);
            if (radio) {
              radio.checked = true;
              radio.closest('.option-item')?.classList.add('selected');
            }
          }
        });
      }
    } catch (e) {}
  }

  bindEvents() {
    const btnFull = document.getElementById('btnModeFull');
    const btnQuick = document.getElementById('btnModeQuick');
    if (btnFull && btnQuick) {
      btnFull.addEventListener('click', () => {
        btnFull.classList.add('active');
        btnQuick.classList.remove('active');
        this.setMode(true);
      });
      btnQuick.addEventListener('click', () => {
        btnQuick.classList.add('active');
        btnFull.classList.remove('active');
        this.setMode(false);
      });
    }
  }
}

window.QuizManager = QuizManager;
