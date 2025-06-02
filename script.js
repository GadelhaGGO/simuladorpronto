// ==========================
// Simulador Linha 5 Lilás JS (Ajuste: Áudio só para ao normalizar)
// ==========================

const falhasTremTextos = [
  "Mal súbito de passageiro",
  "Problema de sinalização",
  "Retenção de portas",
  "Freio acionado pelo CBTC",
  "Botão soco",
  "Sem laço de porta",
  "Intercom ar condicionado",
  "QRU01 Vias de fato",
  "QRU02 Comércio irregular",
  "QRU03 Pedinte",
  "QRU04 Importunação sexual",
  "QRU05 Roubo",
  "QRU06 Furto",
  "QRU07 Arma branca",
  "QRU08 Tumulto",
  "QRU09 Ocorrência com arma de fogo",
  "Meteoro caiu nos trilhos",
  "Codigo A",
  "Perda de comunicação", // Adicionado para ter 24 opções
  "Falha no ar condicionado",
  "Portas travadas",
  "Emergência a bordo",
  "Colisão com objeto",
  "Problema no pantógrafo",
  "Incêndio pequeno",
  "Vandalismo",
  "Alfa Bravo",
  "Falha no sistema de freios"
];
const falhasEstacaoTextos = [
  "Mal súbito de passageiro",
  "Queda de energia",
  "Passageiro perdido no sistema",
  "Codigo A",
  "Incêndio na estação", // Adicionado para ter 24 opções
  "Portões de plataforma com problema",
  "Inundação",
  "Problema na escada rolante",
  "Acesso bloqueado",
  "Fumaça na plataforma",
  "Alarme falso de incêndio",
  "Vazamento de água",
  "Problema na bilheteria",
  "Pichação",
  "Esgoto entupido",
  "Sistema de som inoperante",
  "Alarme de emergência ativado",
  "Sem luz na estação",
  "Ataque de abelhas",
  "Problema no elevador"
];

// ===============
// 24 trens, já prontos para serem espalhados com cores ajustadas
// ===============
const trens = Array.from({ length: 24 }).map((_, idx) => {
  let corClass = '';
  switch (idx + 1) { // Train IDs are 1-based
    case 6:
      corClass = 'ativa-trem-amareloescuro';
      break;
    case 7:
      corClass = 'ativa-trem-preta';
      break;
    case 8:
      corClass = 'ativa-trem-cinza';
      break;
    case 9:
      corClass = 'ativa-trem-marrom';
      break;
    case 10:
      corClass = 'ativa-trem-roxa';
      break;
    case 16:
      corClass = 'ativa-trem-azulclaro';
      break;
    case 17:
      corClass = 'ativa-trem-verdeescuro';
      break;
    case 18:
      corClass = 'ativa-trem-laranja';
      break;
    case 19:
      corClass = 'ativa-trem-rosa';
      break;
    case 20:
      corClass = 'ativa-trem-amareloescuro';
      break;
case 21:
      corClass = 'ativa-trem-marrom';
      break;
case 22:
      corClass = 'ativa-trem-preta';
      break;
case 23:
      corClass = 'ativa-trem-rosa';
      break;
case 24:
      corClass = 'ativa-trem-cinza';
      break;
    default:
      // Para os demais trens, repete as cores existentes ou define novas
      // O objetivo é ter 24 trens com cores distintas ou que se repitam de forma controlada
      // As 5 primeiras cores são ativa-trem1 a ativa-trem5
      // Para os trens 1-5, usam ativa-trem1 a ativa-trem5
      // Para os trens 11-15, podem usar as mesmas 5 ou outras 5
      // Vamos fazer com que os trens 1-5, 11-15 usem as 5 primeiras classes de cores
      corClass = `ativa-trem${((idx % 5) + 1)}`; // Reusa as primeiras 5 cores
      break;
  }
  return {
    id: idx + 1,
    cor: corClass,
    nome: `Trem ${String(idx + 1).padStart(2, '0')}`,
    delay: 0,
    status: 'Aguardando partida...',
    ativo: true,
    recolhido: false,
    falha: null
  };
});
function atualizarPOTECounter() {
    const trensOperando = trens.filter(t => t.ativo && !t.recolhido).length;
    document.getElementById('pote-value').textContent = trensOperando;
}
const estacoes_v2 = [
  "est1-v2", "est2-v2", "est3-v2", "est4-v2", "est5-v2", "est6-v2", "est7-v2",
  "est8-v2", "est9-v2", "est10-v2", "est11-v2", "est12-v2", "est13-v2", "est14-v2", "est15-v2", "est16-v2", "est17-v2"
];
const estacoes_v1 = [
  "est17", "est16", "est15", "est14", "est13", "est12", "est11", "est10", "est9", "est8", "est7", "est6", "est5", "est4", "est3", "est2", "est1"
];

