import React, {useContext, useState, useRef, useEffect} from 'react';
import {ThemeContext} from 'styled-components/native'
import styled from 'styled-components/native';
import {Button, Image, Input, ErrorMessage} from '../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {signin} from '../firebase';
import { Alert } from 'react-native';
import {validateEmail, removeWhitespace} from '../utils';
import {UserContext, ProgressContext} from '../contexts';
import Spinner from '../components';

const Container = styled.View`
    flex: 1;
    background-color: ${({theme}) => theme.background};
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    padding-top: ${({insets: {top}}) => top}px;
    padding-bottom: ${({insets: {bottom}}) => bottom}px;
`;

const LOGO='https://firebasestorage.googleapis.com/v0/b/babyrich-94b2d.appspot.com/o/icon.png?alt=media';

const Signin = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const theme = useContext(ThemeContext);
    const {setUser} = useContext(UserContext);
    const {spinner} = useContext(ProgressContext);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);

    const refPassword = useRef(null);

    useEffect(() => {
        setDisabled(!(!errorMessage))
    }, [errorMessage])


    const _handleEmailChange = email => {
        const changeEmail = removeWhitespace(email);
        setEmail(changeEmail);
        setErrorMessage(
            validateEmail(changeEmail) ? '' : 'Please verify your email'
        );
    };
    
    const _handlePasswordChange = (password) => {
        const changePassword = removeWhitespace(password);
        setPassword(changePassword);
    }

    const _handleSigninBtnPress = async () => {
        ///console.log('sign in');
        try{
            spinner.start();
            const user = await signin();
            if(user === undefined || user === ''){
                console.log('[Signin.js] - user Not found');                         
                Alert.alert('Signin Error', '로그인 정보가 없습니다. 아이디 및 패스워드를 확인하세요.');
            }else{
                setUser(user);            
                console.log('[Signin.js] - _handleSigninBtnPress >> setUser 이후 : ' + user + ' / ' + JSON.stringify(user)); 
            }
        }catch(e){
            Alert.alert('Signin Error', e.message);
        }finally{
            spinner.stop();
        }
    }

    return(
        <KeyboardAwareScrollView extraHeight={200} contentContainerStyle={{flex: 1}}>
            <Container insets={insets}>
                <Image url={LOGO} />
                <Input 
                    label="Email" 
                    placeholder="Email" 
                    returnkeyType="next" 
                    value={email} 
                    onChangeText={_handleEmailChange} 
                    onSubmitEditing={() => refPassword.current.focus()}
                />
                <Input 
                    ref={refPassword}
                    label="Password" 
                    placeholder="Password" 
                    returnkeyType="done" 
                    value={password} 
                    onChangeText={_handlePasswordChange} 
                    isPassword={true}
                    onSubmitEditing={_handleSigninBtnPress}
                />
                <ErrorMessage message={errorMessage} />
                <Button title="sign in" onPress={_handleSigninBtnPress} disabled={disabled} />
                <Button 
                    title="or sign up" 
                    onPress={ () => navigation.navigate('MemberShip') }
                    containerStyle={{marginTop:0, backgroundColor:'transparent'}}
                    textStyle={{color: theme.btnTextLink, fontSize: 18}}
                />
            </Container>
        </KeyboardAwareScrollView>
    );
};

export default Signin;