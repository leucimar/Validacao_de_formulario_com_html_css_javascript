// Seleciona os elementos do formulário
const form = document.forms.cadastrationForm;
const nomeInput = document.querySelector('#nomeInput');
const cpfInput = document.querySelector('#cpfInput');
const loginInput = document.querySelector('#loginInput');
const emailInput = document.querySelector('#emailInput');
const senhaInput = document.querySelector('#senhaInput');
const confirmaSenhaInput = document.querySelector('#confirmSenhaInput');
const salarioInput = document.querySelector('#salarioInput');
const dependentesInput = document.querySelector('#dependentesInput');
const irInput = document.querySelector('#impostoRendaInput');

// Seleciona todos os botões "olhinho"
const togglePassButtons = document.querySelectorAll('.toggle-pass');

// Adiciona o evento de clique para cada botão "olhinho"
togglePassButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const input = button.closest('.input-wrapper').querySelector('input');
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        button.textContent = type === 'password' ? '👁️' : '🙈';
    });
});

// Permite mudar de campo ao pressionar Enter
const inputs = [nomeInput, cpfInput, loginInput, emailInput, senhaInput, confirmaSenhaInput, salarioInput, dependentesInput];
inputs.forEach((input, index) => {
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Impede o comportamento padrão do Enter
            const nextInput = inputs[index + 1];
            if (nextInput) {
                nextInput.focus(); // Move o foco para o próximo campo
            } else {
                form.querySelector('button[type="submit"]').focus(); // Foca no botão "Cadastrar" se for o último campo
            }
        }
    });
});

// Função para exibir mensagens de erro
function showError(input, message) {
    const error = input.closest('.input-wrapper')?.querySelector('.error-message') || input.nextElementSibling;
    if (error) {
        error.textContent = message; // Define a mensagem de erro
    }
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
}

// Função para exibir sucesso
function showSuccess(input) {
    const error = input.closest('.input-wrapper')?.querySelector('.error-message') || input.nextElementSibling;
    if (error) {
        error.textContent = ''; // Remove a mensagem de erro
    }
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
}

// Valida Nome Completo
nomeInput.addEventListener('blur', () => {
    if (nomeInput.value.trim().length < 3) {
        showError(nomeInput, 'O nome deve ter pelo menos 3 caracteres.');
    } else {
        showSuccess(nomeInput);
    }
});

// Valida CPF
cpfInput.addEventListener('blur', () => {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    let value = cpfInput.value.replace(/^([\d]{3})([\d]{3})([\d]{3})([\d]{2})$/, "$1.$2.$3-$4");
    cpfInput.value = value;
    if (!cpfRegex.test(cpfInput.value)) {
        showError(cpfInput, 'O CPF deve estar no formato 000.000.000-00.');
    } else {
        showSuccess(cpfInput);
    }
});

// Valida Login
loginInput.addEventListener('blur', () => {
    const loginRegex = /^[A-Za-z0-9._-]{4,}$/;
    if (!loginRegex.test(loginInput.value)) {
        showError(loginInput, 'O login deve ter pelo menos 4 caracteres e conter apenas letras, números e ., _, -.');
    } else {
        showSuccess(loginInput);
    }
});

// Valida E-mail
emailInput.addEventListener('blur', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Digite um e-mail válido.');
    } else {
        showSuccess(emailInput);
    }
});

// Valida Senha
senhaInput.addEventListener('blur', () => {
    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!senhaRegex.test(senhaInput.value)) {
        showError(senhaInput, 'A senha deve ter pelo menos 8 caracteres, incluindo letras e números.');
    } else {
        showSuccess(senhaInput);
    }
});

// Valida Confirmação de Senha
confirmaSenhaInput.addEventListener('input', () => {
    if (confirmaSenhaInput.value !== senhaInput.value) {
        showError(confirmaSenhaInput, 'As senhas não coincidem.');
    } else {
        showSuccess(confirmaSenhaInput);
    }
});

// Valida Salário
salarioInput.addEventListener('blur', () => {
    const salario = parseFloat(salarioInput.value);
    if (isNaN(salario) || salario <= 0) {
        showError(salarioInput, 'O salário deve ser um valor maior que zero.');
    } else {
        showSuccess(salarioInput);
    }
});

// Valida Número de Dependentes
dependentesInput.addEventListener('blur', () => {
    const dependentes = parseInt(dependentesInput.value);
    if (isNaN(dependentes) || dependentes < 0) {
        showError(dependentesInput, 'O número de dependentes deve ser maior ou igual a zero.');
    } else {
        showSuccess(dependentesInput);
    }
});

// Calcula o Imposto de Renda
function calcularIR() {
    let salario = parseFloat(salarioInput.value) || 0; // Obtém o salário como número
    const dependentes = parseInt(dependentesInput.value) || 0; // Obtém o número de dependentes como número inteiro
    let ir = 0; // Inicializa o valor do IR

    // Calcula o IR com base nas faixas de salário
    salario -= dependentes * 200.00;
    if (salario <= 2000.00) {
        ir = 0;
    } else if (salario > 2000.00 && salario <= 3000.00) {
        ir = salario * 0.075;
    } else if (salario > 3000.00 && salario <= 4500.00) {
        ir = salario * 0.15;
    } else if (salario > 4500.00 && salario < 6000.00) {
        ir = salario * 0.225;
    } else {
        ir = salario * 0.225; // para salários de 6000 ou mais
    }
    // Garante que o IR não seja negativo
    ir = Math.max(0, ir);

    // Exibe o valor calculado no campo IR com duas casas decimais
    irInput.value = ir.toFixed(2);
}

// Adiciona o evento blur ao campo de dependentes para calcular o IR
dependentesInput.addEventListener('blur', () => {
    calcularIR();
});

// Reseta o formulário ao clicar em "Limpar"
form.querySelector('button[type="reset"]').addEventListener('click', () => {
    inputs.forEach((input) => {
        input.classList.remove('is-valid', 'is-invalid');
        const error = input.closest('.input-wrapper')?.querySelector('.error-message') || input.nextElementSibling;
        if (error) {
            error.textContent = '';
        }
    });
    irInput.value = '0,00';
});

// Validações adicionais no envio do formulário
form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;

    inputs.forEach((input) => {
        if (!input.classList.contains('is-valid')) {
            isValid = false;
            input.focus();
            return;
        }
    });

    if (isValid) {
        alert('Usuário cadastrado com sucesso!');
        form.reset();
        inputs.forEach((input) => input.classList.remove('is-valid', 'is-invalid'));
        irInput.value = '0,00';
    }
});
