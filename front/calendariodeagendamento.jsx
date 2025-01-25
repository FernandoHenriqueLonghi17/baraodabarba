import React, { useState } from 'react';
import { View, ScrollView, Text, Image, Button, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Biblioteca de calendário

const App = () => {
  const [isScheduled, setIsScheduled] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [barbeiroId, setBarbeiroId] = useState(1); // Exemplo, pode ser setado dinamicamente com a lógica de perfil
  const [clienteId, setClienteId] = useState(1); // Exemplo, deve ser o ID do cliente logado
  const [servicoId, setServicoId] = useState(1); // Exemplo, deve ser o ID do serviço selecionado

  // Função para selecionar a data no calendário
  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString); // Define a data selecionada no calendário
  };

  // Função para realizar o agendamento
  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Erro', 'Por favor, selecione uma data e um horário.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/agendamento', { // URL do seu servidor
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clienteId: clienteId,
          barbeiroId: barbeiroId,
          servicoId: servicoId,
          data: selectedDate,
          horario: selectedTime,
          status: 'agendado', // O status pode ser 'agendado', 'confirmado', etc.
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsScheduled(true); // Marca o agendamento como realizado
      } else {
        Alert.alert('Erro', data.message || 'Erro ao agendar. Tente novamente.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao se conectar ao servidor. Tente novamente.');
      console.error('Erro:', error);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Botão Voltar */}
        <Image
          source={require('./path/to/ic_back_arrow.png')} // Definir caminho do ícone de seta para voltar
          style={styles.backButton}
        />

        {/* Botão de Perfil */}
        <Image
          source={require('./path/to/ic_profile.png')} // Definir caminho do ícone de perfil
          style={styles.profileButton}
        />

        {/* Calendário */}
        <Calendar
          style={styles.calendar}
          onDayPress={handleDateSelect} // Chama a função de seleção de data
        />

        {/* Título para Seleção de Horário */}
        <Text style={styles.heading}>Escolha o horário</Text>

        {/* Categoria de Horários da Manhã */}
        <Text style={styles.timeCategory}>Manhã</Text>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <Button title="08:00" color="#FFA500" onPress={() => setSelectedTime('08:00')} />
          <Button title="09:00" color="#FFA500" onPress={() => setSelectedTime('09:00')} />
          <Button title="10:00" color="#FFA500" onPress={() => setSelectedTime('10:00')} />
          <Button title="11:00" color="#FFA500" onPress={() => setSelectedTime('11:00')} />
        </ScrollView>

        {/* Categoria de Horários da Tarde */}
        <Text style={styles.timeCategory}>Tarde</Text>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <Button title="14:00" color="#FFA500" onPress={() => setSelectedTime('14:00')} />
          <Button title="15:00" color="#FFA500" onPress={() => setSelectedTime('15:00')} />
          <Button title="16:00" color="#FFA500" onPress={() => setSelectedTime('16:00')} />
          <Button title="17:00" color="#FFA500" onPress={() => setSelectedTime('17:00')} />
          <Button title="18:00" color="#FFA500" onPress={() => setSelectedTime('18:00')} />
        </ScrollView>

        {/* Categoria de Horários da Noite */}
        <Text style={styles.timeCategory}>Noite</Text>
        <ScrollView horizontal={true} style={styles.horizontalScroll}>
          <Button title="19:00" color="#FFA500" onPress={() => setSelectedTime('19:00')} />
          <Button title="20:00" color="#FFA500" onPress={() => setSelectedTime('20:00')} />
          <Button title="21:00" color="#FFA500" onPress={() => setSelectedTime('21:00')} />
        </ScrollView>

        {/* Botão de Agendamento */}
        <Button title="Agendar" color="#FFA500" onPress={handleSchedule} style={styles.scheduleButton} />

        {/* Mensagem de agendamento */}
        {isScheduled && (
          <Text style={styles.successMessage}>Agendado com sucesso!</Text>
        )}
      </View>
    </ScrollView>
  );
};

// Estilos para os componentes
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#1E1E1E',
  },
  container: {
    padding: 8,
  },
  backButton: {
    width: 24,
    height: 24,
    marginTop: 8,
  },
  profileButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 8,
    marginEnd: 8,
    alignSelf: 'flex-end',
  },
  horizontalScroll: {
    marginTop: 16,
  },
  calendar: {
    marginTop: 8,
    backgroundColor: '#333333',
  },
  heading: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  timeCategory: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
  },
  scheduleButton: {
    marginTop: 24,
    backgroundColor: '#FFA500',
  },
  successMessage: {
    color: '#00FF00',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default App;