const LOOP = [
  { via: 2, estacoes: estacoes_v2, sentido: "capao-klabin" },
  { via: 1, estacoes: estacoes_v1, sentido: "klabin-capao" }
];

let trensData = [];
let tempoTotal = 0;
let timer = null;
let trensReter = false;
let falhaEstacao = null;
let falhaEstacaoTipo = null;
let falhaEstacaoNome = '';
let falhaTrem = {};
let historico = [];
let recolhidos = [];
let inserindoTrem = false;
let falhaMensagem = '';
let falhaAudioIsPlaying = false;

// Caminho do áudio (ajustado para pasta local do usuário)
const FALHA_AUDIO_PATH = "DANGER Alarm Sound Effects.mp3"; // Nome do arquivo na mesma pasta do HTML/script

function resetarTudo() {
  pararTimer();
  trensData = [];
  for (const t of trens) {
    t.status = 'Aguardando partida...';
    t.ativo = true;
    t.recolhido = false;
    t.falha = null;
  }
  tempoTotal = 0;
  trensReter = false;
  falhaEstacao = null;
  falhaEstacaoTipo = null;
  falhaEstacaoNome = '';
  falhaTrem = {};
  recolhidos = [];
  inserindoTrem = false;
  historico = [];
  falhaMensagem = '';
  atualizarStatus();
  atualizarLinha();
  atualizarTempo();
  atualizarHistorico();
  mostrarFalhaInfo();
  document.getElementById('btnReterTrens').textContent = 'Reter Trens';
  atualizarTremRecolherSelect();
  atualizarTremInserirSelect();
  pararAudioFalha(); // NOVO: para sempre ao resetar/normalizar
atualizarPOTECounter(); // Atualiza o contador POTE
}

function atualizarTempo() {
  document.getElementById('tempo').textContent = `Tempo total: ${tempoTotal}s`;
}

function atualizarStatus() {
  const container = document.getElementById('status-trens');
  container.innerHTML = ''; // Limpa o container
  
  // Criar 4 colunas
  const colunas = [];
  for (let i = 0; i < 4; i++) {
    const col = document.createElement('div');
    col.className = 'status-col';
    container.appendChild(col);
    colunas.push(col);
  }
  
  // Distribuir os 24 trens nas colunas (6 por coluna)
  for (let i = 0; i < trens.length; i++) {
    const trem = trens[i];
    const colIndex = Math.floor(i / 6);
    const col = colunas[colIndex];
    
    let msg = '';
    if (trem.ativo && !trem.recolhido) {
      msg = `${trem.nome} `;
      if (trensData.length) {
        const data = trensData.find(td => td.id === trem.id);
        if (data) {
          const loopStep = data.loopStep;
          const idx = data.idx;
          const est = LOOP[loopStep].estacoes[idx];
          let statusEstacao = '';
          if (data.tempoParadoEstacao > 0) {
            statusEstacao = ` (Parado na estação: ${data.tempoParadoEstacao}s/3s)`;
          }
          msg += `na estação ${formatarEstacao(est)}${statusEstacao}`;
          if (trem.falha) msg += ` (FALHA: ${trem.falha})`;
          if (trensReter) msg += ` (Retido)`;
          if (falhaEstacao && est.replace('-v2', '') === falhaEstacao.replace('-v2', '')) msg += ` (Falha Estação)`;
          if (data.aguardandoProximoTrem) msg += ` (Aguardando liberação)`;
        } else {
          msg += trem.status;
        }
      } else {
        msg += trem.status;
      }
    } else {
      msg = `${trem.nome} [recolhido]`;
    }
    
    const statusEl = document.createElement('div');
    statusEl.id = `status-trem${trem.id}`;
    statusEl.textContent = msg;
    statusEl.style.color = trem.ativo ? '#222' : '#bbb';
    col.appendChild(statusEl);
  }
}

