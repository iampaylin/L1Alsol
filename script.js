// Solutions Data (Instruções simplificadas para os técnicos)
const SOLUTIONS = {
    'lentidao': [
        'Verificar se o cabo de fibra está dobrado, prensado ou quebrado (olhar todo o caminho da fibra).',
        'Verificar se os conectores da fibra estão bem encaixados ou se precisam ser refeitos.',
        'Testar a internet ligando um computador com cabo direto no aparelho da fibra (ONU).',
        'Medir a força do sinal da fibra no aparelho do cliente e na caixa da rua.',
        'Testar se o roteador do cliente está muito quente, travando ou com mau contato na energia.',
        'Trocar o cabo de rede que liga o roteador ao aparelho da internet se estiver velho ou quebrado.',
        'Reiniciar, configurar do zero ou trocar o roteador se continuar ruim.'
    ],
    'sem_conexao': [
        'Medir o sinal da fibra na caixa de atendimento na rua e na casa do cliente.',
        'Procurar por rompimento no cabo ou problemas nas emendas da fibra.',
        'Testar outra ONU para ver se a atual queimou ou estragou.',
        'Testar com outro roteador de teste para ver se a internet volta.',
        'Revisar todos os cabos de rede e conectores dentro da casa do cliente.'
    ],
    'ping_instavel': [
        'Limpar o conector do cabo de fibra que entra no aparelho (ONU) e encaixar bem firme.',
        'Olhar o cabo de fibra dentro de casa: ver se não está preso sob portas, dobrado ou sob móveis.',
        'Verificar se o cabo de rede entre o aparelho da fibra e o roteador está amassado ou com a trava quebrada.',
        'Ligar um notebook com cabo direto no aparelho da fibra (ONU) e refazer o teste para testar sem o roteador.',
        'Substituir o cabo de rede se estiver com defeito.',
        'Colocar um aparelho de fibra (ONU) de teste para descartar defeito no equipamento atual.',
        'Verificar se o roteador do cliente está esquentando muito ou com a fonte falhando.'
    ],

    'tracert_instavel': [
        'Desconectar, limpar e reencaixar o cabo de fibra no aparelho (ONU) do cliente.',
        'Procurar por dobras apertadas, emendas ruins ou partes amassadas no cabo de fibra dentro da residência.',
        'Trocar o aparelho de fibra (ONU) por um de teste para ver se o problema é nele.',
        'Substituir o cabo de rede que liga o aparelho de fibra ao roteador se estiver com mau contato.',
        'Ligar um notebook direto no aparelho da fibra (ONU) para testar a rota sem passar pelo roteador.'
    ],
    'oscilacao': [
        'Medir a força do sinal da fibra e ajustar se estiver muito fraco ou fora do padrão.',
        'Conectar um aparelho de teste direto na ONU para ver se a oscilação continua no cabo.',
        'Verificar se o roteador está muito perto de aparelhos que causam interferência (micro-ondas, telefones sem fio, etc.).',
        'Substituir o roteador se o sinal do Wi-Fi estiver caindo sozinho.'
    ],
    'queda': [
        'Verificar se a tomada está frouxa, se a fonte de energia está quente demais ou com mau contato.',
        'Revisar todos os cabos internos e conectores da internet.',
        'Substituir os aparelhos (ONU ou roteador) se continuarem desligando sozinhos.'
    ],
    'roteador': [
        'Colocar um roteador de teste no lugar para confirmar se o do cliente está com defeito.',
        'Verificar se as luzes do roteador piscam normal, se ele esquenta muito ou faz barulhos estranhos.',
        'Testar a fonte de energia em outra tomada ou colocar outra fonte compatível para teste.',
        'Trocar o roteador se for confirmado o defeito.'
    ],
    'sinal_optico': [
        'Medir o sinal que sai da caixa da rua e o que chega no aparelho da casa do cliente.',
        'Refazer as pontas (conectores) do cabo de fibra que estão com sinal ruim.',
        'Ajustar o cabo para tirar dobras apertadas ou partes esmagadas.',
        'Refazer a emenda de solda da fibra (fusão) se estiver com sinal muito fraco.',
        'Verificar se o cabo de fibra da rua ou de dentro da casa está quebrado em algum ponto.'
    ],
    // RADIO SOLUTIONS
    'radio_lento_oscilando': [
        'Ajustar a direção da antena no telhado para melhorar a recepção do sinal.',
        'Trocar o cabo de rede que desce da antena para o roteador.',
        'Trocar a fonte de energia preta que liga a antena na tomada (fonte POE).',
        'Verificar se cresceram árvores novas ou se construíram algo na direção da antena que esteja tampando o sinal.'
    ],
    'radio_sem_servico': [
        'Trocar a fonte de energia preta que liga a antena na tomada (fonte POE).',
        'Trocar o cabo de rede que desce da antena.',
        'Testar trocando a antena externa por outra no lugar.',
        'Verificar se a antena desconfigurou ou se queimou por causa de raio ou queda de energia.'
    ]
};

