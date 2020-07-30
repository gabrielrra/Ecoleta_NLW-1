import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

import {RectButton} from 'react-native-gesture-handler';
import TextInputSelector from '../../components/TextInputSelector';
import Axios from 'axios';

interface IBGEufResponse {
  sigla: string;
}

interface IBGEcityResponse {
  nome: string;
}
export default function Home() {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState([{id: 0, value: ''}]);
  const [cities, setCities] = useState([{id: 0, value: ''}]);
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    async function getUfsFromIBGE() {
      const {data} = await Axios.get<IBGEufResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      );
      const ufsObjectArray = data
        .map((item) => item.sigla)
        .sort()
        .map((item, index) => ({id: index, value: item}));
      setUfs(ufsObjectArray);
    }
    getUfsFromIBGE();
  }, []);
  useEffect(() => {
    async function getCitiesFromIBGE() {
      const {data} = await Axios.get<IBGEcityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
      );
      const citiesObjectsArray = data
        .map((item) => item.nome)
        .sort()
        .map((item, index) => ({id: index, value: item}));
      setCities(citiesObjectsArray);
    }
    getCitiesFromIBGE();
  }, [selectedUf]);

  function handleNavigation() {
    navigation.navigate('Points');
  }
  const ufIsok = ufs.map((uf) => uf.value).includes(selectedUf);
  const cityIsOk = cities.map((uf) => uf.value).includes(selectedCity);
  return (
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'android' ? undefined : 'padding'}>
        <ImageBackground
          source={require('../../assets/home-background.png')}
          imageStyle={{width: 274, height: 368}}
          style={styles.container}>
          <View style={styles.main}>
            <Image source={require('../../assets/logo.png')} />
            <Text style={styles.title}>
              Seu Marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudando pessoas a encontrar lugar pra jogar seus lixo reciclável
            </Text>
          </View>
          <View style={styles.footer}>
            <TextInputSelector
              maxLength={2}
              data={ufs}
              onChangeText={(text) => setSelectedUf(text)}
              placeholder="UF"
              editable={ufs.length > 0}
            />
            <TextInputSelector
              data={cities}
              placeholder={
                !ufIsok ? 'Selecione uma UF primeiro' : 'Selecione uma cidade'
              }
              onChangeText={(text) => setSelectedCity(text)}
              editable={ufs.map((uf) => uf.value).includes(selectedUf)}
            />
            <RectButton
              style={[
                styles.button,
                cityIsOk ? undefined : {backgroundColor: '#cacaca'},
              ]}
              onPress={() => handleNavigation()}
              enabled={cityIsOk}>
              <Text style={styles.buttonText}>Ver os pontos de coleta</Text>
              <View style={styles.buttonIcon}>
                <Icon name="arrow-right" color="#fff" size={24} />
              </View>
            </RectButton>
            <RectButton style={styles.buttonCad} onPress={() => {}}>
              <Text style={styles.buttonText}>Quero cadastrar um ponto</Text>
            </RectButton>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
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
    marginTop: 60,
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

  select: {},

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
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    textTransform: 'uppercase',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  buttonCad: {
    backgroundColor: '#30E34E',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  modalView: {
    maxHeight: 100,
    marginBottom: 4,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
