import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import Axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import DropZone from '../../components/DropZone';

import logo from '../../assets/logo.svg';
import api from '../../services/Api';

import './styles.css';

interface Item {
  id: number;
  title: string;
  url: string;
}
interface IbgeUF {
  sigla: string;
}
interface IbgeCity {
  nome: string;
}
interface FormData {
  name: number;
  phone: string;
  email: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>('0');
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedImage, setSelectedImage] = useState<Blob>(new Blob());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setInitialPosition([coords.latitude, coords.longitude]);
    });
  }, []);
  useEffect(() => {
    api.get('items').then((res) => setItems(res.data.items));
  }, []);

  useEffect(() => {
    Axios.get<IbgeUF[]>(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
    ).then((res) => {
      const ufs = res.data.map((uf) => uf.sigla);
      setUfs(ufs);
    });
  }, []);

  useEffect(() => {
    Axios.get<IbgeCity[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
    ).then((res) => {
      const cities = res.data.map((city) => city.nome);
      setCities(cities);
    });
  }, [selectedUf]);

  function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUf(event.target.value);
  }
  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value);
  }
  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }
  function handleInputs(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
      return;
    }
    setSelectedItems([...selectedItems, id]);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    const { name, phone, email } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append('name', name);
    data.append('phone', phone);
    data.append('email', email);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', latitude.toString());
    data.append('longitude', longitude.toString());
    data.append('items', JSON.stringify(items));
    data.append('image', selectedImage);
    await api.post('points', data);
    await alert('De boas, deu certo eu acho');
    history.push('/');
  }
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={submit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>
        <DropZone onFileUploaded={(file) => setSelectedImage(file)} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da Entidade</label>
            <input type="text" name="name" id="name" onChange={handleInputs} />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={handleInputs}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Telefone</label>
              <input
                type="text"
                name="phone"
                id="phone"
                onChange={handleInputs}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          {/* MAPA */}
          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={initialPosition} />
            <Marker position={selectedPosition} />
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                value={selectedUf}
                name="uf"
                id="uf"
                onChange={handleSelectUF}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                value={selectedCity}
                name="city"
                id="city"
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma Cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
          </legend>
          <ul className="items-grid">
            {items.map((item, index) => {
              return (
                <li
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                >
                  <img src={item.url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto</button>
      </form>
    </div>
  );
};

export default CreatePoint;
