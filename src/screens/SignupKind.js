import React, {useContext, useState, useRef, useEffect} from 'react';
import {ThemeContext} from 'styled-components/native'
import styled from 'styled-components/native';
import {Button, RacButton, Image, Input, ErrorMessage} from '../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {signin} from '../firebase';
import { Alert } from 'react-native';
import {validateEmail, removeWhitespace} from '../utils';
import {UserContext, ProgressContext} from '../contexts';
import Spinner from '../components';

const Container = styled.View`
    flex: 1;
    flex-direction: row;
    background-color: ${({theme}) => theme.background};
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    padding-top: ${({insets: {top}}) => top}px;
    padding-bottom: ${({insets: {bottom}}) => bottom}px;
`;

const SignupKind = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const theme = useContext(ThemeContext);
    const {setUser} = useContext(UserContext);
    const {spinner} = useContext(ProgressContext);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);

    const refPassword = useRef(null);

    return(
        <KeyboardAwareScrollView extraHeight={200} contentContainerStyle={{flex: 1}}>
            <Container insets={insets}>
                <RacButton title="부모회원 가입" 
                    onPress={ () => navigation.navigate('Signup') }
                />
                <RacButton 
                    title="자녀회원 가입" 
                    onPress={ () => navigation.navigate('Signup') }
                />
            </Container>
        </KeyboardAwareScrollView>
    );
};

export default SignupKind;