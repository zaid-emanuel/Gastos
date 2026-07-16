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