function atualizarLinha() {
  estacoes_v2.concat(estacoes_v1).forEach(e => {
    const el = document.getElementById(e);
    if (el) {
      el.className = 'estacao';
      let c = el.childNodes;
      for (let i = c.length - 1; i >= 0; i--) {
        if (c[i].classList && (c[i].classList.contains('trem-parado-msg') || c[i].classList.contains('trem-nome-label') || c[i].classList.contains('trem-num-label'))) {
          el.removeChild(c[i]);
        }
      }
    }
  });
  if (falhaEstacao) {
    const el = document.getElementById(falhaEstacao);
    if (el) el.classList.add('falha');
    const el2 = document.getElementById(falhaEstacao.replace('-v2', ''));
    if (el2) el2.classList.add('falha');
  }
  let ocupacao = {}; // This is not strictly used for rendering, but for logic
  for (const trem of trens) {
    if (!trem.ativo || trem.recolhido) continue;
    const tremData = trensData.find(td => td.id === trem.id);
    if (!tremData) continue;
    let loopStep = tremData.loopStep;
    let idx = tremData.idx;
    let viaArr = LOOP[loopStep].estacoes;
    let est = viaArr[idx];
    ocupacao[est] = trem.id;
  }
  for (const trem of trens) {
    if (!trem.ativo || trem.recolhido) continue;
    const tremData = trensData.find(td => td.id === trem.id);
    if (!tremData) continue;
    let loopStep = tremData.loopStep;
    let idx = tremData.idx;
    let viaArr = LOOP[loopStep].estacoes;
    let est = viaArr[idx];
    const el = document.getElementById(est);
    if (el) {
      el.classList.add(trem.cor);
      let numLabel = document.createElement('div');
      numLabel.className = "trem-num-label";
      numLabel.style.cssText = "position:absolute;top:-19px;left:10%;transform:translateX(-60%);background:#fff8;padding:2px 8px;border-radius:8px;font-weight:bold;font-size:14px;color:#222;border:1px solid #bbb;z-index:11;";
      numLabel.textContent = ` T ${trem.id.toString().padStart(2, '0')}`;
      el.appendChild(numLabel);
      if (trem.falha) {
        inserirParadoMsg(el, trem.falha);
      } else if (trensReter) {
        inserirParadoMsg(el, 'Retido');
      } else if (falhaEstacao && est.replace('-v2', '') === falhaEstacao.replace('-v2', '')) {
        inserirParadoMsg(el, falhaEstacaoTipo || 'Falha Estação');
      } else if (tremData.aguardandoProximoTrem) { // Display message when waiting for next train
        inserirParadoMsg(el, 'Aguardando');
      }
    }
  }
}

function inserirParadoMsg(el, msg) {
  if (!el.querySelector('.trem-parado-msg')) {
    let div = document.createElement('div');
    div.className = 'trem-parado-msg';
    div.textContent = msg;
    el.appendChild(div);
  }
}

// Função para espalhar os trens nas estações
function obterPosicoesIniciaisTrens() {
  const totalEstacoes = estacoes_v2.length + estacoes_v1.length;
  let posicoes = [];
  let ocupadas = new Set(); // Store occupied positions as "loopStep_idx"

  const numTracks = LOOP.length;

  for (let i = 0; i < trens.length; i++) {
    let bestLoopStep = -1;
    let bestIdx = -1;
    let maxDistance = -1;

    // Iterate through all possible starting positions to find the "freest" one
    for (let ls = 0; ls < numTracks; ls++) {
      const estacoesArr = LOOP[ls].estacoes;
      for (let j = 0; j < estacoesArr.length; j++) {
        const currentPosKey = `${ls}_${j}`;
        if (!ocupadas.has(currentPosKey)) {
          // Calculate distance to nearest occupied spot on this track
          let minDist = Infinity;
          for (let k = 0; k < estacoesArr.length; k++) {
            if (ocupadas.has(`${ls}_${k}`)) {
              minDist = Math.min(minDist, Math.abs(j - k));
            }
          }
          if (minDist === Infinity) minDist = estacoesArr.length; // If no other trains on track

          if (minDist > maxDistance) {
            maxDistance = minDist;
            bestLoopStep = ls;
            bestIdx = j;
          }
        }
      }
    }
    // If we couldn't find an ideal spot, just take the first available
    if (bestLoopStep === -1) {
      // Fallback: simply find the first available spot
      for (let ls = 0; ls < numTracks; ls++) {
        const estacoesArr = LOOP[ls].estacoes;
        for (let j = 0; j < estacoesArr.length; j++) {
          const currentPosKey = `${ls}_${j}`;
          if (!ocupadas.has(currentPosKey)) {
            bestLoopStep = ls;
            bestIdx = j;
            break;
          }
        }
        if (bestLoopStep !== -1) break;
      }
    }

    if (bestLoopStep !== -1) {
      posicoes.push({ loopStep: bestLoopStep, idx: bestIdx });
      ocupadas.add(`${bestLoopStep}_${bestIdx}`);
    } else {
      // This should ideally not happen if there are enough stations
      console.warn("Could not find a unique starting position for a train.");
      // Assign a default if no space is found (e.g., first station)
      posicoes.push({ loopStep: 0, idx: 0 });
    }
  }
  return posicoes;
}


