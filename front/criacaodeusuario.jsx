import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // Campo para número de telefone
  const [isBarber, setIsBarber] = useState(false); // Controle para determinar se o usuário é barbeiro ou cliente

  // Função para criar o usuário no servidor
  const handleSignup = async () => {
    if (email && password && name && phone) {
      try {
        const endpoint = isBarber ? 'barbeiro' : 'cliente'; // Define qual endpoint será utilizado
        const response = await fetch(`http://localhost:3000/register/${endpoint}`, { // URL do servidor de back-end
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: name,
            email: email,
            senha: password,
            telefone: phone,
            foto: '' // Opcional: você pode adicionar uma foto ou manipular esse campo
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert('Sucesso', data.message || 'Conta criada com sucesso!');
          navigation.navigate('Login'); // Navegar para a tela de Login após criação da conta
        } else {
          Alert.alert('Erro', data.message || 'Erro ao criar a conta.');
        }
      } catch (error) {
        Alert.alert('Erro', 'Erro ao se conectar ao servidor. Tente novamente.');
        console.error('Erro:', error);
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Campo de Nome */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#BDBDBD"
        value={name}
        onChangeText={setName}
      />

      {/* Campo de E-mail */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#BDBDBD"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo de Telefone */}
      <TextInput
        style={styles.input}
        placeholder="Número de Telefone"
        placeholderTextColor="#BDBDBD"
        keyboardType="phone-pad" // Define o teclado apropriado para número de telefone
        value={phone}
        onChangeText={setPhone}
      />

      {/* Campo de Senha */}
      <TextInput
        style={[styles.input, styles.marginTop16]}
        placeholder="Senha"
        placeholderTextColor="#BDBDBD"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Checkbox ou Toggle para selecionar se é barbeiro */}
      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxText}>Sou barbeiro</Text>
        <TouchableOpacity onPress={() => setIsBarber(!isBarber)}>
          <Text style={styles.checkboxToggle}>{isBarber ? 'Sim' : 'Não'}</Text>
        </TouchableOpacity>
      </View>

      {/* Botão de Criar Conta */}
      <TouchableOpacity style={styles.createAccountButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>

      {/* Texto "Já tem uma conta?" */}
      <TouchableOpacity
        style={styles.existingAccount}
        onPress={() => navigation.navigate('Login')} // Navegar para a tela de Login se já tiver conta
      >
        <Text style={styles.existingAccountText}>Já tem uma conta?</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#444444',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderColor: '#FFA500',
    borderWidth: 1,
    marginVertical: 8,
  },
  marginTop16: {
    marginTop: 16,
  },
  createAccountButton: {
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  existingAccount: {
    marginTop: 24,
    alignSelf: 'center',
  },
  existingAccountText: {
    color: '#FFA500',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  checkboxText: {
    color: '#FFFFFF',
  },
  checkboxToggle: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