let currentStep = 1;

document.addEventListener('DOMContentLoaded', () => {

    // Tab Switching Logic
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetType = tab.getAttribute('data-tab');

            // Toggle visibility of type-specific fields
            document.querySelectorAll('.type-fibra').forEach(el => {
                el.style.display = targetType === 'fibra' ? '' : 'none';
            });
            document.querySelectorAll('.type-radio').forEach(el => {
                el.style.display = targetType === 'radio' ? '' : 'none';
            });

            // Reset stepper to step 1
            showStep(1);
            generateNote();
        });
    });

    // Navigation Buttons
    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentStep < 4) {
            changeStep(1);
        }
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentStep > 1) {
            changeStep(-1);
        }
    });

    // Event Listeners for Input Changes
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', generateNote);
        input.addEventListener('change', generateNote);
    });

    const copyBtnPrimary = document.getElementById('copy-btn-primary');
    copyBtnPrimary.addEventListener('click', () => copyToClipboard('output-text-primary', 'copy-btn-primary'));

    const copyBtnSecondary = document.getElementById('copy-btn-secondary');
    copyBtnSecondary.addEventListener('click', () => copyToClipboard('output-text-secondary', 'copy-btn-secondary'));

    const cleanBtn = document.getElementById('clean-btn');
    cleanBtn.addEventListener('click', clearForm);

    // Input Masking
    setupMasks();

    // Make indicators clickable
    const indicators = document.querySelectorAll('.step-indicator');
    indicators.forEach((ind, idx) => {
        ind.style.cursor = 'pointer';
        ind.addEventListener('click', () => {
            showStep(idx + 1);
        });
    });

    // Quick Description Tags
    const quickDescTags = document.querySelectorAll('.quick-desc-tag');
    const problemaTextarea = document.getElementById('common-problema');
    quickDescTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const currentText = problemaTextarea.value.trim();
            const tagText = tag.textContent;

            if (currentText) {
                problemaTextarea.value = currentText + '\n' + tagText;
            } else {
                problemaTextarea.value = tagText;
            }

            generateNote();
        });
    });

    // Initial State
    showStep(1);
    generateNote();
});

function changeStep(n) {
    const steps = document.querySelectorAll('.step');

    // Basic validation before going to step 2/3
    if (n > 0) {
        if (currentStep === 1) {
            const nome = document.getElementById('common-nome').value;
        }
    }

    currentStep += n;
    showStep(currentStep);
}

function showStep(n) {
    currentStep = n;
    const steps = document.querySelectorAll('.step');
    const indicators = document.querySelectorAll('.step-indicator');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Show/Hide Steps
    steps.forEach((step, idx) => {
        step.classList.toggle('active', idx + 1 === n);
    });

    // Update Indicators
    indicators.forEach((ind, idx) => {
        const stepNum = idx + 1;
        ind.classList.remove('active', 'completed');
        if (stepNum === n) {
            ind.classList.add('active');
        } else if (stepNum < n) {
            ind.classList.add('completed');
            ind.innerHTML = '✓';
        } else {
            ind.innerHTML = stepNum;
        }
    });

    // Update Buttons
    prevBtn.style.visibility = n === 1 ? 'hidden' : 'visible';
    nextBtn.style.display = n === 4 ? 'none' : '';
    nextBtn.textContent = 'Próximo';

    if (n === 4) {
        generateNote();
    }
}

function setupMasks() {
    // Phone Masks
    const contactInput = document.getElementById('common-contato');
    if (contactInput) {
        contactInput.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
            generateNote();
        });
    }

    // Signal Masks
    ['fibra-sinal', 'fibra-sinal-cliente', 'radio-sinal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                e.target.value = maskSignal(e.target.value);
                generateNote();
            });
        }
    });
}

