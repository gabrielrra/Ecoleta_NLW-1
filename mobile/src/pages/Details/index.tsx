import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  Linking,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RectButton} from 'react-native-gesture-handler';
import Api from '../../services/Api';

interface Point {
  id: number;
  name: string;
  image_url: string;
  email: string;
  city: string;
  uf: string;
  phone: string;
  items: {
    title: string;
  }[];
}
interface Params {
  point_id: number;
}

export default function Points() {
  const navigation = useNavigation();
  const route = useRoute();
  const [point, setPoint] = useState<Point>({} as Point);
  const {point_id} = route.params as Params;

  useEffect(() => {
    Api.get(`points/${point_id}`).then((res) => setPoint(res.data.point));
  });

  function openPhone() {
    let phoneNumber = point.phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${point.phone}`;
    } else {
      phoneNumber = `tel:${point.phone}`;
    }

    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => console.log(err));
  }

  function openMail() {
    Linking.openURL(
      `mailto:${
        point.email
      }?subject=${'Lixo'}&body=${'Meu nome é NOME, vi seu lixo no app e gostaria de comê-lo'}`,
    );
  }
  if (!point.image_url) {
    return null;
  }
  return (
    <SafeAreaView style={styles.container0}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#34cb79" />
        </TouchableOpacity>
        <Image style={styles.pointImage} source={{uri: point.image_url}} />
        <Text style={styles.pointName}>{point.name}</Text>
        <Text style={styles.pointItems}>
          {point.items.map((item) => item.title).join(', ')}
        </Text>
        <View style={styles.address}>
          <Text style={styles.addressTitle}>
            {point.city} - {point.uf}
          </Text>
          <Text style={styles.addressContent}>
            Endereço do lugar que coleta, aquelas coisas que está escrito ali em
            cima
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={openPhone}>
          <Icon name="phone" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Telefone</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={openMail}>
          <Icon name="mail" size={24} color="#FFF" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + (StatusBar.currentHeight || 0),
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});
