import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';  // Importando o axios para fazer requisição HTTP

const BarbersListScreen = ({ navigation }) => {
  const [barbers, setBarbers] = useState([]); // Estado para armazenar os barbeiros
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  // Função para buscar barbeiros do banco
  const fetchBarbers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/barbeiros'); // URL da sua API
      setBarbers(response.data); // Atualiza o estado com os barbeiros recebidos
    } catch (error) {
      console.error('Erro ao buscar barbeiros:', error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  // Usando useEffect para carregar os barbeiros ao carregar o componente
  useEffect(() => {
    fetchBarbers();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Schedule', { barber: item })}>
      <View style={styles.barberCard}>
        <Image
          source={{ uri: item.foto || 'https://via.placeholder.com/150' }}  // Foto do barbeiro, caso não tenha, usa o placeholder
          style={styles.barberImage}
        />
        <View style={styles.barberInfo}>
          <Text style={styles.barberName}>{item.nome}</Text>  {/* Mudando de 'name' para 'nome' */}
          <View style={styles.barberDetails}>
            <Icon name="calendar-outline" size={16} color="#FFA500" />
            <Text style={styles.barberSchedule}>{item.agenda || 'Segunda à sexta'}</Text>  {/* Mudando para campo dinâmico */}
          </View>
          <View style={styles.barberDetails}>
            <Icon name="time-outline" size={16} color="#FFA500" />
            <Text style={styles.barberHours}>{item.horas || '8h às 21h'}</Text>  {/* Mudando para campo dinâmico */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Verificando se os dados ainda estão carregando
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem vindo,</Text>
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Cabeleireiros</Text>
      <FlatList
        data={barbers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}  {/* Garantindo que a chave seja uma string */}
        contentContainerStyle={styles.barbersList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  barbersList: {
    paddingBottom: 16,
  },
  barberCard: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  barberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  barberInfo: {
    flex: 1,
  },
  barberName: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  barberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  barberSchedule: {
    color: '#FFFFFF',
    marginLeft: 8,
  },
  barberHours: {
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default BarbersListScreen;
