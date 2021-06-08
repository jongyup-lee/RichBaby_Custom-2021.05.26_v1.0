import React, {useContext, useState, useRef} from 'react';
import {ThemeContext} from 'styled-components/native'
import styled from 'styled-components/native';
import {RacButton} from '../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {UserContext, ProgressContext} from '../contexts';

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

const MemberShip = ({navigation}) => {
    const insets = useSafeAreaInsets();
    return(
        <KeyboardAwareScrollView extraHeight={200} contentContainerStyle={{flex: 1}}>
            <Container insets={insets}>
                <RacButton title="부모회원 가입" 
                    onPress={ () => navigation.navigate('SignupP') }
                />
                <RacButton 
                    title="자녀회원 가입" 
                    onPress={ () => navigation.navigate('SignupC') }
                />
            </Container>
        </KeyboardAwareScrollView>
    );
};

export default MemberShip;