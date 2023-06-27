function criarConsulta(req, res) {
    const { tipoConsulta, valorConsulta, paciente } = req.body;

    // verificar se todos os dados estão preenchidos 
    if (!tipoConsulta || !valorConsulta || !paciente) {
        return res.status(400).json({
            message: 'Preencha todos os dados para prosseguir.'
        });
    }

    // verificar se o valor da consulta é um número
    if (typeof valorConsulta !== 'number') {
        return res.status(400).json({
            message: 'Insira um número válido.'
        });
    }

    // verificar se o email é único
    const emailExistente = data.consultas.find(el => el.paciente.email === paciente.email);

    if (emailExistente) {
        return res.status(400).json({ message: 'Já existe uma conta vinculada a este e-mail.' });
    }

    // verificar se o cpf é único 
    const cpfExistente = data.consultas.find(el => el.paciente.cpf === paciente.cpf);
    if (cpfExistente) {
        return res.status(400).json({
            message: 'Já existe uma conta vinculada a este CPF.'
        });
    }

    // verificar se há alguma consulta em andamento
    const consultaExistente = data.consultas.find(el => !el.finalizada && (el.paciente.email === paciente.email || el.paciente.cpf === paciente.cpf));
    if (consultaExistente) {
        return res.status(400).json({ message: 'Já existe uma consulta em andamento com o CPF/e-mail informado!' });
    }

    // validar se a especialidade existe
    const especialidade = tipoConsulta.especialidade;
    const medicoEspecializado = data.medicos.find(medico => medico.especialidade === especialidade);
    if (!medicoEspecializado) {
        return res.status(400).json({
            message: 'Não atendemos essa especialidade!'
        });
    }

    // identificador do médico
    const idMedico = medicoEspecializado.identificador;

    // criar id de consulta único
    const idConsulta = data.consultas.length + 1;

    const novaConsulta = {
        identificador: idConsulta,
        tipoConsulta,
        idMedico,
        finalizada: false,
        valorConsulta,
        paciente,
    };

    data.consultas.push(novaConsulta);
    const { senha: _, ...user } = paciente;
    return res.status(201).json(user);
}
