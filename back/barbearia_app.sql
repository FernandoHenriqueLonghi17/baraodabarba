-- Criar Banco de Dados
CREATE DATABASE IF NOT EXISTS barbearia_app;
USE barbearia_app;

-- Criar tabela Cliente
CREATE TABLE Cliente (
    ID_Cliente INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Foto VARCHAR(255),
    Telefone VARCHAR(15),
    Preferencias TEXT
);

-- Criar tabela Barbeiro
CREATE TABLE Barbeiro (
    ID_Barbeiro INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Foto VARCHAR(255),
    Telefone VARCHAR(15),
    Especialidade VARCHAR(100)
);

-- Criar tabela Serviço
CREATE TABLE Servico (
    ID_Servico INT AUTO_INCREMENT PRIMARY KEY,
    Descricao VARCHAR(255) NOT NULL,
    Preco DECIMAL(10, 2) NOT NULL,
    BarbeiroID INT NOT NULL,
    FOREIGN KEY (BarbeiroID) REFERENCES Barbeiro(ID_Barbeiro) ON DELETE CASCADE
);

-- Criar tabela Agendamento
CREATE TABLE Agendamento (
    ID_Agendamento INT AUTO_INCREMENT PRIMARY KEY,
    Data DATE NOT NULL,
    Time TIME NOT NULL,
    Status ENUM('Pendente', 'Confirmado', 'Cancelado') DEFAULT 'Pendente',
    ClienteID INT NOT NULL,
    BarbeiroID INT NOT NULL,
    ServicoID INT NOT NULL,
    FOREIGN KEY (ClienteID) REFERENCES Cliente(ID_Cliente) ON DELETE CASCADE,
    FOREIGN KEY (BarbeiroID) REFERENCES Barbeiro(ID_Barbeiro) ON DELETE CASCADE,
    FOREIGN KEY (ServicoID) REFERENCES Servico(ID_Servico) ON DELETE CASCADE
);

-- Criar tabela intermediária Cliente_Agendamento (N:N entre Cliente e Agendamento)
CREATE TABLE Cliente_Agendamento (
    ID_Cliente INT NOT NULL,
    ID_Agendamento INT NOT NULL,
    PRIMARY KEY (ID_Cliente, ID_Agendamento),
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente) ON DELETE CASCADE,
    FOREIGN KEY (ID_Agendamento) REFERENCES Agendamento(ID_Agendamento) ON DELETE CASCADE
);
