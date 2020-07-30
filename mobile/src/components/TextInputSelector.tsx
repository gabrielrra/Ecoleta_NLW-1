/* eslint-disable react-native/no-inline-styles */
import React, {Component, createRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ViewStyle,
  FlatList,
} from 'react-native';

import {RectButton} from 'react-native-gesture-handler';

interface CustomProps {
  data: {id: number; value: string}[];
  onChangeText: (text: string) => void;
  placeholder?: string;
  textInputStyle?: ViewStyle;
  maxLength?: number;
  editable?: boolean;
  autoCapitalize?: 'characters' | 'none' | 'sentences' | 'words' | undefined;
}

interface State {
  text: string;
  showOptions: boolean;
}

export default class TextInputSelector extends Component<CustomProps> {
  state: State = {
    text: '',
    showOptions: false,
  };

  textInputRef = createRef<TextInput>();

  render() {
    const {
      onChangeText,
      textInputStyle,
      maxLength,
      data,
      editable,
      placeholder,
      autoCapitalize,
    } = this.props;
    const {text, showOptions} = this.state;
    const ufs = data.filter((item) =>
      item.value.toUpperCase().includes(text.toUpperCase()),
    );
    return (
      <View>
        {showOptions && (
          <View style={styles.modalView}>
            <FlatList
              data={ufs}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              style={{width: '100%'}}
              contentContainerStyle={{
                width: '100%',
              }}
              renderItem={({item}) => (
                <RectButton
                  style={styles.button}
                  onPress={() => {
                    this.textInputRef.current?.clear();
                    this.setState(
                      {text: item.value, showOptions: false},
                      () => {
                        console.log('onPressButton', this.state.text);
                        onChangeText(this.state.text);
                      },
                    );
                    this.textInputRef.current?.blur();
                  }}>
                  <View>
                    <Text>{item.value}</Text>
                  </View>
                </RectButton>
              )}
            />
          </View>
        )}
        <TextInput
          ref={this.textInputRef}
          placeholder={placeholder}
          value={text}
          onChangeText={(value) => {
            onChangeText(value);
            console.log('onChangeText', value);
            this.setState({text: value});
          }}
          style={[styles.input, textInputStyle]}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
          onFocus={() => this.setState({showOptions: true})}
          onBlur={() => this.setState({showOptions: false})}
          editable={editable}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    width: '90%',
    alignSelf: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    paddingVertical: 2,
    alignItems: 'center',
    marginTop: 8,
  },

  modalView: {
    position: 'absolute',
    width: '100%',
    top: 70,
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