function iniciarTrens() {
  resetarTudo();
  // Spread the 24 trens alternately across the stations of the two tracks
  const posicoes = obterPosicoesIniciaisTrens();
  trensData = trens.map((trem, i) => ({
    id: trem.id,
    loopStep: posicoes[i].loopStep,
    idx: posicoes[i].idx,
    delay: 0,
    aguardando: false, // Trains start moving immediately
    tempoParado: 0,
    tempoParadoEstacao: 0,
    aguardandoProximoTrem: false // New flag for waiting for next train
  }));
  atualizarLinha();
  atualizarStatus();
  atualizarTempo();
  timer = setInterval(avancarSimulacao, 1000);
  registrarHistorico('Simulação iniciada');
}

function pararTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}

function estacaoOcupada(loopStep, idx, tremId) {
  for (const trem of trens) {
    if (!trem.ativo || trem.recolhido || trem.id === tremId) continue;
    const data = trensData.find(td => td.id === trem.id);
    if (!data) continue;
    if (data.loopStep === loopStep && data.idx === idx) {
      return true;
    }
  }
  return false;
}


function proximaPosicaoOcupada(loopStep, idx, tremId) {
  const currentLoop = LOOP[loopStep];
  const estacoesArr = currentLoop.estacoes;

  // Case 1: Moving within the same track
  if (idx < estacoesArr.length - 1) {
    return estacaoOcupada(loopStep, idx + 1, tremId);
  }

  // Case 2: At the end of the current track, check the first station of the next track
  if (idx === estacoesArr.length - 1) {
    const nextLoopStep = (loopStep + 1) % LOOP.length;
    const nextLoopFirstStationIdx = 0; // First station of the next loop
    return estacaoOcupada(nextLoopStep, nextLoopFirstStationIdx, tremId);
  }
  return false;
}

