import React, { useEffect, useState, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, Picker } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface IBGEUFResponse{
  sigla: string;
}
interface IBGECityResponse{
  nome: string;
}


const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
 
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials);
        
      });
  }, []);

  useEffect(() => {
      if (selectedUf === '0'){
          return;
      }

      axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
          const cityNames = response.data.map(city => city.nome);

          setCities(cityNames);
      });
      
  }, [selectedUf]);


  function handleSelectUf(value: ChangeEvent<Picker>) {
    const uf = String(value);

    setSelectedUf(uf);
  };

  function handleSelectCity(value: ChangeEvent<Picker>) {
      const city = String(value);

      setSelectedCity(city);
  };

  function handleNavigateToPoints() {
    navigation.navigate('Points',{
      selectedUf,
      selectedCity
    })
  }
 
    return (
    <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container} 
        imageStyle={{ width: 274, height: 368 }}

    >
        <View style={styles.main}>
            <Image source={require('../../assets/logo.png')} />
            <Text style={styles.title}> Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>

        
        <View style={styles.footer}>
          
            <Picker
                style={styles.select}
                selectedValue={selectedUf}
                onValueChange={(uf) => handleSelectUf(uf)}
            >
              {ufs.map((uf)=>(
                <Picker.Item label={uf} value={uf} key={uf} />)
            )}
            </Picker>
            <Picker
                style={styles.select}
                selectedValue={selectedCity}
                onValueChange={(city) => handleSelectCity(city)}
            >
              {cities.map((city)=>(
                <Picker.Item label={city} value={city} key={city} />)
            )}
            </Picker>


            <RectButton style={styles.button} onPress={console.log(selectedCity)}>
                <View style={styles.buttonIcon}>
                    <Text>
                        <Icon name="arrow-right" color="#FFF" size={24}/>
                    </Text>
                </View>
                <Text style={styles.buttonText}>
                    Entrar
                </Text>
            </RectButton>
        </View>
    </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32 ,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {
      backgroundColor: "#FFF",
      height: 60,
      borderRadius: 25,
      marginBottom: 10,
      fontFamily: 'Roboto_400Regular',
    },
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;