// ===== ELEMENTOS DOM =====
const formMovimento = document.getElementById('formMovimento');
const descricao = document.getElementById('descricao');
const valor = document.getElementById('valor');
const tipo = document.getElementById('tipo');
const categoria = document.getElementById('categoria');
const data = document.getElementById('data');
const listaMovimentacoes = document.getElementById('listaMovimentacoes');

const totalEntradas = document.getElementById('totalEntradas');
const totalSaidas = document.getElementById('totalSaidas');
const saldoAtual = document.getElementById('saldoAtual');
const maiorCategoria = document.getElementById('maiorCategoria');

const filtroDescricao = document.getElementById('filtroDescricao');
const filtroCategoria = document.getElementById('filtroCategoria');
const periodoGrafico = document.getElementById('periodoGrafico');

// ===== ESTADO =====
let movimentacoes = [];
let modoEdicao = false;
let idEditando = null;
let chartEvolucao = null;
let chartEntradasCat = null;
let chartSaidasCat = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
    carregar();
    atualizar();
});

// ===== SALVAR (criar ou editar) =====
function salvar(e) {
    e.preventDefault();

    const mov = {
        id: Date.now(),
        descricao: descricao.value.trim(),
        valor: Number(valor.value),
        tipo: tipo.value,
        categoria: categoria.value,
        data: data.value
    };

    if (modoEdicao) {
        movimentacoes = movimentacoes.map(m => {
            if (m.id === idEditando) {
                return { ...m, ...mov };
            }
            return m;
        });
        modoEdicao = false;
        idEditando = null;
        mostrar("Atualizado!");
    } else {
        movimentacoes.push(mov);
        mostrar("Adicionado!");
    }

    salvarLocal();
    atualizar();
    formMovimento.reset();
}

// ===== EDITAR =====
function editar(id) {
    const m = movimentacoes.find(x => x.id === id);
    if (!m) return;

    descricao.value = m.descricao;
    valor.value = m.valor;
    tipo.value = m.tipo;
    categoria.value = m.categoria;
    data.value = m.data;

    modoEdicao = true;
    idEditando = id;

    mostrar("Modo edição");
}

// ===== REMOVER =====
function remover(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    movimentacoes = movimentacoes.filter(m => m.id !== id);
    salvarLocal();
    atualizar();
    mostrar("Removido!");
}

// ===== LOCALSTORAGE =====
function salvarLocal() {
    localStorage.setItem("dados", JSON.stringify(movimentacoes));
}

function carregar() {
    const dados = localStorage.getItem("dados");
    if (dados) movimentacoes = JSON.parse(dados);
}

// ===== FILTRO =====
function filtrar(lista) {
    const t = filtroDescricao.value.toLowerCase();
    const c = filtroCategoria.value;

    return lista.filter(i =>
        i.descricao.toLowerCase().includes(t) &&
        (c === "" || i.categoria === c)
    );
}

// ===== CÁLCULOS =====
function entradas(l) {
    return l.filter(i => i.tipo === "entrada")
        .reduce((a, b) => a + b.valor, 0);
}

function saidas(l) {
    return l.filter(i => i.tipo === "saida")
        .reduce((a, b) => a + b.valor, 0);
}

function saldo(l) {
    return entradas(l) - saidas(l);
}

function maiorCategoriaGasto(lista) {
    const gastos = {};
    lista.forEach(item => {
        if (item.tipo === "saida") {
            gastos[item.categoria] = (gastos[item.categoria] || 0) + item.valor;
        }
    });
    let maior = "-";
    let valorMaior = 0;
    for (let cat in gastos) {
        if (gastos[cat] > valorMaior) {
            valorMaior = gastos[cat];
            maior = cat;
        }
    }
    return maior;
}

// ===== ATUALIZAR VIEW =====
function atualizar() {
    const lista = filtrar(movimentacoes);

    const ent = entradas(lista);
    const sai = saidas(lista);
    const sal = saldo(lista);

    totalEntradas.textContent = format(ent);
    totalSaidas.textContent = format(sai);

    saldoAtual.textContent = format(sal);
    saldoAtual.className = sal >= 0 ? "positivo" : "negativo";

    maiorCategoria.textContent = maiorCategoriaGasto(lista) || "-";

    renderizarTabela(lista);
    renderizarGraficoEvolucao();
    renderizarGraficosCategoria();
}