function avancarSimulacao() {
  tempoTotal++;
  for (const trem of trens) {
    if (!trem.ativo || trem.recolhido) continue;
    const data = trensData.find(td => td.id === trem.id);
    if (!data) continue;

    data.aguardandoProximoTrem = false; // Reset this flag at the beginning of each tick

    if (data.delay > 0) {
      data.delay--;
      trem.status = `Aguardando partida (${data.delay}s)`;
      continue;
    }
    if (trem.falha) {
      trem.status = `Parado por falha (${trem.falha})`;
      continue;
    }
    let loopStep = data.loopStep;
    let estacoesArr = LOOP[loopStep].estacoes;
    if (falhaEstacao && estacoesArr[data.idx] === falhaEstacao) {
      trem.status = `Parado em ${formatarEstacao(estacoesArr[data.idx])} (${falhaEstacaoTipo})`;
      data.tempoParado++;
      data.tempoParadoEstacao = 0;
      continue;
    }
    if (trensReter) {
      trem.status = `Parado em ${formatarEstacao(estacoesArr[data.idx])} (Retido)`;
      data.tempoParado++;
      data.tempoParadoEstacao = 0;
      continue;
    }

    // NEW: Check if the *next* station (considering loop change) is occupied
    if (!data.aguardando && proximaPosicaoOcupada(loopStep, data.idx, trem.id)) {
      trem.status = `Aguardando liberação da próxima estação`;
      data.tempoParadoEstacao = 0;
      data.aguardandoProximoTrem = true; // Set flag
      continue;
    }


    if (typeof data.tempoParadoEstacao !== "number") data.tempoParadoEstacao = 0;
    if (data.tempoParadoEstacao < 3) {
      data.tempoParadoEstacao++;
      trem.status = `Parado na estação ${formatarEstacao(estacoesArr[data.idx])} (${data.tempoParadoEstacao}/3s)`;
      continue;
    }
    trem.status = `Em ${formatarEstacao(estacoesArr[data.idx])}`;
    if (!data.aguardando) {
      if (data.idx < estacoesArr.length - 1) {
        // This is where the train moves to the next station
        data.idx++;
        data.tempoParadoEstacao = 0;
      } else {
        // End of the line, switch loop and reset index
        data.loopStep = (data.loopStep + 1) % LOOP.length;
        data.idx = 0;
        trem.status = 'Aguardando retorno...';
        data.aguardando = true;
        data.tempoParadoEstacao = 0;
        registrarHistorico(`${trem.nome} chegou ao fim do trecho (${LOOP[data.loopStep].via === 2 ? "Capão via 2 → Klabin via 2" : "Klabin via 1 → Capão via 1"})`);
      }
    } else {
      if (!data.retPause) data.retPause = 1;
      else data.retPause++;
      if (data.retPause > 4) { // Pause for 4 seconds at the end of the line before returning
        data.aguardando = false;
        data.idx = 0; // Reset index to 0 for the new loop
        data.retPause = 0;
        data.tempoParadoEstacao = 0;
        registrarHistorico(`${trem.nome} iniciando próximo trecho do loop`);
      }
    }
  }
  atualizarLinha();
  atualizarStatus();
  atualizarTempo();
}

function toggleReterTrens() {
  trensReter = !trensReter;
  document.getElementById('btnReterTrens').textContent = trensReter ? 'Retomar Trens' : 'Reter Trens';
  registrarHistorico(trensReter ? 'Trens retidos na linha' : 'Trens retomados');
  atualizarLinha();
}

function normalizarLinha() {
  for (const t of trens) t.falha = null;
  falhaEstacao = null;
  falhaEstacaoTipo = null;
  falhaMensagem = '';
  mostrarFalhaInfo();
  registrarHistorico('Linha normalizada');
  atualizarLinha();
  atualizarStatus();
  pararAudioFalha(); // NOVO: para o áudio ao normalizar
}

function aplicarFalha() {
  // Vincule todos os botões de falha a esta função
  falha();
}

function aplicarFalhaAleatoria() {
  if (Math.random() < 0.5) {
    const idx = Math.floor(Math.random() * estacoes_v2.length);
    const tipoIdx = Math.floor(Math.random() * falhasEstacaoTextos.length);
    falhaEstacao = estacoes_v2[idx];
    falhaEstacaoTipo = falhasEstacaoTextos[tipoIdx];
    falhaMensagem = `Falha aleatória em ${formatarEstacao(falhaEstacao)}: ${falhaEstacaoTipo}`;
    registrarHistorico(`Falha aleatória estação: ${formatarEstacao(falhaEstacao)} (${falhaEstacaoTipo})`);
  } else {
    const tremId = Math.floor(Math.random() * trens.length) + 1; // Randomly select from 24 trens
    const tipoIdx = Math.floor(Math.random() * falhasTremTextos.length);
    let trem = trens.find(t => t.id === tremId);
    if (trem) {
      trem.falha = falhasTremTextos[tipoIdx];
      falhaMensagem = `Falha aleatória no ${trem.nome}: ${falhasTremTextos[tipoIdx]}`;
      registrarHistorico(`Falha aleatória ${trem.nome}: ${falhasTremTextos[tipoIdx]}`);
    }
  }
  tocarAudioFalhaLoop();
  mostrarFalhaInfo();
  atualizarLinha();
  atualizarStatus();
}

