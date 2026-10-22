/* ==========================================================================
   SIMULADORES INTERACTIVOS DE FÍSICA: TRABAJO, POTENCIA Y ENERGÍA
   Coordinación: Prof. Luis Hernando Blandón Dávila - Coordinador Física PAFEM
   Colegios: I.E. Diego Maya Salazar, I.E. Jaime Salazar Robledo, I.E. Hugo Ángel Mejía
   Física Newtoneana, Algoritmos Numéricos, Canvas Touch & Mouse Friendly
   ========================================================================== */

// Utilidad para ajustar resolución de Canvas en pantallas Retina / 4K
function setupHiDPICanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, width: rect.width, height: rect.height };
}

// Dibujar punta de flecha vectorial
function drawArrow(ctx, fromX, fromY, toX, toY, color = '#38bdf8', lineWidth = 3, arrowSize = 8) {
  const headlen = arrowSize;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);
  
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ==========================================================================
   1. SIMULADOR DE TRABAJO MECÁNICO Y PRODUCTO ESCALAR (HOJA 2)
   ========================================================================== */
class WorkSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Variables Físicas
    this.F = 60; // Fuerza en Newtons (0 a 100)
    this.theta = 30; // Ángulo en grados (-90 a 180)
    this.d = 8; // Desplazamiento en metros (1 a 20)
    this.mu = 0.15; // Coeficiente de fricción cinética
    this.mass = 15; // Masa en kg
    this.g = 9.8;

    // Estado de Animación y Arrastre
    this.blockProgress = 0; // 0 a 1 durante animación
    this.isAnimating = false;
    this.isDraggingVector = false;

    this.initEvents();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.render();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 600;
    this.height = rect.height || 250;
    this.canvas.width = this.width * (window.devicePixelRatio || 1);
    this.canvas.height = this.height * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    this.render();
  }

  initEvents() {
    const handleDown = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      const blockX = 100 + this.blockProgress * (this.width - 240);
      const blockY = this.height - 70;
      const originX = blockX + 35;
      const originY = blockY + 25;
      
      const rad = (-this.theta * Math.PI) / 180;
      const vecLen = this.F * 1.3;
      const tipX = originX + vecLen * Math.cos(rad);
      const tipY = originY + vecLen * Math.sin(rad);

      const dist = Math.hypot(x - tipX, y - tipY);
      if (dist < 30) {
        this.isDraggingVector = true;
      }
    };

    const handleMove = (clientX, clientY) => {
      if (!this.isDraggingVector) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const blockX = 100 + this.blockProgress * (this.width - 240);
      const originX = blockX + 35;
      const originY = this.height - 45;

      const dx = x - originX;
      const dy = -(y - originY); // Sistema cartesiano clásico

      let angle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
      let mag = Math.round(Math.hypot(dx, dy) / 1.3);

      this.theta = Math.max(-90, Math.min(180, angle));
      this.F = Math.max(0, Math.min(100, mag));

      this.updateUIControls();
      this.render();
    };

    const handleUp = () => {
      this.isDraggingVector = false;
    };

    this.canvas.addEventListener('mousedown', (e) => handleDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', handleUp);

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) handleDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0 && this.isDraggingVector) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', handleUp);
  }

  updateUIControls() {
    const sliderF = document.getElementById('sliderWorkF');
    const sliderTheta = document.getElementById('sliderWorkTheta');
    const valF = document.getElementById('valWorkF');
    const valTheta = document.getElementById('valWorkTheta');
    if (sliderF) sliderF.value = this.F;
    if (sliderTheta) sliderTheta.value = this.theta;
    if (valF) valF.innerText = `${this.F} N`;
    if (valTheta) valTheta.innerText = `${this.theta}°`;
  }

  animate() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.blockProgress = 0;
    const start = performance.now();
    const duration = 1800;

    const step = (now) => {
      const elapsed = now - start;
      this.blockProgress = Math.min(1, elapsed / duration);
      this.render();
      if (this.blockProgress < 1) {
        requestAnimationFrame(step);
      } else {
        this.isAnimating = false;
      }
    };
    requestAnimationFrame(step);
  }

  reset() {
    this.blockProgress = 0;
    this.isAnimating = false;
    this.render();
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Fondo y suelo
    const groundY = this.height - 40;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, groundY, this.width, 40);

    // Línea de suelo con rugosidad
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(this.width, groundY);
    ctx.stroke();

    for (let x = 10; x < this.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x - 8, groundY + 8);
      ctx.stroke();
    }

    // Posición del bloque
    const startX = 80;
    const maxTravel = this.width - 200;
    const blockX = startX + this.blockProgress * maxTravel * (this.d / 20);
    const blockW = 70;
    const blockH = 50;
    const blockY = groundY - blockH;

    // Regla graduada de desplazamiento
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(startX + blockW / 2, groundY + 18);
    ctx.lineTo(startX + blockW / 2 + maxTravel * (this.d / 20), groundY + 18);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(`Δr = ${this.d.toFixed(1)} m`, startX + blockW / 2 + (maxTravel * (this.d / 20)) / 2 - 25, groundY + 32);

    // Bloque masa m
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(blockX, blockY, blockW, blockH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.mass} kg`, blockX + blockW / 2, blockY + blockH / 2 + 4);

    // Origen de vectores en el centro del bloque
    const originX = blockX + blockW / 2;
    const originY = blockY + blockH / 2;

    // Vectores: Peso y Normal
    drawArrow(ctx, originX, originY, originX, originY + 45, '#ef4444', 2, 6); // Peso mg
    ctx.fillStyle = '#ef4444';
    ctx.font = '10px monospace';
    ctx.fillText('mg', originX - 15, originY + 40);

    const rad = (-this.theta * Math.PI) / 180;
    const Fy = this.F * Math.sin(-rad); // Positivo hacia arriba
    const normalVal = Math.max(0, this.mass * this.g - Fy);
    if (normalVal > 0) {
      drawArrow(ctx, originX, originY, originX, originY - 45, '#10b981', 2, 6); // Normal
      ctx.fillStyle = '#10b981';
      ctx.fillText('N', originX - 15, originY - 35);
    }

    // Fricción
    const fk = this.mu * normalVal;
    if (fk > 0) {
      drawArrow(ctx, blockX, groundY, blockX - Math.min(45, fk * 0.8), groundY, '#f59e0b', 2.5, 6);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('fk', blockX - 25, groundY - 6);
    }

    // Vector Fuerza F aplicada (interactivo)
    const vecLen = this.F * 1.3;
    const tipX = originX + vecLen * Math.cos(rad);
    const tipY = originY + vecLen * Math.sin(rad);

    // Componentes rectangulares Fx y Fy punteadas
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(tipX, originY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.restore();

    drawArrow(ctx, originX, originY, tipX, tipY, '#38bdf8', 3.5, 10);

    // Manija de arrastre interactivo en la punta de F
    ctx.beginPath();
    ctx.arc(tipX, tipY, 7, 0, Math.PI * 2);
    ctx.fillStyle = this.isDraggingVector ? '#facc15' : '#38bdf8';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ángulo theta (arco)
    ctx.save();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const startAngle = 0;
    const endAngle = rad;
    ctx.arc(originX, originY, 30, Math.min(startAngle, endAngle), Math.max(startAngle, endAngle));
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`θ=${this.theta}°`, originX + 42 * Math.cos(rad / 2), originY + 42 * Math.sin(rad / 2));
    ctx.restore();

    // Cálculos y Telemetría en pantalla
    const cosVal = Math.cos((this.theta * Math.PI) / 180);
    const workF = this.F * this.d * cosVal;
    const workFk = -fk * this.d;
    const netWork = workF + workFk;

    const telemEl = document.getElementById('workSimTelemetry');
    if (telemEl) {
      let workClass = 'text-green';
      let workType = 'TRABAJO MOTOR (Acelera)';
      if (Math.abs(workF) < 0.1) {
        workType = 'TRABAJO NULO (θ = 90°)';
        workClass = 'text-amber';
      } else if (workF < 0) {
        workType = 'TRABAJO RESISTENTE (Frena)';
        workClass = 'text-rose';
      }

      telemEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
          <span><strong>W_F:</strong> ${(workF).toFixed(1)} J (F·d·cosθ)</span>
          <span><strong>W_fricción:</strong> ${(workFk).toFixed(1)} J</span>
          <span><strong>W_neto:</strong> ${(netWork).toFixed(1)} J</span>
          <span style="font-weight:bold; color:${workF > 0 ? '#34d399' : workF < 0 ? '#f87171' : '#facc15'}">${workType}</span>
        </div>
      `;
    }
  }
}

