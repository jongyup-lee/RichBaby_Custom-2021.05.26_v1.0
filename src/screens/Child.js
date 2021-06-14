import React, { useState, useRef, useEffect, useContext} from 'react';
import styled from 'styled-components/native';
import {Button, Image, Input, ErrorMessage, Dropdown} from '../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {signup} from '../firebase';
import { Alert } from 'react-native';
import {UserContext, ProgressContext} from '../contexts';

const Container = styled.View`
    flex: 1;
    background-color: ${({theme}) => theme.background};
    justify-content: center;
    align-items: center;
    padding: 50px 20px;
`;

const DEFAULT_PHOTO = 'https://firebasestorage.googleapis.com/v0/b/babyrich-94b2d.appspot.com/o/face.png?alt=media';

const Child = ({navigation}) => {
    const {setUser} = useContext(UserContext);
    const {spinner} = useContext(ProgressContext);

    const [name, setName] = useState('');
    const [nickName, setNickName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');  
    const [famileeCode, setFamileeCode] = useState('');
    const [photo, setPhoto] = useState(DEFAULT_PHOTO);
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [rnPicker, setRnPicker] = useState('');

    const refNickName = useRef(null);
    const refFamileeCode = useRef(null);
    const refPassword = useRef(null);
    const refPasswordConfirm = useRef(null);
    const refDidMount = useRef(null);

    useEffect(() => {
        setDisabled(
            !(name && password && passwordConfirm && !errorMessage)
        );
    }, [name, passwordConfirm, password, errorMessage]);    
    
    useEffect(() => {
        if (refDidMount.current) {
            let error = '';
            if (!name) {
                error = 'Please enter your name';
            } else if (!nickName) {
                error = 'Please enter your nickName';
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
    }, [name, nickName, password, passwordConfirm]);

  
    const _handleSignupBtnPress = async () => {
        try{
            spinner.start();
            const user = await signup({name, email, password, photo});
            setUser(user);
        }catch(e){
            Alert.alert('Signup Error', e.message);
        }finally{
            spinner.stop();
        }
    }
  
    return(
      <KeyboardAwareScrollView extraHeight={200}>
          <Container>
              <Image showButton={true} url={photo} onChangePhoto={setPhoto} />
              <Input 
                label="이름" 
                placeholder="이름" 
                returnkeyType="next" 
                value={name} 
                onChangeText={setName} 
                onSubmitEditing={() => refNickName.current.focus()}
                onBlur={() => setName(name.trim())}
                maxLength={12}                    
              />
              <Input 
                ref={refNickName}
                label="닉네임" 
                placeholder="닉네임" 
                returnkeyType="next" 
                value={nickName} 
                onChangeText={setNickName} 
                onSubmitEditing={() => refFamileeCode.current.focus()}
                onBlur={() => setNickName(nickName.trim())}
                maxLength={12}                    
              />
              <Input 
                  ref={refFamileeCode}
                  label="가족코드" 
                  placeholder="가입하신 부모님 핸드폰 번호" 
                  returnkeyType="next" 
                  value={famileeCode}
                  onChangeText={setFamileeCode} 
                  onSubmitEditing={() => refPassword.current.focus()}
                  onBlur={() => setFamileeCode(famileeCode)}
              />
              <Input 
                  ref={refPassword}
                  label="비밀번호" 
                  placeholder="비밀번호" 
                  returnkeyType="next" 
                  value={password} 
                  onChangeText={setPassword} 
                  isPassword={true}
                  onSubmitEditing={() => refPasswordConfirm.current.focus()}
                  onBlur={() => setPassword(removeWhitespace(password))}
              />
              <Input 
                  ref={refPasswordConfirm}
                  label="비밀번호 확인" 
                  placeholder="비밀번호 확인" 
                  returnkeyType="done" 
                  value={passwordConfirm} 
                  onChangeText={setPasswordConfirm} 
                  isPassword={true}
                  onSubmitEditing={_handleSignupBtnPress}
                  onBlur={() => setPasswordConfirm(removeWhitespace(passwordConfirm))}
              />
              <ErrorMessage message={errorMessage} />
              <Button title="sign up" onPress={_handleSignupBtnPress} disabled={disabled} />            
          </Container>
      </KeyboardAwareScrollView>
    );
};

export default Child;