function maskPhone(value) {
    return value
        .replace(/\D/g, '') // Remove non-digits
        .replace(/^(\d{2})(\d)/g, '($1) $2') // (11) 9...
        .replace(/(\d)(\d{4})$/, '$1-$2') // ...9-9999
        .substr(0, 15); // Limit length
}

function maskSignal(value) {
    // Remove non-numeric characters
    let v = value.replace(/\D/g, '');

    // Logic: 
    // If length <= 2, just show negative number (e.g. 2 -> -2, 22 -> -22)
    // If length > 2, put dot before last 2 digits (e.g. 225 -> -2.25, 2250 -> -22.50)

    if (v.length === 0) return '';

    if (v.length <= 2) {
        return `-${v}`;
    } else {
        const integerPart = v.slice(0, v.length - 2);
        const decimalPart = v.slice(v.length - 2);
        // Remove leading zeros from integer part if valuable (optional, but '08' -> '8')
        // But for signal usually it's fine.
        return `-${Number(integerPart)}.${decimalPart}`;
    }
}

function clearForm() {
    const form = document.getElementById('os-form');
    form.reset();

    // Additional manual reset for checkboxes if needed, but reset() usually does it
    // Reset stepper to 1
    showStep(1);
    generateNote();
}

function getActiveTab() {
    return document.querySelector('.tab-btn.active').getAttribute('data-tab');
}

function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function getRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : '';
}

function getCheckboxState(id) {
    const el = document.getElementById(id);
    return el && el.checked;
}

function generateNote() {
    const type = getActiveTab();
    let text = '';

    if (type === 'fibra') {
        text = generateFibraNote();
    } else {
        text = generateRadioNote();
    }

    const secondaryText = generateSecondaryOutput(type);

    // Separate outputs in different elements
    document.getElementById('output-text-primary').textContent = text;
    document.getElementById('output-text-secondary').textContent = secondaryText;
}

function generateFibraNote() {
    const nome = getValue('common-nome');
    const contato = getValue('common-contato');
    const tipo = getRadioValue('fibra-tipo');
    const status = getRadioValue('fibra-status');
    const sinalCTO = getValue('fibra-sinal');
    const sinalCliente = getValue('fibra-sinal-cliente');
    const diagnostico = getValue('fibra-diagnostico');
    const problema = getValue('common-problema');
    const enderecoAtualizado = getRadioValue('end-doc');
    const contatoAtualizado = getRadioValue('cont-doc');

    // Checklist Logic
    const checklistItems = [];
    if (getCheckboxState('check-reiniciado')) checklistItems.push('[x] Reiniciado equipamentos');
    if (getCheckboxState('check-config')) checklistItems.push('[x] Configurado roteador no padrão Alsol');

    let observacaoDoc = '';
    if (getCheckboxState('check-doc-nao')) {
        observacaoDoc = '\n\nOBSERVAÇÃO\nCliente sem documentação, ligar para documentar com a central';
    }

    // Alarm checkboxes (no more Sim/Não radio)
    const activeAlarms = [];
    if (getCheckboxState('LINKLOSS')) activeAlarms.push('LINK LOSS');
    if (getCheckboxState('RXLOWPOWER')) activeAlarms.push('RX LOW');
    if (getCheckboxState('DYINGGASP')) activeAlarms.push('DYING GASP');
    if (activeAlarms.length > 0) {
        checklistItems.push(`[!] Alarmes na ONU: ${activeAlarms.join(', ')}`);
    }

    // Solutions Block
    let solucoesBlock = '';
    if (diagnostico && SOLUTIONS[diagnostico]) {
        const title = document.querySelector(`#fibra-diagnostico option[value="${diagnostico}"]`).textContent;
        const actions = SOLUTIONS[diagnostico].map(a => `  - ${a}`).join('\n');
        solucoesBlock = `\n\nAÇÕES P/ TÉCNICO (${title.toUpperCase()})\n${actions}`;
    }

    // Get diagnostic label for header
    let diagnosticoTexto = '';
    const diagSelect = document.getElementById('fibra-diagnostico');
    if (diagSelect && diagSelect.selectedIndex > 0) {
        diagnosticoTexto = diagSelect.options[diagSelect.selectedIndex].text;
    }

    const statusIcon = status === 'ONLINE' ? 'ONLINE' : 'OFFLINE';

    let acoesNivel1 = '';
    if (checklistItems.length > 0) {
        acoesNivel1 = `\n\nAÇÕES (NÍVEL 1)\n${checklistItems.join('\n')}`;
    }

    return `MOTIVO: ${diagnosticoTexto || 'Não Informado'}

DADOS DO CLIENTE
- Solicitante: ${nome || '-'}
- Contato: ${contato || '-'}
- Cadastro Atualizado: Endereço (${enderecoAtualizado}) | Contato (${contatoAtualizado})

CONEXÃO
- Tipo: ${tipo} (${statusIcon})
- Sinal Cliente: ${sinalCliente ? sinalCliente + ' dBm' : '-'} | CTO: ${sinalCTO ? sinalCTO + ' dBm' : '-'}

RELATO DO PROBLEMA
${problema || '-'}${acoesNivel1}${solucoesBlock}${observacaoDoc}`;
}


