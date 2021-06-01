import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const Container = styled.View`
    flex-direction: column;
    width: 100%;
    margin: 10px 0;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #9EA0A4;
`;

const Dropdown = ({selTitle, items, onValueChange, value}) => {
  const placeholder = {
    label: '회원구분을 선택하세요',
    value: null,
    color: '#9EA0A4',
  };



  return (
    <Container>
      <Label>{selTitle}</Label>
      <RNPickerSelect
          placeholder = {placeholder}
          items={items}      
          onValueChange={onValueChange}
          value={value}
          style={{
            inputIOS: {
              fontSize: 16,
              paddingVertical: 12,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 4,
              color: 'black',
              paddingRight: 30, // to ensure the text is never behind the icon
            },
            inputAndroid: {
              fontSize: 16,
              paddingHorizontal: 10,
              paddingVertical: 12,
              border: 1,
              borderWidth: 1,
              borderColor: 'red',
              borderRadius: 5,
              color: 'black',
              paddingRight: 30, // to ensure the text is never behind the icon
            },
          }}
      />      
    </Container>
  );
};

Dropdown.propTypes = {
  selTitle: PropTypes.string.isRequired,
  items: PropTypes.array,
  onValueChange: PropTypes.func,
  value: PropTypes.any,
};

export default Dropdown;