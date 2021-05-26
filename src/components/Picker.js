import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {Picker} from '@react-native-picker/picker';

const Container = styled.View`
    flex-direction: column;
    width: 100%;
    margin: 10px 0;
`;



const Picker = () => {
  const [selectedValue, setSelectedValue] = useState("java");
  return (
    <Container>
      <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="선택" value="" />
        <Picker.Item label="부모회원" value="PRNT" />
        <Picker.Item label="자녀회원" value="CHLD" />
      </Picker>
    </Container>
  );
}

export default Picker;