// ===== TABELA =====
function renderizarTabela(lista) {
    listaMovimentacoes.innerHTML = "";

    if (lista.length === 0) {
        listaMovimentacoes.innerHTML =
            `<tr><td colspan="6" style="text-align:center; padding:20px; color:#999;">Nenhuma movimentação encontrada.</td></tr>`;
        return;
    }

    lista.forEach(m => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${m.data}</td>
            <td>${m.descricao}</td>
            <td>${m.categoria}</td>
            <td>${m.tipo}</td>
            <td>${format(m.valor)}</td>
            <td>
                <button class="btn-edit" onclick="editar(${m.id})">Editar</button>
                <button class="btn-delete" onclick="remover(${m.id})">Excluir</button>
            </td>
        `;
        listaMovimentacoes.appendChild(tr);
    });
}

// ===== GRÁFICO DE EVOLUÇÃO (BARRAS) =====
function renderizarGraficoEvolucao() {
    const periodo = periodoGrafico.value;
    const ctx = document.getElementById('graficoEvolucao').getContext('2d');

    let grupos = {};

    if (periodo === 'semanal') {
        movimentacoes.forEach(m => {
            const dataObj = new Date(m.data + 'T00:00:00');
            const dia = dataObj.getDay();
            const diff = dataObj.getDate() - dia + (dia === 0 ? -6 : 1);
            const inicioSemana = new Date(dataObj);
            inicioSemana.setDate(diff);
            inicioSemana.setHours(0, 0, 0, 0);
            const key = inicioSemana.toISOString().split('T')[0];
            const label =
                `${String(inicioSemana.getDate()).padStart(2,'0')}/${String(inicioSemana.getMonth()+1).padStart(2,'0')}`;

            if (!grupos[key]) {
                grupos[key] = { entrada: 0, saida: 0, label: label };
            }
            if (m.tipo === 'entrada') grupos[key].entrada += m.valor;
            else grupos[key].saida += m.valor;
        });
    } else {
        movimentacoes.forEach(m => {
            const dataObj = new Date(m.data + 'T00:00:00');
            const key = `${dataObj.getFullYear()}-${String(dataObj.getMonth()+1).padStart(2,'0')}`;
            const label = `${String(dataObj.getMonth()+1).padStart(2,'0')}/${dataObj.getFullYear()}`;

            if (!grupos[key]) {
                grupos[key] = { entrada: 0, saida: 0, label: label };
            }
            if (m.tipo === 'entrada') grupos[key].entrada += m.valor;
            else grupos[key].saida += m.valor;
        });
    }

    const chaves = Object.keys(grupos).sort();
    const labels = chaves.map(k => grupos[k].label);
    const entradasData = chaves.map(k => grupos[k].entrada);
    const saidasData = chaves.map(k => grupos[k].saida);

    if (chartEvolucao) chartEvolucao.destroy();

    if (chaves.length === 0) {
        const parent = document.getElementById('graficoEvolucao').parentNode;
        let msg = parent.querySelector('.chart-empty-msg');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'chart-empty-msg';
            msg.style.cssText =
                'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#999; font-size:16px; text-align:center; pointer-events:none;';
            msg.textContent = 'Sem dados para exibir';
            parent.style.position = 'relative';
            parent.appendChild(msg);
        }
        return;
    } else {
        const parent = document.getElementById('graficoEvolucao').parentNode;
        const msg = parent.querySelector('.chart-empty-msg');
        if (msg) msg.remove();
    }

    chartEvolucao = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Entradas',
                data: entradasData,
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: '#22c55e',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Saídas',
                data: saidasData,
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: '#ef4444',
                borderWidth: 1,
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + format(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return format(value);
                        }
                    }
                }
            }
        }
    });
}

// ===== GRÁFICOS DE ROSCA (ENTRADAS E SAÍDAS POR CATEGORIA) =====
function renderizarGraficosCategoria() {
    // Entradas por categoria
    const entradasPorCat = {};
    const saidasPorCat = {};

    movimentacoes.forEach(m => {
        if (m.tipo === 'entrada') {
            entradasPorCat[m.categoria] = (entradasPorCat[m.categoria] || 0) + m.valor;
        } else {
            saidasPorCat[m.categoria] = (saidasPorCat[m.categoria] || 0) + m.valor;
        }
    });

    // Cores
    const cores = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b'];

    // Gráfico Entradas
    const ctxEnt = document.getElementById('graficoEntradasCategoria').getContext('2d');
    if (chartEntradasCat) chartEntradasCat.destroy();

    const labelsEnt = Object.keys(entradasPorCat);
    const dataEnt = Object.values(entradasPorCat);

    if (labelsEnt.length > 0) {
        chartEntradasCat = new Chart(ctxEnt, {
            type: 'doughnut',
            data: {
                labels: labelsEnt,
                datasets: [{
                    data: dataEnt,
                    backgroundColor: cores.slice(0, labelsEnt.length),
                    borderWidth: 2,
                    borderColor: '#ffffff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 10,
                            font: { size: 11 },
                            color: '#1e293b'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${format(context.parsed)} (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '60%',
            }
        });
    } else {
        // Exibir mensagem de vazio
        const parent = document.getElementById('graficoEntradasCategoria').parentNode;
        let msg = parent.querySelector('.chart-empty-msg');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'chart-empty-msg';
            msg.style.cssText =
                'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#999; font-size:14px; text-align:center; pointer-events:none;';
            msg.textContent = 'Sem entradas';
            parent.style.position = 'relative';
            parent.appendChild(msg);
        }
    }

    // Gráfico Saídas
    const ctxSai = document.getElementById('graficoSaidasCategoria').getContext('2d');
    if (chartSaidasCat) chartSaidasCat.destroy();

    const labelsSai = Object.keys(saidasPorCat);
    const dataSai = Object.values(saidasPorCat);

    if (labelsSai.length > 0) {
        chartSaidasCat = new Chart(ctxSai, {
            type: 'doughnut',
            data: {
                labels: labelsSai,
                datasets: [{
                    data: dataSai,
                    backgroundColor: cores.slice(0, labelsSai.length),
                    borderWidth: 2,
                    borderColor: '#ffffff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 10,
                            font: { size: 11 },
                            color: '#1e293b'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${format(context.parsed)} (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '60%',
            }
        });
    } else {
        const parent = document.getElementById('graficoSaidasCategoria').parentNode;
        let msg = parent.querySelector('.chart-empty-msg');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'chart-empty-msg';
            msg.style.cssText =
                'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#999; font-size:14px; text-align:center; pointer-events:none;';
            msg.textContent = 'Sem saídas';
            parent.style.position = 'relative';
            parent.appendChild(msg);
        }
    }
}

// ===== FORMATAR MOEDA =====
function format(v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ===== TOAST =====
function mostrar(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.classList.remove("show"), 2000);
}

// ===== EVENTOS =====
formMovimento.addEventListener("submit", salvar);

filtroDescricao.addEventListener("input", atualizar);
filtroCategoria.addEventListener("change", atualizar);
periodoGrafico.addEventListener("change", renderizarGraficoEvolucao);