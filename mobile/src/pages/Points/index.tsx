import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import MapView, {Marker} from 'react-native-maps';
import {SvgUri} from 'react-native-svg';
import Api from '../../services/Api';

interface Item {
  id: number;
  title: string;
  url: string;
}

interface Point {
  id: number;
  nome: string;
  image_url: string;
  latitude: number;
  longitude: number;
}
export default function Points() {
  const navigation = useNavigation();

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  // const [initialPosition, setInitialPosition] = useState<number[]>([0, 0]);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    Api.get('items').then((res) => setItems(res.data.items));
  }, []);

  useEffect(() => {
    Api.get('points', {
      params: {
        city: 'Ouro Branco',
        uf: 'MG',
        items: selectedItems,
      },
    }).then((res) => setPoints(res.data.points));
  }, [selectedItems]);

  // useEffect(() => {
  //   async function loadPosition() {
  //     const permission = await ExpoLocation.getPermissionsAsync();
  //     if (!permission.canAskAgain) {
  //       Alert.alert(
  //         'Permissão necessária',
  //         'Precisamos da sua permissão de localização, coisa linda',
  //       );
  //       navigation.goBack();
  //     }
  //     const locationPermission = await ExpoLocation.requestPermissionsAsync();
  //     if (!locationPermission) {
  //       Alert.alert(
  //         'Permissão necessária',
  //         'Precisamos da sua permissão, coisa linda',
  //       );
  //       return;
  //     }

  //     const {coords} = await ExpoLocation.getCurrentPositionAsync();
  //     const {latitude, longitude} = coords;
  //     setInitialPosition([latitude, longitude]);
  //   }

  //   loadPosition();
  // });

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
      return;
    }
    setSelectedItems([...selectedItems, id]);
  }
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#34cb79" />
        </TouchableOpacity>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            onPress={() => console.log()}
            initialRegion={{
              latitude: -20.5206602,
              longitude: -43.7046644,
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}>
            <Marker
              title="Você está aqui"
              coordinate={{
                latitude: -20.5206602,
                longitude: -43.704664,
              }}
            />
            {points.map((point) => (
              <Marker
                key={point.id.toString()}
                style={styles.mapMarker}
                onPress={() =>
                  navigation.navigate('Details', {point_id: point.id})
                }
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}>
                <View style={styles.mapMarkerContainer}>
                  <Image
                    style={styles.mapMarkerImage}
                    source={{uri: point.image_url}}
                  />
                  <Text style={styles.mapMarkerTitle}>{point.nome}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          contentContainerStyle={{paddingHorizontal: 20}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {items.map((item) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              key={item.id.toString()}
              onPress={() => handleSelectItem(item.id)}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <SvgUri width={42} height={42} uri={item.url} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + (StatusBar.currentHeight || 20),
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    backgroundColor: '#34CB7950',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});
