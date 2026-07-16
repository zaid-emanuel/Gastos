// ===== Referencias al DOM =====
const inputDescripcion = document.getElementById('descripcion');
const inputMonto = document.getElementById('monto');
const inputCategoria = document.getElementById('categoria');
const inputFecha = document.getElementById('fecha');
const botonAgregar = document.getElementById('btn-agregar');
const listaGastos = document.getElementById('lista-gastos');
const totalTexto = document.getElementById('total');
const contenedorGrafica = document.getElementById('grafica-barras');

// ===== Estado de la aplicación =====
let gastos = [];

// ===== Funciones =====
function calcularTotal() {
  const total = gastos.reduce((suma, gasto) => suma + gasto.monto, 0);
  totalTexto.textContent = `Total: $${total.toFixed(2)}`;
}

function renderizarGrafica() {
  contenedorGrafica.innerHTML = '';

  const totalesPorCategoria = {};
  gastos.forEach((gasto) => {
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
  gastos.forEach((gasto) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${gasto.descripcion}</span>
      <span class="etiqueta-categoria">${gasto.categoria}</span>
      <span class="etiqueta-fecha">${gasto.fecha}</span>
      <span>$${gasto.monto.toFixed(2)}</span>
    `;
    listaGastos.appendChild(li);
  });
  calcularTotal();
  renderizarGrafica();
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