// TOCAR ÁUDIO EM LOOP ATÉ NORMALIZAR
function tocarAudioFalhaLoop() {
  let audio = document.getElementById('falha-audio');
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'falha-audio';
    audio.src = FALHA_AUDIO_PATH;
    audio.loop = true;
    document.body.appendChild(audio);
  }
  audio.loop = true;
  try {
    audio.currentTime = 0;
    audio.play();
    falhaAudioIsPlaying = true;
  } catch (e) {}
}

function pararAudioFalha() {
  let audio = document.getElementById('falha-audio');
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    falhaAudioIsPlaying = false;
  }
}

function recolherTrem() {
  const tremValor = document.getElementById('tremRecolherSelect').value;
  if (!tremValor) return alert('Selecione o trem para recolher');

  if (tremValor === 'todos') {
    const trensParaRecolher = trens.filter(t => t.ativo && !t.recolhido);
    if (!trensParaRecolher.length) {
      alert('Não há trens para recolher.');
      return;
    }

    trensParaRecolher.forEach(trem => {
      trem.ativo = false;
      trem.recolhido = true;
      trem.falha = null;
      trensData = trensData.filter(td => td.id !== trem.id);
      if (!recolhidos.includes(trem.id)) {
        recolhidos.push(trem.id);
      }
      registrarHistorico(`${trem.nome} recolhido`);
    });

  } else {
    const tremNum = Number(tremValor);
    const trem = trens.find(t => t.id === tremNum);
    if (!trem) return;

    trem.ativo = false;
    trem.recolhido = true;
    trem.falha = null;
    trensData = trensData.filter(td => td.id !== tremNum);
    if (!recolhidos.includes(tremNum)) {
      recolhidos.push(tremNum);
    }
    registrarHistorico(`${trem.nome} recolhido`);
  }

  atualizarTremRecolherSelect();
  atualizarTremInserirSelect();
  atualizarStatus();
  atualizarLinha();
  atualizarPOTECounter(); // Atualiza o contador POTE
}

function atualizarTremRecolherSelect() {
  const select = document.getElementById('tremRecolherSelect');
  select.innerHTML = `<option value="">Selecione um trem</option>`;
  // Opção para recolher todos
  select.innerHTML += `<option value="todos">Todos os trens</option>`;
  // Somente os trens ativos e não recolhidos
  trens.filter(t => t.ativo && !t.recolhido).forEach(trem => {
    select.innerHTML += `<option value="${trem.id}">${trem.nome}</option>`;
  });
}


function abrirInserirTrem() {
  if (!recolhidos.length) return alert('Nenhum trem recolhido disponível para inserir');
  document.getElementById('modalInserirTrem').style.display = 'block';
  atualizarTremInserirSelect();
}

function fecharInserirTrem() {
  document.getElementById('modalInserirTrem').style.display = 'none';
}

function atualizarTremInserirSelect() {
  const select = document.getElementById('tremInserirSelect');
  select.innerHTML = `<option value="">Selecione um trem</option>`;
  // Sort recolhidos by ID for consistent display
  recolhidos.sort((a, b) => a - b).forEach(n => {
    const trem = trens.find(t => t.id === n);
    if (trem) {
      select.innerHTML += `<option value="${n}">${trem.nome}</option>`;
    }
  });
}

