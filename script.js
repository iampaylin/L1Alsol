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
};

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

    const copyBtnPrimary = document.getElementById('copy-btn-primary');
    copyBtnPrimary.addEventListener('click', () => copyToClipboard('output-text-primary', 'copy-btn-primary'));

    const copyBtnSecondary = document.getElementById('copy-btn-secondary');
    copyBtnSecondary.addEventListener('click', () => copyToClipboard('output-text-secondary', 'copy-btn-secondary'));

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

    const secondaryText = generateSecondaryOutput(type);

    // Separate outputs in different elements
    document.getElementById('output-text-primary').textContent = text;
    document.getElementById('output-text-secondary').textContent = secondaryText;
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
    const diagnostico = getValue('fibra-diagnostico');
    const problema = getValue('fibra-problema');
    const resumoExtra = getValue('fibra-resumo');
    const enderecoAtualizado = getRadioValue('end-doc');
    const contatoAtualizado = getRadioValue('cont-doc');

    // Checklist Logic
    const checklistItems = [];
    if (getCheckboxState('fibra-check-reiniciado')) checklistItems.push('+ Reiniciado equipamentos');
    if (getCheckboxState('fibra-check-config')) checklistItems.push('+ Configurado roteador no padrão Alsol');
    if (getCheckboxState('fibra-check-doc')) checklistItems.push('+ Verificado documentação do cliente');
    //  if (getCheckboxState('fibra-check-sinal')) checklistItems.push(`+ Sinal do cliente: ${sinalCliente ? sinalCliente + 'dBm' : 'N/A'} x CTO: ${sinalCTO ? sinalCTO + 'dBm' : 'N/A'})`);
    if (getCheckboxState('fibra-check-alarmes')) {
        const alarmesTexto = alarmes === 'SIM' ? 'Constam alarmes' : 'Sem alarmes';
        checklistItems.push(`+ Alarmes (${alarmesTexto} ` + (getCheckboxState('LINKLOSS') ? 'LINK LOSS ' : '') + (getCheckboxState('RXLOWPOWER') ? 'RX LOW POWER ' : '') + (getCheckboxState('DYINGGASP') ? 'DYING GASP' : '') + ')');
    }
    if (getCheckboxState('contato')) checklistItems.push('+ Tentativa de contato realizada');
    if (getCheckboxState('fibra-check-temperatura')) checklistItems.push('+ Verificado temperatura da ONU');

    // Combine checklist with extra summary text 
    let resumoFinal = checklistItems.join('\n');
    if (resumoExtra) {
        resumoFinal += (resumoFinal ? '\n\n' : '') + ` ${resumoExtra}`;
    }

    // Solutions Block
    let solucoesBlock = '';
    if (diagnostico && SOLUTIONS[diagnostico]) {
        const title = document.querySelector(`#fibra-diagnostico option[value="${diagnostico}"]`).textContent;
        const actions = SOLUTIONS[diagnostico].map(a => `- ${a}`).join('\n');
        solucoesBlock = `\n\n[AÇÕES PARA TÉCNICO - ${title.toUpperCase()}] \n${actions}`;
    }

    // Get diagnostic label for header
    let diagnosticoTexto = '';
    const diagSelect = document.getElementById('fibra-diagnostico');
    if (diagSelect && diagSelect.selectedIndex > 0) {
        diagnosticoTexto = diagSelect.options[diagSelect.selectedIndex].text;
    }

    return `[MOTIVO: ${diagnosticoTexto || 'NÃO INFORMADO'}]

[DADOS CLIENTE]
Solicitante: ${nome} | Contato: ${contato}
Endereço Atualizado: ${enderecoAtualizado} | Contato Atualizado: ${contatoAtualizado}
Documentação: ${doc}

[CONEXÃO]
Tipo: ${tipo} (${status})
Sinal Cliente: ${sinalCliente}dBm | CTO: ${sinalCTO}dBm
Alarmes: ${alarmes} | Perde pacotes PPPoE: ${pppoe} | Perde pacotes Hosts: ${hosts}
Equip. Desligando: ${equipDesligando} | Remanejamento: ${remanejamento}

[PROBLEMA]
${problema}

[AÇÕES N1]
${checklistItems.join('\n')}${solucoesBlock}`;
}

// SINAL MÉDIO DA CTO: ${sinalCTO ? sinalCTO + 'dbm' : ''} | Removido

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
        resumoFinal += (resumoFinal ? '\n\n' : '') + ` ${resumoExtra}`;
    }

    return `[DADOS CLIENTE]
Solicitante: ${nome} | Contato: ${contato}

[CONEXÃO]
Tipo: ${tipo} (${status})
Sinal Rádio: ${sinal ? sinal + 'dBm' : 'N/A'}
Vinculado: ${vinculado} | Equip. Desligando: ${equipDesligando}

[PROBLEMA]
${problema}

[AÇÕES N1]
${checklistItems.join('\n')}`;
}

function generateSecondaryOutput(type) {
    // Common fields
    let msgCliente, nome, contato, endAtualizado, contAtualizado, relato;

    if (type === 'fibra') {
        msgCliente = getRadioValue('fibra-msg');
        nome = getValue('fibra-nome');
        contato = getValue('fibra-contato');
        endAtualizado = getRadioValue('end-doc');
        contAtualizado = getRadioValue('cont-doc');
        relato = getValue('fibra-problema');
    } else {
        msgCliente = getRadioValue('radio-msg');
        nome = getValue('radio-nome');
        contato = getValue('radio-contato');
        endAtualizado = getRadioValue('radio-end-doc');
        contAtualizado = getRadioValue('radio-cont-doc');
        relato = getValue('radio-problema');
    }

    return `Mensagem do cliente: ${msgCliente}

NOME DO SOLICITANTE: ${nome}
TELEFONE: ${contato}

ENDEREÇO DO CADASTRO ESTÁ ATUALIZADO? ${endAtualizado}
TELEFONE DO CADASTRO ESTÁ ATUALIZADO? ${contAtualizado}

RELATO DO CLIENTE: 
${relato}`;
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
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
