document.addEventListener('DOMContentLoaded', () => {

    // Tab Switching Logic
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');

            // Trigger generation to update output immediately
            generateNote();
        });
    });

    // Event Listeners for Input Changes
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', generateNote);
        input.addEventListener('change', generateNote);
    });

    const copyBtn = document.getElementById('copy-btn');
    copyBtn.addEventListener('click', copyToClipboard);

    const cleanBtn = document.getElementById('clean-btn');
    cleanBtn.addEventListener('click', clearForm);

    // Input Masking
    setupMasks();

    // Initial Generation
    generateNote();
});

function setupMasks() {
    // Phone Masks
    ['fibra-contato', 'radio-contato'].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
            generateNote();
        });
    });

    // Signal Masks
    ['fibra-sinal', 'fibra-sinal-cliente', 'radio-sinal'].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', (e) => {
            e.target.value = maskSignal(e.target.value);
            generateNote();
        });
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
    // Allow numbers, minus sign, and dot
    let v = value.replace(/[^\d.-]/g, '');

    // Ensure only one minus at the start
    if (v.indexOf('-') > 0) {
        v = v.replace(/-/g, '');
    }

    return v;
}

function clearForm() {
    const activeTab = getActiveTab();
    const selector = activeTab === 'fibra' ? '#fibra input, #fibra textarea' : '#radio input, #radio textarea';
    const inputs = document.querySelectorAll(selector);

    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            if (input.defaultChecked) {
                input.checked = true;
            } else {
                input.checked = false;
            }
        } else {
            input.value = '';
        }
    });

    // Specific reset for radio groups if no default exists (fallback)
    // But currently HTML has "checked" attributes so defaultChecked works.

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

    document.getElementById('output-text').textContent = text;
}

function generateFibraNote() {
    const nome = getValue('fibra-nome');
    const contato = getValue('fibra-contato');
    const tipo = getRadioValue('fibra-tipo');
    const status = getRadioValue('fibra-status');
    const doc = getRadioValue('fibra-doc');
    const remanejamento = getRadioValue('fibra-remanejamento');
    const alarmes = getRadioValue('fibra-alarmes');
    const pppoe = getRadioValue('fibra-pppoe');
    const hosts = getRadioValue('fibra-hosts');
    const equipDesligando = getRadioValue('fibra-equip-desligando');
    const sinalCTO = getValue('fibra-sinal');
    const sinalCliente = getValue('fibra-sinal-cliente');
    const problema = getValue('fibra-problema');
    const resumoExtra = getValue('fibra-resumo');

    // Checklist Logic
    const checklistItems = [];
    if (getCheckboxState('fibra-check-reiniciado')) checklistItems.push('+ Reiniciado equipamentos');
    if (getCheckboxState('fibra-check-config')) checklistItems.push('+ Configurado roteador no padrão Alsol');
    if (getCheckboxState('fibra-check-doc')) checklistItems.push('+ Verificado documentação do cliente');
    if (getCheckboxState('fibra-check-sinal')) checklistItems.push(`+ Verificado sinal do cliente (${sinalCliente ? sinalCliente + 'dBm' : 'N/A'})`);
    if (getCheckboxState('fibra-check-alarmes')) {
        const alarmesTexto = alarmes === 'SIM' ? 'Constam alarmes' : 'Sem alarmes';
        checklistItems.push(`+ Alarmes (${alarmesTexto})`);
    }

    // Combine checklist with extra summary text
    let resumoFinal = checklistItems.join('\n');
    if (resumoExtra) {
        resumoFinal += (resumoFinal ? '\n\n' : '') + `⚠️ ${resumoExtra}`;
    }

    return `
NOME DO SOLICITANTE: ${nome}
CONTATO CLIENTE: ${contato}
TIPO DE CONEXÃO: ${formatRadioOption(tipo, ['FTTH', 'WIRELESS', 'SERVIÇO DE TV'])}
STATUS DA CONEXÃO: ${formatRadioOption(status, ['ONLINE', 'OFFLINE'])}
POSSUI DOCUMENTAÇÃO: ${formatRadioOption(doc, ['SIM', 'NÃO'])}
REMANEJAMENTO: ${formatRadioOption(remanejamento, ['SIM', 'NÃO'])}
POSSUI ALARMES NA ONU/ANTENA: ${formatRadioOption(alarmes, ['SIM', 'NÃO'])}
PERDE PACOTES PARA O PPPOE: ${formatRadioOption(pppoe, ['SIM', 'NÃO'])}
PERDE PACOTES PARA HOSTS DO CLIENTE: ${formatRadioOption(hosts, ['SIM', 'NÃO'])}
EQUIPAMENTOS DESLIGANDO: ${formatRadioOption(equipDesligando, ['SIM', 'NÃO'])}
SINAL MÉDIO DA CTO: ${sinalCTO ? sinalCTO + 'dbm' : ''}

Problema:
${problema}

* Nível 1 *
${resumoFinal}`;
}

function generateRadioNote() {
    const nome = getValue('radio-nome');
    const contato = getValue('radio-contato');
    const tipo = getRadioValue('radio-tipo');
    const status = getRadioValue('radio-status');
    const vinculado = getRadioValue('radio-vinculado');
    const equipDesligando = getRadioValue('radio-equip-desligando');
    const sinal = getValue('radio-sinal');
    const problema = getValue('radio-problema');
    const resumoExtra = getValue('radio-resumo');

    // Checklist Logic
    const checklistItems = [];
    if (getCheckboxState('radio-check-reiniciado')) checklistItems.push('+ Reiniciado equipamentos');

    let resumoFinal = checklistItems.join('\n');
    if (resumoExtra) {
        resumoFinal += (resumoFinal ? '\n\n' : '') + `⚠️ ${resumoExtra}`;
    }

    return `Rádio:
NOME DO SOLICITANTE: ${nome}
CONTATO CLIENTE: ${contato}
TIPO DE CONEXÃO: ${formatRadioOption(tipo, ['FTTH', 'WIRELESS', 'SERVIÇO DE TV'])}
STATUS DA CONEXÃO: ${formatRadioOption(status, ['ONLINE', 'OFFLINE'])}
CLIENTE RÁDIO VINCULADO: ${formatRadioOption(vinculado, ['SIM', 'NÃO'])}
EQUIPAMENTOS DESLIGANDO: ${formatRadioOption(equipDesligando, ['SIM', 'NÃO'])}
SINAL RADIO: ${sinal ? sinal + 'dbm' : ''}

Problema:
${problema}

* Nível 1 *
${resumoFinal}`;
}

// Helper to format the ( ) Option | ( ) Option style
function formatRadioOption(selected, options) {
    return options.map(opt => {
        const marker = opt === selected ? '( X )' : '(   )';
        return `${marker} ${opt}`;
    }).join(' | ');
}

function copyToClipboard() {
    const text = document.getElementById('output-text').textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copy-btn');
        const originalText = btn.textContent;

        btn.textContent = 'Copiado!';
        btn.style.backgroundColor = '#00ff88'; // Success green

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = ''; // Revert to CSS default
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