function inserirTremRecolhido(tremNumToInsert = null) {
  let tremNum;
  if (tremNumToInsert) {
    tremNum = tremNumToInsert;
  } else {
    tremNum = Number(document.getElementById('tremInserirSelect').value);
  }

  if (!tremNum) return alert('Selecione o trem para inserir');
  const trem = trens.find(t => t.id === tremNum);
  if (!trem || !trem.recolhido) return; // Ensure it's a valid recolhido train

  trem.ativo = true;
  trem.recolhido = false;
  trem.falha = null;

  // Find a suitable initial position for the re-inserted train
  let newLoopStep = 0;
  let newIdx = 0;
  let positionFound = false;

  // Try to place it at the first available position that is not occupied
  const allPossibleInitialPositions = [];
  for (let ls = 0; ls < LOOP.length; ls++) {
    for (let i = 0; i < LOOP[ls].estacoes.length; i++) {
      allPossibleInitialPositions.push({ loopStep: ls, idx: i });
    }
  }

  // Sort positions to try and place trains at the start of a track first
  allPossibleInitialPositions.sort((a, b) => a.idx - b.idx);

  for (const pos of allPossibleInitialPositions) {
    if (!estacaoOcupada(pos.loopStep, pos.idx, trem.id)) {
      newLoopStep = pos.loopStep;
      newIdx = pos.idx;
      positionFound = true;
      break;
    }
  }

  if (!positionFound) {
    // Fallback if all stations are unexpectedly occupied, or not enough stations
    console.warn(`No free station found for ${trem.nome}. Placing at default (0,0).`);
    newLoopStep = 0;
    newIdx = 0;
  }


  // Add the train back to trensData
  trensData.push({
    id: trem.id,
    loopStep: newLoopStep,
    idx: newIdx,
    delay: 0,
    aguardando: false,
    tempoParado: 0,
    tempoParadoEstacao: 0,
    aguardandoProximoTrem: false
  });


  recolhidos = recolhidos.filter(n => n !== tremNum);
  if (!tremNumToInsert) { // Only close modal if triggered by single insert button
      fecharInserirTrem();
  }
  registrarHistorico(`${trem.nome} reinserido na linha`);
  atualizarStatus();
  atualizarLinha();
  atualizarTremRecolherSelect();
  atualizarTremInserirSelect();
atualizarPOTECounter(); // Atualiza o contador POTE
}

function inserirTodosTrensRecolhidos() {
    if (recolhidos.length === 0) {
        alert('Nenhum trem recolhido para inserir.');
        return;
    }

    const currentRecolhidos = [...recolhidos]; // Make a copy as recolhidos will change
    for (const tremId of currentRecolhidos) {
        inserirTremRecolhido(tremId); // Call the existing function for each recolhido train
    }
    fecharInserirTrem(); // Close the modal after inserting all
atualizarPOTECounter(); // Atualiza o contador POTE
}


function formatarEstacao(est) {
  switch (est.replace('-v2', '')) {
    case 'est1':
      return 'Capão Redondo';
    case 'est2':
      return 'Campo Limpo';
    case 'est3':
      return 'Vila das Belezas';
    case 'est4':
      return 'Giovanni Gronchi';
    case 'est5':
      return 'Santo Amaro';
    case 'est6':
      return 'Largo Treze';
    case 'est7':
      return 'Adolfo Pinheiro';
    case 'est8':
      return 'Alto da Boa Vista';
    case 'est9':
      return 'Borba Gato';
    case 'est10':
      return 'Brooklin';
    case 'est11':
      return 'Campo Belo';
    case 'est12':
      return 'Eucaliptos';
    case 'est13':
      return 'Moema';
    case 'est14':
      return 'AACD Servidor';
    case 'est15':
      return 'Hospital São Paulo';
    case 'est16':
      return 'Santa Cruz';
    case 'est17':
      return 'Chácara Klabin';
    default:
      return est;
  }
}

function registrarHistorico(evento, detalhes = '') {
  historico.unshift({
    tempo: tempoTotal,
    evento,
    detalhes
  });
  atualizarHistorico();
}

