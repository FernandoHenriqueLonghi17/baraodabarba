import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native'; // Removido CheckBox, substituído por uma biblioteca
import CheckBox from '@react-native-community/checkbox'; // Certifique-se de instalar o pacote react-native-community/checkbox

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBarber, setIsBarber] = useState(false); // Estado para o checkbox de barbeiro
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento

  // Função de login que faz a requisição ao back-end
  const handleLogin = async () => {
    setLoading(true); // Inicia o estado de carregamento

    const role = isBarber ? 'barbeiro' : 'cliente';
    const loginData = { email, senha: password, role };

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Se o login foi bem-sucedido, você pode armazenar o token
        Alert.alert('Login bem-sucedido!', 'Bem-vindo!', [{ text: 'OK', onPress: () => navigation.navigate('Home') }]);
        console.log(data.token); // Aqui você pode salvar o token no armazenamento seguro
      } else {
        Alert.alert('Erro no login', data.message || 'Credenciais inválidas.');
      }
    } catch (error) {
      Alert.alert('Erro no servidor', 'Tente novamente mais tarde.');
      console.error('Erro:', error);
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  return (
    <View style={styles.container}>
      {/* Ícone da Barbearia */}
      <Image
        source={require('./assets/barber_icon.png')} // Caminho para o ícone da barbearia
        style={styles.icon}
        resizeMode="contain"
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

      {/* Campo de Senha */}
      <TextInput
        style={[styles.input, styles.marginTop16]}
        placeholder="Senha"
        placeholderTextColor="#BDBDBD"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Checkbox para barbeiro */}
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={isBarber}
          onValueChange={setIsBarber}
          tintColors={{ true: '#FFA500', false: '#444444' }} // Cor do checkbox
        />
        <Text style={styles.checkboxText}>Sou barbeiro</Text>
      </View>

      {/* Botão de Esqueceu a Senha */}
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('ResetPassword')} // Navegar para a tela de redefinição de senha
      >
        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      {/* Botão de Login */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin} // Chama a função handleLogin ao clicar no botão
        disabled={loading} // Desabilita o botão enquanto carrega
      >
        <Text style={styles.loginButtonText}>{loading ? 'Entrando...' : 'Login'}</Text>
      </TouchableOpacity>

      {/* Texto "Criar uma Conta" */}
      <TouchableOpacity style={styles.createAccount}>
        <Text style={styles.createAccountText}>Criar uma conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 150,
    height: 150,
    marginBottom: 32,
  },
  input: {
    width: '100%',
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    color: '#FFFFFF',
    marginTop: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkboxText: {
    color: '#FFFFFF',
    marginLeft: 8,
  },
  forgotPassword: {
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#FFA500',
  },
  loginButton: {
    marginTop: 32,
    backgroundColor: '#FFA500',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  createAccount: {
    marginTop: 16,
  },
  createAccountText: {
    color: '#FFA500',
  },
});

export default LoginScreen;