/* ==========================================================================
   2. SIMULADOR DEL TEOREMA TRABAJO Y ENERGÍA CINÉTICA (HOJA 3)
   ========================================================================== */
class WorkEnergySimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.mass = 800; // Carro 800 kg
    this.v0 = 20; // m/s (~72 km/h)
    this.mu = 0.5; // Coeficiente de fricción
    this.g = 9.8;

    this.simTime = 0;
    this.currentV = this.v0;
    this.currentX = 0;
    this.isBraking = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.render();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 600;
    this.height = rect.height || 220;
    this.canvas.width = this.width * (window.devicePixelRatio || 1);
    this.canvas.height = this.height * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    this.render();
  }

  startBrake() {
    this.currentV = this.v0;
    this.currentX = 0;
    this.simTime = 0;
    this.isBraking = true;
    let lastTime = performance.now();

    const stoppingDist = (this.v0 * this.v0) / (2 * this.mu * this.g);
    const totalTime = this.v0 / (this.mu * this.g);

    const loop = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (this.isBraking && this.currentV > 0) {
        this.currentV = Math.max(0, this.currentV - this.mu * this.g * dt);
        this.currentX += this.currentV * dt;
        this.render();
        requestAnimationFrame(loop);
      } else {
        this.isBraking = false;
        this.render();
      }
    };
    requestAnimationFrame(loop);
  }

  reset() {
    this.currentV = this.v0;
    this.currentX = 0;
    this.isBraking = false;
    this.render();
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const groundY = this.height - 40;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, groundY, this.width, 40);

    const stoppingDist = (this.v0 * this.v0) / (2 * this.mu * this.g);
    const pxPerMeter = (this.width - 150) / Math.max(60, stoppingDist * 1.3);

    // Pista de frenado con huellas de neumáticos
    const carX = 50 + this.currentX * pxPerMeter;
    const carW = 60;
    const carH = 30;
    const carY = groundY - carH;

    if (this.currentX > 0) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(50 + carW / 2, groundY - 2);
      ctx.lineTo(carX + carW / 2, groundY - 2);
      ctx.stroke();
    }

    // Dibujar vehículo estilizado
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(carX, carY, carW, carH, [6, 12, 2, 2]);
    ctx.fill();

    // Ruedas
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(carX + 15, groundY - 5, 8, 0, Math.PI * 2);
    ctx.arc(carX + carW - 15, groundY - 5, 8, 0, Math.PI * 2);
    ctx.fill();

    // Línea de meta / parada teórica
    const targetX = 50 + stoppingDist * pxPerMeter;
    ctx.strokeStyle = '#f59e0b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(targetX + carW / 2, groundY - 60);
    ctx.lineTo(targetX + carW / 2, groundY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b';
    ctx.font = '10px monospace';
    ctx.fillText(`d_frenado = ${stoppingDist.toFixed(1)} m`, targetX - 25, groundY - 65);

    // Cálculos de Energía Cinética y Teorema
    const Ki = 0.5 * this.mass * this.v0 * this.v0;
    const Kf = 0.5 * this.mass * this.currentV * this.currentV;
    const Wnet = Kf - Ki;

    // Actualizar Telemetría en HTML
    const telem = document.getElementById('workEnergyTelemetry');
    if (telem) {
      telem.innerHTML = `
        <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
          <span><strong>v:</strong> ${this.currentV.toFixed(1)} m/s (${(this.currentV * 3.6).toFixed(0)} km/h)</span>
          <span><strong>K_inicial:</strong> ${(Ki / 1000).toFixed(1)} kJ</span>
          <span><strong>K_actual:</strong> ${(Kf / 1000).toFixed(1)} kJ</span>
          <span><strong>W_fricción:</strong> ${(Wnet / 1000).toFixed(1)} kJ</span>
        </div>
      `;
    }
  }
}

