// ===== Referencias al DOM =====
const inputDescripcion = document.getElementById('descripcion');
const inputMonto = document.getElementById('monto');
const inputCategoria = document.getElementById('categoria');
const inputFecha = document.getElementById('fecha');
const botonAgregar = document.getElementById('btn-agregar');
const listaGastos = document.getElementById('lista-gastos');
const totalTexto = document.getElementById('total');
const contenedorGrafica = document.getElementById('grafica-barras');
const botonesFiltro = document.querySelectorAll('[data-filtro]');
const inputLimite = document.getElementById('limite');
const mensajeLimite = document.getElementById('mensaje-limite');

// ===== Estado de la aplicación =====
let gastos = [];
let filtroActivo = 'todos';

// ===== Funciones =====
function obtenerGastosFiltrados() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (filtroActivo === 'todos') return gastos;

  return gastos.filter((gasto) => {
    const fechaGasto = new Date(gasto.fecha);
    fechaGasto.setHours(0, 0, 0, 0);

    if (filtroActivo === 'hoy') {
      return fechaGasto.getTime() === hoy.getTime();
    }

    if (filtroActivo === 'semana') {
      const diaSemana = hoy.getDay() === 0 ? 7 : hoy.getDay(); // Lunes=1 ... Domingo=7
      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - (diaSemana - 1));
      return fechaGasto >= inicioSemana && fechaGasto <= hoy;
    }

    if (filtroActivo === 'mes') {
      return (
        fechaGasto.getMonth() === hoy.getMonth() &&
        fechaGasto.getFullYear() === hoy.getFullYear()
      );
    }
  });
}

function calcularTotal(gastosVisibles) {
  const total = gastosVisibles.reduce((suma, gasto) => suma + gasto.monto, 0);
  totalTexto.textContent = `Total: $${total.toFixed(2)}`;
  return total;
}

function verificarLimite(totalActual) {
  const limite = parseFloat(inputLimite.value);

  if (isNaN(limite) || limite <= 0) {
    mensajeLimite.textContent = '';
    mensajeLimite.classList.remove('limite-excedido');
    return;
  }

  if (totalActual > limite) {
    mensajeLimite.textContent = `Has excedido tu límite mensual por $${(totalActual - limite).toFixed(2)}`;
    mensajeLimite.classList.add('limite-excedido');
  } else {
    mensajeLimite.textContent = `Disponible: $${(limite - totalActual).toFixed(2)}`;
    mensajeLimite.classList.remove('limite-excedido');
  }
}

function renderizarGrafica(gastosVisibles) {
  contenedorGrafica.innerHTML = '';

  const totalesPorCategoria = {};
  gastosVisibles.forEach((gasto) => {
    totalesPorCategoria[gasto.categoria] = (totalesPorCategoria[gasto.categoria] || 0) + gasto.monto;
  });

  const montoMaximo = Math.max(...Object.values(totalesPorCategoria), 1);

  Object.entries(totalesPorCategoria).forEach(([categoria, monto]) => {
    const fila = document.createElement('div');
    fila.classList.add('barra-fila');

    const etiqueta = document.createElement('span');
    etiqueta.classList.add('barra-etiqueta');
    etiqueta.textContent = `${categoria} ($${monto.toFixed(2)})`;

    const barra = document.createElement('div');
    barra.classList.add('barra');
    barra.style.width = `${(monto / montoMaximo) * 100}%`;

    fila.appendChild(etiqueta);
    fila.appendChild(barra);
    contenedorGrafica.appendChild(fila);
  });
}

function renderizarGastos() {
  listaGastos.innerHTML = '';
  const gastosVisibles = obtenerGastosFiltrados();

  gastosVisibles.forEach((gasto) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${gasto.descripcion}</span>
      <span class="etiqueta-categoria">${gasto.categoria}</span>
      <span class="etiqueta-fecha">${gasto.fecha}</span>
      <span>$${gasto.monto.toFixed(2)}</span>
    `;
    listaGastos.appendChild(li);
  });

  const total = calcularTotal(gastosVisibles);
  renderizarGrafica(gastosVisibles);
  verificarLimite(total);
}

function agregarGasto() {
  const descripcion = inputDescripcion.value.trim();
  const monto = parseFloat(inputMonto.value);
  const categoria = inputCategoria.value;
  const fecha = inputFecha.value || new Date().toISOString().split('T')[0];

  if (descripcion === '' || isNaN(monto) || monto <= 0) return;

  gastos.push({ descripcion, monto, categoria, fecha });

  inputDescripcion.value = '';
  inputMonto.value = '';
  inputFecha.value = '';
  renderizarGastos();
}

// ===== Eventos =====
botonAgregar.addEventListener('click', agregarGasto);

botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => {
    filtroActivo = boton.dataset.filtro;
    renderizarGastos();
  });
});

inputLimite.addEventListener('input', () => {
  const gastosVisibles = obtenerGastosFiltrados();
  const total = calcularTotal(gastosVisibles);
  verificarLimite(total);
});