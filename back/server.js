const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('/Dev/teste html/tcc/firebase/firebase-adminsdk-q1xkq-e2cb949e97.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Configuração do App
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuração do Banco de Dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'barbearia_app'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados MySQL');
    }
});

// Função para autenticar token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send({ auth: false, message: 'Nenhum token fornecido.' });

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Falha ao autenticar o token.' });
        req.userId = decoded.id;
        next();
    });
};

// Cadastro de Cliente
app.post('/register/cliente', (req, res) => {
    const { nome, email, senha, foto, telefone } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 8);

    const sql = 'INSERT INTO clientes (nome, email, senha, foto, telefone) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, email, hashedPassword, foto, telefone], (err, result) => {
        if (err) return res.status(500).send('Erro no servidor.');
        res.status(200).send({ message: 'Cliente cadastrado com sucesso!' });
    });
});

// Cadastro de Barbeiro
app.post('/register/barbeiro', (req, res) => {
    const { nome, email, senha, foto, telefone } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 8);

    const sql = 'INSERT INTO barbeiros (nome, email, senha, foto, telefone) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, email, hashedPassword, foto, telefone], (err, result) => {
        if (err) return res.status(500).send('Erro no servidor.');
        res.status(200).send({ message: 'Barbeiro cadastrado com sucesso!' });
    });
});

// Login de Cliente e Barbeiro
app.post('/login', (req, res) => {
    const { email, senha, role } = req.body;
    const table = role === 'barbeiro' ? 'barbeiros' : 'clientes';

    const sql = `
                SELECT p.*, c.id_cliente, b.id_barbeiro FROM pessoas p
                LEFT JOIN clientes c ON p.id = c.id_pessoa
                LEFT JOIN barbeiros b ON p.id = b.id_pessoa
                WHERE p.email = ? AND (c.id_cliente IS NOT NULL OR b.id_barbeiro IS NOT NULL)
            `;

    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).send('Erro no servidor.');
        if (results.length === 0) return res.status(404).send('Usuário não encontrado.');

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(senha, user.senha);

        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: 86400 }); // Token expira em 24 horas
        res.status(200).send({ auth: true, token });
    });
});

// Agendamento de Serviço
app.post('/agendamento', verifyToken, (req, res) => {
    const { clienteId, barbeiroId, servicoId, data, horario, status } = req.body;

    const verificarDisponibilidade = `
            SELECT * FROM agendamentos
            WHERE barbeiroid = ? AND data = ? AND horario = ?
            `;

    db.query(verificarDisponibilidade, [barbeiroId, data, horario], (err, results) => {
        if (err) return res.status(500).send('Erro no servidor.');
        if (results.length > 0) return res.status(400).send('Horário indisponível.');

        const sql = `
                INSERT INTO agendamentos (clienteId, barbeiroid, servicoid, data, horario, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

        db.query(sql, [clienteId, barbeiroId, servicoId, data, horario, status], (err, result) => {
            if (err) return res.status(500).send('Erro ao agendar.');
            res.status(200).send({ message: 'Agendamento realizado com sucesso!' });
        });
    });
});

// Listar serviços
app.get('/servicos', (req, res) => {
    const sql = 'SELECT * FROM servicos';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send('Erro ao buscar serviços.');
        res.status(200).send(results);
    });
});

// Função para enviar notificação push
const sendPushNotification = (fcmToken, message) => {
    const payload = {
        notification: {
            title: message.title,
            body: message.body,
        },
    };

    admin.messaging().sendToDevice(fcmToken, payload)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
};

// Enviar notificação quando uma nova promoção for criada
app.post('/promocao', async (req, res) => {
    const { descricao, barbeiroId, dataInicio, dataFim } = req.body;

    try {
        await db.query('INSERT INTO promocoes (descricao, barbeiroId, dataInicio, dataFim) VALUES (?, ?, ?, ?)', [descricao, barbeiroId, dataInicio, dataFim]);

        // Obtenha todos os tokens FCM dos clientes para enviar a notificação
        const [Clientes] = await db.query('SELECT fcmToken FROM clientes WHERE fcmToken IS NOT NULL');

        const message = {
            title: 'Nova Promoção Disponível!',
            body: descricao,
        };

        // Envie notificações para cada cliente
        clientes.forEach((cliente) => {
            sendPushNotification(cliente.fcmToken, message);
        });

        res.status(200).send('Promoção criada e notificação enviada!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar promoção');
    }
});

// Atualizar perfil do cliente
app.put('/cliente/perfil/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, foto, telefone } = req.body;

    try {
        let senhaHashed = null;
        if (senha) {
            senhaHashed = await bcrypt.hash(senha, 10);
        }

        const [results] = await db.query(
            `UPDATE clientes 
            SET nome = COALESCE(?, nome), 
                email = COALESCE(?, email), 
                senha = COALESCE(?, senha), 
                foto = COALESCE(?, foto),
                telefone = COALESCE(?, telefone) 
            WHERE id = ?`,
            [nome, email, senhaHashed, foto, telefone, id]
        );

        if (results.affectedRows > 0) {
            res.status(200).send('Perfil atualizado com sucesso!');
        } else {
            res.status(404).send('Cliente não encontrado.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar perfil.');
    }
});

// Cancelar agendamento
app.delete('/agendamento/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM agendamentos WHERE id = ?', [id]);
        res.status(200).send('Agendamento cancelado com sucesso!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cancelar agendamento.');
    }
});
// Redefinir Senha
app.post('/redefinir-senha', (req, res) => {
    const { email, novaSenha, confirmarSenha } = req.body;

    // Verificar se as senhas coincidem
    if (novaSenha !== confirmarSenha) {
        return res.status(400).send({ message: 'As senhas não coincidem.' });
    }

    // Verificar se o e-mail está registrado
    const sqlVerificarEmail = 'SELECT * FROM clientes WHERE email = ?';
    db.query(sqlVerificarEmail, [email], (err, results) => {
        if (err) return res.status(500).send('Erro ao verificar o e-mail.');
        if (results.length === 0) return res.status(404).send('E-mail não encontrado.');

        // Se o e-mail existe, hash a nova senha
        const senhaHash = bcrypt.hashSync(novaSenha, 8);

        // Atualizar a senha no banco de dados
        const sqlAtualizarSenha = 'UPDATE clientes SET senha = ? WHERE email = ?';
        db.query(sqlAtualizarSenha, [senhaHash, email], (err, result) => {
            if (err) return res.status(500).send('Erro ao atualizar a senha.');
            if (result.affectedRows > 0) {
                return res.status(200).send('Senha redefinida com sucesso!');
            } else {
                return res.status(500).send('Erro ao redefinir a senha.');
            }
        });
    });
});

// Rota para listar todos os barbeiros cadastrados
app.get('/barbeiros', (req, res) => {
    const sql = 'SELECT * FROM barbeiros';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send('Erro ao buscar barbeiros.');
        res.status(200).send(results);
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