function generateRadioNote() {
    const nome = getValue('common-nome');
    const contato = getValue('common-contato');
    const tipo = getRadioValue('radio-tipo');
    const status = getRadioValue('radio-status');
    const vinculado = getRadioValue('radio-vinculado');
    const sinal = getValue('radio-sinal');
    const problema = getValue('common-problema');
    const diagnostico = getValue('radio-diagnostico');

    // Checklist Logic
    const checklistItems = [];
    if (getCheckboxState('check-reiniciado')) checklistItems.push('[x] Reiniciado equipamentos');
    if (getCheckboxState('check-config')) checklistItems.push('[x] Configurado roteador');

    let observacaoDoc = '';
    if (getCheckboxState('check-doc-nao')) {
        observacaoDoc = '\n\nOBSERVAÇÃO\nCliente sem documentação, ligar para documentar com a central';
    }

    // Solutions Block
    let solucoesBlock = '';
    if (diagnostico && SOLUTIONS[diagnostico]) {
        const title = document.querySelector(`#radio-diagnostico option[value="${diagnostico}"]`).textContent;
        const actions = SOLUTIONS[diagnostico].map(a => `  - ${a}`).join('\n');
        solucoesBlock = `\n\nAÇÕES P/ TÉCNICO (${title.toUpperCase()})\n${actions}`;
    }

    // Get diagnostic label for header
    let diagnosticoTexto = '';
    const diagSelect = document.getElementById('radio-diagnostico');
    if (diagSelect && diagSelect.selectedIndex > 0) {
        diagnosticoTexto = diagSelect.options[diagSelect.selectedIndex].text;
    }

    const statusIcon = status === 'ONLINE' ? 'ONLINE' : 'OFFLINE';

    let acoesNivel1 = '';
    if (checklistItems.length > 0) {
        acoesNivel1 = `\n\nAÇÕES (NÍVEL 1)\n${checklistItems.join('\n')}`;
    }

    return `MOTIVO: ${diagnosticoTexto || 'Não Informado'}

DADOS DO CLIENTE
- Solicitante: ${nome || '-'}
- Contato: ${contato || '-'}

CONEXÃO (RÁDIO)
- Tipo: ${tipo} (${statusIcon})
- Sinal Rádio: ${sinal ? sinal + ' dBm' : '-'}
- Vinculado: ${vinculado}

RELATO DO PROBLEMA
${problema || '-'}${acoesNivel1}${solucoesBlock}${observacaoDoc}`;
}

function generateSecondaryOutput(type) {
    const msgField = type === 'fibra' ? 'fibra-msg' : 'radio-msg';
    const msgCliente = getValue(msgField);
    const nome = getValue('common-nome');
    const contato = getValue('common-contato');
    const relato = getValue('common-problema');

    const endAtualizado = getRadioValue('end-doc');
    const contAtualizado = getRadioValue('cont-doc');

    return `MENSAGEM DO CLIENTE: ${msgCliente}

DADOS:
- Nome: ${nome || '-'}
- Telefone: ${contato || '-'}

CADASTRO:
- Endereço Atualizado? ${endAtualizado}
- Telefone Atualizado? ${contAtualizado}

RELATO DO PROBLEMA: 
${relato || '-'}`;
}