/* ==========================================================================
   3. SIMULADOR DEL RESORTE DE HOOKE Y ENERGÍA ELÁSTICA (HOJA 4)
   ========================================================================== */
class SpringSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.k = 80; // Constante elástica N/m (20 a 200)
    this.x = 0.6; // Deformación en metros (-1.0 a 1.0)
    this.mass = 2.0; // kg

    this.isDragging = false;
    this.isOscillating = false;
    this.vx = 0;

    this.initEvents();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.render();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 600;
    this.height = rect.height || 240;
    this.canvas.width = this.width * (window.devicePixelRatio || 1);
    this.canvas.height = this.height * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    this.render();
  }

  initEvents() {
    const handleDown = (clientX) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const originX = 180;
      const scale = 120; // px por metro
      const blockX = originX + this.x * scale;
      if (Math.abs(clickX - blockX) < 40) {
        this.isDragging = true;
        this.isOscillating = false;
      }
    };

    const handleMove = (clientX) => {
      if (!this.isDragging) return;
      const rect = this.canvas.getBoundingClientRect();
      const curX = clientX - rect.left;
      const originX = 180;
      const scale = 120;
      let newX = (curX - originX) / scale;
      this.x = Math.max(-1.1, Math.min(1.1, newX));
      
      const slider = document.getElementById('sliderSpringX');
      const valEl = document.getElementById('valSpringX');
      if (slider) slider.value = this.x;
      if (valEl) valEl.innerText = `${this.x.toFixed(2)} m`;
      
      this.render();
    };

    const handleUp = () => {
      this.isDragging = false;
    };

    this.canvas.addEventListener('mousedown', (e) => handleDown(e.clientX));
    window.addEventListener('mousemove', (e) => handleMove(e.clientX));
    window.addEventListener('mouseup', handleUp);

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) handleDown(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0 && this.isDragging) handleMove(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', handleUp);
  }

  toggleOscillate() {
    if (this.isOscillating) {
      this.isOscillating = false;
      return;
    }
    this.isOscillating = true;
    this.vx = 0;
    let lastTime = performance.now();

    const loop = (now) => {
      if (!this.isOscillating) return;
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;

      // Ecuación de movimiento del oscilador armónico simple F = -kx - b*v
      const Fs = -this.k * this.x;
      const damping = -0.15 * this.vx;
      const a = (Fs + damping) / this.mass;

      this.vx += a * dt;
      this.x += this.vx * dt;

      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const groundY = this.height - 45;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, groundY, this.width, 45);

    // Pared rígida izquierda
    ctx.fillStyle = '#334155';
    ctx.fillRect(20, 30, 25, groundY - 30);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(45, 30);
    ctx.lineTo(45, groundY);
    ctx.stroke();

    // Posición de equilibrio x = 0
    const originX = 180;
    const scale = 120;
    const blockX = originX + this.x * scale;
    const blockW = 55;
    const blockH = 45;
    const blockY = groundY - blockH;

    // Línea de referencia de equilibrio x = 0
    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(originX, 30);
    ctx.lineTo(originX, groundY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('x = 0 (Equilibrio)', originX - 35, 25);

    // Dibujar espiras del resorte de Hooke
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(45, groundY - blockH / 2);

    const springLen = blockX - 45;
    const coils = 14;
    const coilW = springLen / coils;
    for (let i = 0; i < coils; i++) {
      const cx = 45 + (i + 0.5) * coilW;
      const cy = (groundY - blockH / 2) + (i % 2 === 0 ? -14 : 14);
      ctx.lineTo(cx, cy);
    }
    ctx.lineTo(blockX, groundY - blockH / 2);
    ctx.stroke();

    // Bloque interactivo
    ctx.fillStyle = '#8b5cf6';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(blockX, blockY, blockW, blockH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Masa', blockX + blockW / 2, blockY + blockH / 2 + 4);

    // Vector de fuerza restauradora F_s = -kx
    const Fs = -this.k * this.x;
    if (Math.abs(Fs) > 1) {
      const arrowLen = Math.min(80, Math.abs(Fs) * 0.7);
      const toX = blockX + blockW / 2 + (Fs > 0 ? arrowLen : -arrowLen);
      drawArrow(ctx, blockX + blockW / 2, blockY - 10, toX, blockY - 10, '#f43f5e', 2.5, 6);
      ctx.fillStyle = '#f43f5e';
      ctx.font = '10px monospace';
      ctx.fillText(`Fs = ${Fs.toFixed(1)} N`, blockX + blockW / 2, blockY - 20);
    }

    // Mini gráfica en la esquina derecha: F vs x (Área bajo la curva = 1/2 k x^2)
    const graphW = 160;
    const graphH = 90;
    const graphX = this.width - graphW - 15;
    const graphY = 20;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.fillRect(graphX, graphY, graphW, graphH);
    ctx.strokeRect(graphX, graphY, graphW, graphH);

    // Ejes cartesianos
    const gOriginX = graphX + graphW / 2;
    const gOriginY = graphY + graphH / 2;
    ctx.strokeStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(graphX + 5, gOriginY);
    ctx.lineTo(graphX + graphW - 5, gOriginY); // Eje x
    ctx.moveTo(gOriginX, graphY + 5);
    ctx.lineTo(gOriginX, graphY + graphH - 5); // Eje F
    ctx.stroke();

    // Triángulo sombreado de área (Trabajo / Energía Elástica)
    const curGX = gOriginX + (this.x / 1.2) * (graphW / 2 - 10);
    const curGF = gOriginY - (Fs / (this.k * 1.2)) * (graphH / 2 - 10);

    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.beginPath();
    ctx.moveTo(gOriginX, gOriginY);
    ctx.lineTo(curGX, gOriginY);
    ctx.lineTo(curGX, curGF);
    ctx.closePath();
    ctx.fill();

    // Línea de la Ley de Hooke F = kx
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(graphX + 10, gOriginY + (graphH / 2 - 12));
    ctx.lineTo(graphX + graphW - 10, gOriginY - (graphH / 2 - 12));
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText('F vs x', graphX + 8, graphY + 12);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Área = U_e`, graphX + graphW - 55, graphY + 12);

    // Telemetría
    const Ue = 0.5 * this.k * this.x * this.x;
    const telem = document.getElementById('springSimTelemetry');
    if (telem) {
      telem.innerHTML = `
        <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
          <span><strong>k:</strong> ${this.k} N/m</span>
          <span><strong>x:</strong> ${this.x.toFixed(2)} m</span>
          <span><strong>F_resorte:</strong> ${Fs.toFixed(1)} N</span>
          <span><strong>Energía Potencial Elástica (U_e):</strong> ${Ue.toFixed(2)} J</span>
        </div>
      `;
    }
  }
}

/* ==========================================================================
   4. SIMULADOR DE MONTAÑA RUSA: CONSERVACIÓN DE ENERGÍA MECÁNICA (HOJA 5)
   ========================================================================== */
class RollerCoasterSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.mass = 50; // kg
    this.g = 9.8; // m/s^2
    this.frictionEnabled = false;

    // Estado del patinador / carrito
    this.s = 0.05; // Posición a lo largo de la pista (0 a 1)
    this.v = 0; // Rapidez escalar
    this.Eth = 0; // Energía térmica disipada
    this.initialHeight = 8; // metros

    this.isPlaying = true;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.startLoop();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 600;
    this.height = rect.height || 260;
    this.canvas.width = this.width * (window.devicePixelRatio || 1);
    this.canvas.height = this.height * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    this.render();
  }

  // Ecuación de la pista paramétrica y = f(s)
  getTrackPoint(s) {
    const w = this.width;
    const h = this.height - 40;
    const x = s * w;
    // Pista: Colina inicial alta -> Valle -> Bucle / Colina media -> Valle
    const normX = s * 2 * Math.PI;
    const yNorm = 0.5 * Math.cos(normX) + 0.3 * Math.cos(2 * normX);
    // Convertir a coordenadas de canvas
    const y = 50 + (1 - (yNorm + 0.8) / 1.6) * (h - 70);
    // Altura física h (0 en el punto más bajo, max 10 m)
    const physicalH = ((h - y) / (h - 50)) * 10;
    return { x, y, physicalH };
  }

  startLoop() {
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.03, (now - last) / 1000);
      last = now;

      if (this.isPlaying) {
        this.updatePhysics(dt);
      }
      this.render();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  updatePhysics(dt) {
    const p = this.getTrackPoint(this.s);
    const pNext = this.getTrackPoint(Math.min(1, this.s + 0.005));
    const pPrev = this.getTrackPoint(Math.max(0, this.s - 0.005));

    // Pendiente y aceleración tangencial g * sin(alpha)
    const dx = pNext.x - pPrev.x;
    const dy = pNext.y - pPrev.y;
    const angle = Math.atan2(dy, dx);
    const aTangential = this.g * Math.sin(angle);

    let frictionAcc = 0;
    if (this.frictionEnabled && Math.abs(this.v) > 0.1) {
      frictionAcc = -Math.sign(this.v) * 0.8;
      this.Eth += Math.abs(frictionAcc * this.mass * this.v * dt);
    }

    this.v += (aTangential + frictionAcc) * dt * 8; // Escala visual de velocidad
    this.s += (this.v * dt) / this.width;

    if (this.s >= 1) {
      this.s = 1;
      this.v = -this.v * 0.95; // Rebote suave en extremos
    } else if (this.s <= 0) {
      this.s = 0;
      this.v = -this.v * 0.95;
    }
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
  }

  reset() {
    this.s = 0.05;
    this.v = 0;
    this.Eth = 0;
    this.render();
  }

  setGravity(val) {
    this.g = val;
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Fondo cielo con estrellas sutiles
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, this.width, this.height);

    // Dibujar la pista completa
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const pt = this.getTrackPoint(i / 100);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // Riel superior brillante
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Carrito en la posición s
    const curPt = this.getTrackPoint(this.s);
    ctx.save();
    ctx.translate(curPt.x, curPt.y);

    const nextPt = this.getTrackPoint(Math.min(1, this.s + 0.01));
    const trackAngle = Math.atan2(nextPt.y - curPt.y, nextPt.x - curPt.x);
    ctx.rotate(trackAngle);

    // Cuerpo del carrito
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(-16, -14, 32, 14, 4);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Ruedas
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-10, 0, 4, 0, Math.PI * 2);
    ctx.arc(10, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Energías
    const Ug = this.mass * this.g * curPt.physicalH;
    const K = 0.5 * this.mass * (this.v * 0.4) * (this.v * 0.4);
    const Etotal = K + Ug + this.Eth;

    // Actualizar barras de energía en UI
    const barK = document.getElementById('barEnergyK');
    const barU = document.getElementById('barEnergyU');
    const barTh = document.getElementById('barEnergyTh');
    const barTotal = document.getElementById('barEnergyTotal');

    const maxE = Math.max(1, Etotal);
    if (barK) barK.style.width = `${Math.min(100, (K / maxE) * 100)}%`;
    if (barU) barU.style.width = `${Math.min(100, (Ug / maxE) * 100)}%`;
    if (barTh) barTh.style.width = `${Math.min(100, (this.Eth / maxE) * 100)}%`;
    if (barTotal) barTotal.style.width = '100%';

    const valK = document.getElementById('valEnergyK');
    const valU = document.getElementById('valEnergyU');
    const valTh = document.getElementById('valEnergyTh');
    const valTotal = document.getElementById('valEnergyTotal');
    if (valK) valK.innerText = `${K.toFixed(0)} J`;
    if (valU) valU.innerText = `${Ug.toFixed(0)} J`;
    if (valTh) valTh.innerText = `${this.Eth.toFixed(0)} J`;
    if (valTotal) valTotal.innerText = `${Etotal.toFixed(0)} J`;
  }
}

/* ==========================================================================
   5. SIMULADOR DE POTENCIA MECÁNICA Y ELEVADOR DE CARGA (HOJA 6)
   ========================================================================== */
class PowerSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.mass = 400; // kg
    this.heightTarget = 15; // metros
    this.timeTarget = 8; // segundos
    this.g = 9.8;

    this.currentH = 0;
    this.isLifting = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.render();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 600;
    this.height = rect.height || 230;
    this.canvas.width = this.width * (window.devicePixelRatio || 1);
    this.canvas.height = this.height * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    this.render();
  }

  lift() {
    if (this.isLifting) return;
    this.isLifting = true;
    this.currentH = 0;
    const start = performance.now();
    const duration = this.timeTarget * 1000;

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      this.currentH = progress * this.heightTarget;
      this.render();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.isLifting = false;
      }
    };
    requestAnimationFrame(step);
  }

  reset() {
    this.currentH = 0;
    this.isLifting = false;
    this.render();
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Fondo y edificio
    const groundY = this.height - 35;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, groundY, this.width, 35);

    // Torre de la grúa / Pozo de elevador
    const shaftX = 140;
    const shaftW = 90;
    const shaftTopY = 30;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(shaftX, shaftTopY, shaftW, groundY - shaftTopY);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(shaftX, shaftTopY, shaftW, groundY - shaftTopY);

    // Motor en la cima
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(shaftX + 20, shaftTopY - 18, 50, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('MOTOR', shaftX + 27, shaftTopY - 6);

    // Cable y Carga
    const maxLiftPx = (groundY - 50) - (shaftTopY + 10);
    const loadY = (groundY - 45) - (this.currentH / this.heightTarget) * maxLiftPx;

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shaftX + 45, shaftTopY);
    ctx.lineTo(shaftX + 45, loadY);
    ctx.stroke();

    // Cabina / Carga
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(shaftX + 20, loadY, 50, 40, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.mass} kg`, shaftX + 45, loadY + 24);

    // Escala vertical
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(`h = ${this.currentH.toFixed(1)} m / ${this.heightTarget} m`, shaftX + shaftW + 15, loadY + 24);

    // Cálculos de Potencia
    const Work = this.mass * this.g * this.heightTarget;
    const PowerWatts = Work / this.timeTarget;
    const PowerHp = PowerWatts / 745.7;
    const kWh = (PowerWatts * (this.timeTarget / 3600)) / 1000;

    const telem = document.getElementById('powerSimTelemetry');
    if (telem) {
      telem.innerHTML = `
        <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
          <span><strong>Trabajo Gravitacional:</strong> ${(Work / 1000).toFixed(1)} kJ</span>
          <span><strong>Potencia Media:</strong> ${PowerWatts.toFixed(0)} W (<strong>${PowerHp.toFixed(2)} HP</strong>)</span>
          <span><strong>Consumo:</strong> ${kWh.toFixed(4)} kWh</span>
        </div>
      `;
    }
  }
}

// Inicialización global de instancias
window.WorkSimulator = WorkSimulator;
window.WorkEnergySimulator = WorkEnergySimulator;
window.SpringSimulator = SpringSimulator;
window.RollerCoasterSimulator = RollerCoasterSimulator;
window.PowerSimulator = PowerSimulator;
