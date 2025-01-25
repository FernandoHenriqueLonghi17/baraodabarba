import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const ProfileScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150'); // Placeholder image

  // Assuming you have a way to get the user's ID and token from storage
  const userId = 'USER_ID'; // Retrieve this from storage
  const token = 'JWT_TOKEN'; // Retrieve JWT from storage

  const handleConfirmChanges = async () => {
    // Basic password validation
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      // Prepare the data to update
      const updatedProfile = {
        nome: name,
        email: email,
        senha: newPassword || undefined, // Only update password if provided
        foto: profilePic,
        telefone: phone,
      };

      // Make the PUT request to update the profile
      const response = await axios.put(
        `http://YOUR_API_URL/cliente/perfil/${userId}`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token in the header
          },
        }
      );

      if (response.status === 200) {
        alert('Perfil atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar perfil.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho com botão de voltar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>

      {/* Seção de foto de perfil */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profilePic }} // Use the profile image URL
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon}>
          <Icon name="camera" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Campos de entrada */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Icon name="person-outline" size={20} color="#FFFFFF" />
          <TextInput
            style={styles.input}
            placeholder="Nome de Usuário"
            placeholderTextColor="#BDBDBD"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon name="mail-outline" size={20} color="#FFFFFF" />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#BDBDBD"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon name="call-outline" size={20} color="#FFFFFF" />
          <TextInput
            style={styles.input}
            placeholder="Número de Telefone"
            placeholderTextColor="#BDBDBD"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon name="lock-closed-outline" size={20} color="#FFFFFF" />
          <TextInput
            style={styles.input}
            placeholder="Senha atual"
            placeholderTextColor="#BDBDBD"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon name="lock-closed-outline" size={20} color="#FFFFFF" />
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            placeholderTextColor="#BDBDBD"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon name="lock-closed-outline" size={20} color="#FFFFFF" />
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor="#BDBDBD"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      </View>

      {/* Botão Confirmar alterações */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmChanges}>
        <Text style={styles.confirmButtonText}>Confirmar mudanças</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#FFA500',
    borderRadius: 20,
    padding: 8,
  },
  inputContainer: {
    marginVertical: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: '#FFA500',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