function copyToClipboard(elementId, buttonId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById(buttonId);
        const originalText = btn.textContent;

        btn.textContent = 'Copiado!';
        btn.style.backgroundColor = '#00ff88'; // Success green
        btn.style.color = '#000';

        // Ensure text color is readable if needed, though default usually fine
        // btn.style.color = '#000'; 

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = ''; // Revert to CSS default
            btn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// ==========================================
// EXTRACT DATA - Modal & Parsing Logic
// ==========================================

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const extractBtn = document.getElementById('extract-btn');
        const extractModal = document.getElementById('extract-modal');
        const extractClose = document.getElementById('extract-modal-close');
        const extractRunBtn = document.getElementById('extract-run-btn');
        const extractTextarea = document.getElementById('extract-textarea');

        // Open modal
        extractBtn.addEventListener('click', () => {
            extractModal.classList.add('active');
            extractTextarea.value = '';
            extractTextarea.focus();
        });

        // Close modal
        extractClose.addEventListener('click', () => {
            extractModal.classList.remove('active');
        });

        // Close on overlay click
        extractModal.addEventListener('click', (e) => {
            if (e.target === extractModal) {
                extractModal.classList.remove('active');
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && extractModal.classList.contains('active')) {
                extractModal.classList.remove('active');
            }
        });

        // Run extraction
        extractRunBtn.addEventListener('click', () => {
            const raw = extractTextarea.value;
            if (!raw.trim()) return;

            parseAndFill(raw);
            extractModal.classList.remove('active');
        });
    });

    function parseAndFill(text) {
        // Helper: check if (x) is marked — flexible whitespace
        const isChecked = (str) => /\(\s*x\s*\)/i.test(str);

        // --- NOME DO SOLICITANTE ---
        const nomeMatch = text.match(/NOME\s+DO\s+SOLICITANTE:\s*(.+)/i);
        if (nomeMatch) {
            document.getElementById('common-nome').value = nomeMatch[1].trim();
        }

        // --- TELEFONE (first occurrence after "TELEFONE:") ---
        const telMatch = text.match(/TELEFONE:\s*(.+)/i);
        if (telMatch) {
            document.getElementById('common-contato').value = telMatch[1].trim();
        }

        // --- ENDEREÇO ATUALIZADO ---
        const endMatch = text.match(/ENDEREÇO\s+DO\s+CADASTRO\s+EST[AÁ]\s+ATUALIZADO\?\s*(.+)/i);
        if (endMatch) {
            const line = endMatch[1];
            // Split by | to get SIM and NÃO parts
            const parts = line.split('|');
            let endValue = 'SIM'; // default
            if (parts.length >= 2) {
                // Check which part has the (x)
                if (isChecked(parts[0])) endValue = 'SIM';
                else if (isChecked(parts[1])) endValue = 'NÃO';
            } else {
                // Single part — check for NÃO
                if (/N[AÃ]O/i.test(line) && isChecked(line)) endValue = 'NÃO';
            }
            setRadio('end-doc', endValue);
        }

        // --- TELEFONE ATUALIZADO ---
        const contMatch = text.match(/TELEFONE\s+DO\s+CADASTRO\s+EST[AÁ]\s+ATUALIZADO\?\s*(.+)/i);
        if (contMatch) {
            const line = contMatch[1];
            const parts = line.split('|');
            let contValue = 'SIM';
            if (parts.length >= 2) {
                if (isChecked(parts[0])) contValue = 'SIM';
                else if (isChecked(parts[1])) contValue = 'NÃO';
            } else {
                if (/N[AÃ]O/i.test(line) && isChecked(line)) contValue = 'NÃO';
            }
            setRadio('cont-doc', contValue);
        }

        // --- RELATO DO CLIENTE ---
        const relatoMatch = text.match(/RELATO\s+DO\s+CLIENTE:\s*([\s\S]*?)$/i);
        if (relatoMatch) {
            document.getElementById('common-problema').value = relatoMatch[1].trim();
        }

        // --- MENSAGEM DO CLIENTE ---
        // Look for the block that starts with "Mensagem do cliente:" and spans multiple lines
        const msgBlock = text.match(/Mensagem\s+do\s+cliente:\s*([\s\S]*?)(?=\n\s*\n|NOME\s+DO\s+SOLICITANTE)/i);
        if (msgBlock) {
            const block = msgBlock[0] + msgBlock[1];
            let msgValue = '';

            // Check each option
            const semServico = block.match(/(\([^)]*\))\s*SEM\s+SERVI[ÇC]O/i);
            const instabilidade = block.match(/(\([^)]*\))\s*SERVI[ÇC]O\s+COM\s+INSTABILIDADE/i);
            const configWifi = block.match(/(\([^)]*\))\s*CONFIGURA[ÇC][ÃA]O\s+DE\s+ROTEADOR\s*\/\s*WIFI/i);
            const reparo = block.match(/(\([^)]*\))\s*REPARO/i);
            const outro = block.match(/(\([^)]*\))\s*OUTRO/i);

            if (semServico && isChecked(semServico[1])) {
                msgValue = 'SEM SERVIÇO';
            } else if (instabilidade && isChecked(instabilidade[1])) {
                msgValue = 'SERVIÇO COM INSTABILIDADE';
            } else if (configWifi && isChecked(configWifi[1])) {
                msgValue = 'CONFIGURAÇÃO DE ROTEADOR / WIFI';
            } else if (reparo && isChecked(reparo[1])) {
                msgValue = 'REPARO';
            } else if (outro && isChecked(outro[1])) {
                msgValue = 'OUTRO';
            }

            if (msgValue) {
                const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
                const selectId = activeTab === 'radio' ? 'radio-msg' : 'fibra-msg';
                const el = document.getElementById(selectId);
                if (el) el.value = msgValue;
            }
        }

        // Navigate to Step 1 and regenerate notes
        showStep(1);
        generateNote();
    }

    function setRadio(name, value) {
        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) {
            radio.checked = true;
        }
    }
})();

