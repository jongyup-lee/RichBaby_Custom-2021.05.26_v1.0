import React from 'react';
import styled from 'styled-components/native';
import RadioForm from 'react-native-simple-radio-button';

const Container = styled.View`
    flex-direction: column;
    width: 100%;
    margin: 10px 0;
`;

const radio_props = [
    {label: 'param1', value: 0 },
    {label: 'param2', value: 1 }
];

const Radio = (value) => {
    const [isRfocused, setIsRfocused] = setState('')
    return (
        <Container>
            <RadioForm
                radio_props={radio_props}
                initial={0}
                onPress={(value) => {this.setState({value:value})}}
            />
        </Container>
    );
}

export default Radio;