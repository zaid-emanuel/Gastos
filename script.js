const inputDescripcion = document.getElementById('descripcion');
const inputMonto = document.getElementById('monto');
const botonAgregar = document.getElementById('btn-agregar');
const listaGastos = document.getElementById('lista-gastos');
const totalTexto = document.getElementById('total');

let gastos = [];

function calcularTotal() {
  const total = gastos.reduce((suma, gasto) => suma + gasto.monto, 0);
  totalTexto.textContent = `Total: $${total.toFixed(2)}`;
}

function renderizarGastos() {
  listaGastos.innerHTML = '';
  gastos.forEach((gasto) => {
    const li = document.createElement('li');
    li.textContent = `${gasto.descripcion} - $${gasto.monto.toFixed(2)}`;
    listaGastos.appendChild(li);
  });
  calcularTotal();
}

function agregarGasto() {
  const descripcion = inputDescripcion.value.trim();
  const monto = parseFloat(inputMonto.value);

  if (descripcion === '' || isNaN(monto) || monto <= 0) return;

  gastos.push({ descripcion, monto });

  inputDescripcion.value = '';
  inputMonto.value = '';
  renderizarGastos();
}

botonAgregar.addEventListener('click', agregarGasto);

const inputCategoria = document.getElementById('categoria');

// ... (mantén lo anterior)

function renderizarGastos() {
  listaGastos.innerHTML = '';
  gastos.forEach((gasto) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${gasto.descripcion}</span>
      <span class="etiqueta-categoria">${gasto.categoria}</span>
      <span>$${gasto.monto.toFixed(2)}</span>
    `;
    listaGastos.appendChild(li);
  });
  calcularTotal();
  calcularTotal();
  renderizarGrafica();
}

function agregarGasto() {
  const descripcion = inputDescripcion.value.trim();
  const monto = parseFloat(inputMonto.value);
  const categoria = inputCategoria.value;

  if (descripcion === '' || isNaN(monto) || monto <= 0) return;

  gastos.push({ descripcion, monto, categoria });

  inputDescripcion.value = '';
  inputMonto.value = '';
  renderizarGastos();
}

const contenedorGrafica = document.getElementById('grafica-barras');

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