// ==========================================
// THEMES LOGIC
// ==========================================

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const themeBtn = document.getElementById('theme-btn');
        const themeModal = document.getElementById('theme-modal');
        const themeClose = document.getElementById('theme-modal-close');
        const themeCards = document.querySelectorAll('.theme-card');

        // Load saved theme
        const savedTheme = localStorage.getItem('alsol_theme') || 'default';
        applyTheme(savedTheme);

        // Open modal
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                themeModal.classList.add('active');
            });
        }

        // Close modal
        if (themeClose) {
            themeClose.addEventListener('click', () => {
                themeModal.classList.remove('active');
            });
        }

        if (themeModal) {
            themeModal.addEventListener('click', (e) => {
                if (e.target === themeModal) {
                    themeModal.classList.remove('active');
                }
            });
        }

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && themeModal && themeModal.classList.contains('active')) {
                themeModal.classList.remove('active');
            }
        });

        // Handle Theme Selection
        themeCards.forEach(card => {
            card.addEventListener('click', () => {
                const themeName = card.getAttribute('data-theme');
                applyTheme(themeName);
                localStorage.setItem('alsol_theme', themeName);
            });
        });

        function applyTheme(themeName) {
            // Update active card
            themeCards.forEach(c => c.classList.remove('active'));
            const activeCard = document.querySelector(`.theme-card[data-theme="${themeName}"]`);
            if (activeCard) activeCard.classList.add('active');

            // Reset body classes
            document.body.className = '';

            if (themeName !== 'default') {
                // Apply theme class and glass-mode
                document.body.classList.add(`theme-${themeName}`);
                document.body.classList.add('glass-mode');
            }
        }
    });
})();

/* 
=============================================================================
TUTORIAL: COMO CRIAR NOVOS TEMAS DE WALLPAPER E CORES
=============================================================================

Para adicionar um novo tema, siga estes 3 passos simples:

PASSO 1: Adicionar o card no index.html
---------------------------------------
Encontre a div com a classe "themes-grid" no arquivo index.html e adicione um novo bloco de card.
Exemplo para um tema chamado "cyberpunk":

<div class="theme-card" data-theme="cyberpunk">
    <div class="theme-preview" style="background: url('themes/cyberpunk.png') center/cover;"></div>
    <span>Cyberpunk</span>
</div>

PASSO 2: Adicionar as cores e a imagem no style.css
---------------------------------------------------
Vá até o arquivo style.css, role até o final (seção Glassmorphism Variables) e 
crie a classe do seu tema. A classe deve se chamar "body.theme-" + o nome que você colocou no data-theme.

body.theme-cyberpunk {
  background-image: url('themes/cyberpunk.png');
  --accent-color: #ff007f;
  --accent-hover: #e60073;
  --input-focus-ring: rgba(255, 0, 127, 0.3);
}

PASSO 3: Adicionar a imagem na pasta
------------------------------------
Coloque a imagem escolhida (ex: cyberpunk.png) dentro da pasta "themes".

PRONTO! 
A lógica em JavaScript cuidará do resto automaticamente: 
ela ativará a imagem e aplicará a classe "glass-mode" para que o fundo fique desfocado (efeito vidro).
=============================================================================
*/
