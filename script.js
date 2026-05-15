// Solutions Data
const SOLUTIONS = {
    'lentidao': [
        'Verificar integridade da fibra até a ONU (dobras, esmagamentos, rompimentos).',
        'Revisar conectores, fusões e possíveis microdobras.',
        'Testar navegação diretamente pelo cabo conectado na ONU.',
        'Medir potência óptica na ONU e no conector externo.',
        'Verificar se o roteador do cliente está defeituoso, superaquecendo ou com fonte instável.',
        'Substituir cabo de rede danificado.',
        'Reconfigurar ou substituir roteador, se necessário.'
    ],
    'sem_conexao': [
        'Testar sinal óptico na CTO e na fibra do cliente.',
        'Verificar fusões, conectores e eventual rompimento.',
        'Testar outra ONU e substituir se necessário.',
        'Testar com outro roteador para confirmar funcionamento.',
        'Verificar cabeamento interno do cliente (cabo UTP, tomadas, emendas).'
    ],
    'ping_instavel': [
        'Limpar o conector da fibra na ONU com kit de limpeza e reencaixar firme.',
        'Inspecionar o percurso do cabo de fibra interno — dobra fechada, cabo preso em porta ou objeto em cima já causa isso.',
        'Verificar se o cabo de rede entre a ONU e o roteador está danificado ou com conector amassado.',
        'Testar conectar notebook direto na ONU (sem roteador) e refazer o ping — descarta problema no roteador do cliente.',
        'Substituir cabo de rede se estiver danificado.',
        'Testar trocar a ONU por uma reserva — se a instabilidade sumir, era a ONU com defeito.',
        'Verificar se o roteador do cliente está superaquecendo ou com fonte instável.',
    ],

    'tracert_instavel': [
        'Limpar e reencaixar conector da fibra na ONU antes de qualquer outra coisa.',
        'Inspecionar a fibra interna da residência em busca de dobras, emendas improvisadas ou trechos esmagados.',
        'Testar trocar a ONU por uma reserva e refazer o tracert para comparar.',
        'Verificar se o cabo de rede entre ONU e roteador está íntegro — substituir se necessário.',
        'Testar conectar notebook direto na ONU e refazer o tracert — descarta problema no roteador do cliente.',
    ],
    'oscilacao': [
        'Medir potência da fibra e corrigir se estiver fora do ideal.',
        'Testar estabilidade conectando um dispositivo diretamente na ONU.',
        'Verificar interferências no ambiente do roteador (micro-ondas, paredes, eletrodomésticos).',
        'Substituir roteador com problema de queda de Wi-Fi ou instabilidade.'
    ],
    'queda': [
        'Verificar fonte, cabo de energia e tomadas frouxas.',
        'Revisar cabos internos e conectores.',
        'Substituir equipamentos defeituosos.'
    ],
    'roteador': [
        'Testar equipamento com outro roteador para confirmar falha.',
        'Verificar superaquecimento, LEDs anormais e ruídos.',
        'Conferir fonte e substituir se houver instabilidade.',
        'Substituir roteador se confirmado defeito.'
    ],
    'sinal_optico': [
        'Testar potência óptica na CTO e na fibra interna.',
        'Recolocar ou substituir conectores.',
        'Corrigir microdobras ou refazer trechos danificados.',
        'Refazer fusão se necessário.',
        'Verificar se há rompimento parcial no cabo interno ou externo.'
    ],
    // RADIO SOLUTIONS
    'radio_lento_oscilando': [
        'Revisar apontamento da antena (CCQ baixo).',
        'Trocar o cabo de rede para teste.',
        'Trocar a fonte de alimentação (POE).',
        'Verificar se há obstruções novas (árvores, construções).'
    ],
    'radio_sem_servico': [
        'Trocar a fonte de alimentação (POE).',
        'Trocar o cabo de rede.',
        'Testar com outro equipamento de rádio.',
        'Verificar se a antena desconfigurou ou queimou.'
    ],
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
    nextBtn.textContent = n === 4 ? 'Finalizar' : 'Próximo';

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
    if (getCheckboxState('check-doc')) checklistItems.push('[x] Verificado documentação do cliente');

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
${problema || '-'}${acoesNivel1}${solucoesBlock}`;
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
${problema || '-'}${acoesNivel1}${solucoesBlock}`;
}

function generateSecondaryOutput(type) {
    const msgField = type === 'fibra' ? 'fibra-msg' : 'radio-msg';
    const msgCliente = getRadioValue(msgField);
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
            const outro = block.match(/(\([^)]*\))\s*OUTRO/i);

            if (semServico && isChecked(semServico[1])) {
                msgValue = 'SEM SERVIÇO';
            } else if (instabilidade && isChecked(instabilidade[1])) {
                msgValue = 'SERVIÇO COM INSTABILIDADE';
            } else if (outro && isChecked(outro[1])) {
                msgValue = 'OUTRO';
            }

            if (msgValue) {
                const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
                const radioName = activeTab === 'radio' ? 'radio-msg' : 'fibra-msg';
                setRadio(radioName, msgValue);
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
