import React, { useState, useRef, useEffect, useContext} from 'react';
import styled from 'styled-components/native';
import {Button, Image, Input, ErrorMessage, Dropdown} from '../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {signup} from '../firebase';
import { Alert } from 'react-native';
import {validateEmail, removeWhitespace} from '../utils';
import {UserContext, ProgressContext} from '../contexts';

const Container = styled.View`
    flex: 1;
    background-color: ${({theme}) => theme.background};
    justify-content: center;
    align-items: center;
    padding: 50px 20px;
`;

const DEFAULT_PHOTO = 'https://firebasestorage.googleapis.com/v0/b/babyrich-94b2d.appspot.com/o/face.png?alt=media';

const Parents = ({navigation}) => {
    const {setUser} = useContext(UserContext);
    const {spinner} = useContext(ProgressContext);

    const [name, setName] = useState('');
    const [nickName, setNickName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');  
    const [famileeCode, setFamileeCode] = useState('');
    const [photo, setPhoto] = useState(DEFAULT_PHOTO);
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);

    const refNickName = useRef(null);
    const refPhone = useRef(null);
    const refFamileeCode = useRef(null);
    const refEmail = useRef(null);
    const refPassword = useRef(null);
    const refPasswordConfirm = useRef(null);
    const refDidMount = useRef(null);

    useEffect(() => {
        setDisabled(
            !(name && nickName&& phone && email && password && passwordConfirm && !errorMessage)
        );
    }, [name, nickName, phone, email, passwordConfirm, password, errorMessage]);
    
    useEffect(() => {
        if (refDidMount.current) {
            let error = '';
            if (!name) {
                error = 'Please enter your name';
            } else if (!nickName) {
                error = 'Please enter your nickName';
            } else if (!phone) {
                error = 'Please enter your phone Number';
            } else if (!email) {
                error = 'Please enter your email';
            } else if (!validateEmail(email)) {
                error = 'Please verify your email';
            } else if (password.length < 6) {
                error = 'The password must contain 6 characters at least';
            } else if (password !== passwordConfirm) {
                error = 'Password need to match';
            } else {
                error = '';
            }
            setErrorMessage(error);
        } else {
            refDidMount.current = true;
        }
    }, [name, nickName, phone, email, password, passwordConfirm]);


    const _handleSignupBtnPress = async () => {
        console.log('disabled : ' + disabled);
        if(!disabled){
            try{
                spinner.start();
                //const user = await signup({name, email, password, photo});
                const user = await signup({name, nickName, phone, email, password, photo}, 'P');
                return;
                setUser(user);
            }catch(e){
                Alert.alert('Signup Error', e.message);
            }finally{
                spinner.stop();
            }
        }
    }


    return(
        <KeyboardAwareScrollView extraHeight={200}>
            <Container>
                <Image showButton={true} url={photo} onChangePhoto={setPhoto} />
                <Input 
                    label="??????" 
                    placeholder="??????" 
                    returnkeyType="next" 
                    value={name} 
                    onChangeText={setName} 
                    onSubmitEditing={() => refNickName.current.focus()}
                    onBlur={() => setName(name.trim())}
                    maxLength={12}                    
                />
                <Input 
                    ref={refNickName}
                    label="?????????" 
                    placeholder="?????????" 
                    returnkeyType="next" 
                    value={nickName} 
                    onChangeText={setNickName} 
                    onSubmitEditing={() => refPhone.current.focus()}
                    onBlur={() => setNickName(nickName.trim())}
                />
                <Input 
                    ref={refPhone}
                    label="??????????????????" 
                    placeholder="??????????????????" 
                    returnkeyType="next" 
                    value={phone} 
                    onChangeText={setPhone} 
                    onSubmitEditing={() => refEmail.current.focus()}
                    onBlur={() => setPhone(phone)}
                />
                <Input 
                    ref={refEmail}
                    label="?????????" 
                    placeholder="?????????" 
                    returnkeyType="next" 
                    value={email} 
                    onChangeText={setEmail} 
                    onSubmitEditing={() => refPassword.current.focus()}
                    onBlur={() => setEmail(removeWhitespace(email))}
                />
                <Input 
                    ref={refPassword}
                    label="????????????" 
                    placeholder="????????????" 
                    returnkeyType="next" 
                    value={password} 
                    onChangeText={setPassword} 
                    isPassword={true}
                    onSubmitEditing={() => refPasswordConfirm.current.focus()}
                    onBlur={() => setPassword(removeWhitespace(password))}
                />
                <Input 
                    ref={refPasswordConfirm}
                    label="???????????? ??????" 
                    placeholder="???????????? ??????" 
                    returnkeyType="done" 
                    value={passwordConfirm} 
                    onChangeText={setPasswordConfirm} 
                    isPassword={true}
                    onSubmitEditing={_handleSignupBtnPress}
                    onBlur={() => setPasswordConfirm(removeWhitespace(passwordConfirm))}
                />
                <Input 
                    label="????????????" 
                    placeholder="?????????????????? (????????????)" 
                    returnkeyType="done" 
                    value={famileeCode}
                    onChangeText={setFamileeCode} 
                    onBlur={() => setFamileeCode(famileeCode)}
                />
                <ErrorMessage message={errorMessage} />
                <Button title="sign up" onPress={_handleSignupBtnPress} disabled={disabled} />            
            </Container>
        </KeyboardAwareScrollView>
    );
}

export default Parents;