function atualizarHistorico() {
  const tbody = document.getElementById('historico-tbody');
  tbody.innerHTML = '';
  historico.forEach((e, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${historico.length - i}</td><td>${e.tempo}s</td><td>${e.evento}</td><td>${e.detalhes||''}</td>`;
    tbody.appendChild(tr);
  });
}

function baixarCSV() {
  if (!historico.length) return alert('Sem histórico para exportar!');
  let csv = 'ID,Momento (s),Evento,Detalhes\n';
  historico.slice().reverse().forEach((e, i) => {
    csv += `${i+1},${e.tempo},"${e.evento}","${e.detalhes||''}"\n`;
  });
  const blob = new Blob([csv], {
    type: 'text/csv'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'historico_linha5.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function mostrarFalhaInfo() {
  document.getElementById('falha-info').textContent = falhaMensagem;
  document.getElementById('falha-info').style.color = '#f44336';
}

// ===============
// Função para o botão Falha
// ===============
function falha() {
  // Obtém o valor selecionado para tipo de falha (estação ou trem)
  const tipo = document.getElementById('falhaTipoSelect').value;
  if (tipo === 'estacao') {
    // Falha em estação
    const est = document.getElementById('falhaSelect').value;
    const tipoFalhaEst = document.getElementById('falhaEstacaoTipo').value;
    if (!est || !tipoFalhaEst) {
      alert('Selecione a estação e o tipo de falha');
      return;
    }
    falhaEstacao = est;
    falhaEstacaoTipo = tipoFalhaEst;
    falhaMensagem = `Falha em estação: ${formatarEstacao(est)} - ${tipoFalhaEst}`;
    tocarAudioFalhaLoop();
    registrarHistorico(`Falha em estação: ${formatarEstacao(est)} (${tipoFalhaEst})`);
  } else if (tipo && tipo.startsWith('trem')) {
    // Falha em trem
    const tremId = Number(tipo.replace('trem', ''));
    const tipoFalhaTrem = document.getElementById('falhaTremTipo').value;
    if (!tremId || !tipoFalhaTrem) {
      alert('Selecione um trem e tipo de falha');
      return;
    }
    let trem = trens.find(t => t.id === tremId);
    if (trem) {
      trem.falha = tipoFalhaTrem;
      falhaMensagem = `Falha no ${trem.nome}: ${tipoFalhaTrem}`;
      tocarAudioFalhaLoop();
      registrarHistorico(`Falha no ${trem.nome}: ${tipoFalhaTrem}`);
    }
  } else {
    alert('Selecione o tipo de falha');
    return;
  }
  mostrarFalhaInfo();
  atualizarLinha();
  atualizarStatus();
}

// ===============
// Adicione event listeners para todos os botões que causam falha
// ===============
window.onload = function() {
  let falhaTremTipo = document.getElementById('falhaTremTipo');
  if (falhaTremTipo) {
    falhaTremTipo.innerHTML = '<option value="">Tipo de falha no trem</option>' + falhasTremTextos.map(f => `<option value="${f}">${f}</option>`).join('');
  }
  let falhaEstacaoTipo = document.getElementById('falhaEstacaoTipo');
  if (falhaEstacaoTipo) {
    falhaEstacaoTipo.innerHTML = '<option value="">Tipo de falha na estação</option>' + falhasEstacaoTextos.map(f => `<option value="${f}">${f}</option>`).join('');
  }

  // Populate falhaTipoSelect with all 24 trains
  const falhaTipoSelect = document.getElementById('falhaTipoSelect');
  if (falhaTipoSelect) {
    // Clear existing options, but keep the 'estacao' one if it exists
    const existingOptions = Array.from(falhaTipoSelect.options).filter(opt => opt.value === 'estacao' || opt.value === '');
    falhaTipoSelect.innerHTML = '';
    existingOptions.forEach(opt => falhaTipoSelect.appendChild(opt));

    trens.forEach(trem => {
        const option = document.createElement('option');
        option.value = `trem${trem.id}`;
        option.textContent = trem.nome;
        falhaTipoSelect.appendChild(option);
    });
  }

 atualizarStatus();
  atualizarLinha();
  atualizarTempo();
  atualizarHistorico();
  atualizarTremRecolherSelect();
  atualizarTremInserirSelect();
  mostrarFalhaInfo();
  atualizarPOTECounter(); // Inicializa o contador POTE

  // Botão principal de falha
  const btnFalha = document.getElementById('btnFalha');
  if (btnFalha) btnFalha.onclick = falha;

  // Vincule os outros botões relevantes para causar falha
  const btnFalhaEstacao = document.getElementById('btnFalhaEstacao');
  if (btnFalhaEstacao) btnFalhaEstacao.onclick = falha;

  const btnFalhaTrem = document.getElementById('btnFalhaTrem');
  if (btnFalhaTrem) btnFalhaTrem.onclick = falha;

  const selectEstacao = document.getElementById('falhaSelect');
  if (selectEstacao) selectEstacao.onchange = function() {
    if (document.getElementById('falhaTipoSelect').value === 'estacao') {
      // Se o usuário selecionar uma estação e o tipo for estação, já pode disparar a função falha (opcional)
      // falha();
    }
  };

  // Add event listener for "Inserir Todos" button
  const btnInserirTodos = document.getElementById('btnInserirTodos'); // You need to add this button in your HTML
  if (btnInserirTodos) {
      btnInserirTodos.onclick = inserirTodosTrensRecolhidos;
  }
};

window.onclick = function(e) {
  if (e.target && e.target.id === 'modalInserirTrem') {
    fecharInserirTrem();
  }
}
