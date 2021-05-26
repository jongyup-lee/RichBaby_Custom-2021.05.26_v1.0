import * as firebase from 'firebase';
import config from '../firebase.json';
import 'firebase/firestore'

const app = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
//const app = firebase.initializeApp(config);

const Auth = app.auth();

  /* **********************************************
  /* firebase의 Auth를 이용한 로그인 방식
  /************************************************* */

  // export const signin = async ({email, password}) => {
  //     const {user} = await Auth.signInWithEmailAndPassword(email, password);
  //     return user;
  // };


  /* **********************************************
  /* 자체 DataBase 를 이용한 로그인 방식
  /************************************************* */

export const signin = (data) => {
  console.log("위치 1");
  const tmpData = {
    MEMB_IDNT: "01082625642",
    MEMB_PWRD: "1q2w3e4r!!"
  };
  
  //const getMoviesFromApi = () => {
    console.log('1번');
    return fetch('http://192.168.190.52:3000/auth/login', {
      method: 'POST',
      body: JSON.stringify(tmpData),
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if(json.status == 'success'){
          console.log('2번');
          return json.data;
        }else{
          console.log('3번 : ' + json.message);
          return;
        }
      })
      .catch((error) => {
        console.error(error);
      });
      console.log('4번');
  //};
  //console.log('5번');

  //return getMoviesFromApi();

  /*
  fetch('http://192.168.0.18:3000/auth/login', {
    method: 'POST',
    body: JSON.stringify(this.state),
    headers: {
      //Header Defination
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  })
  .then((response) => response.json())
  .then((responseJson) => {
    console.log("위치 2");
    //Hide Loader
    //setLoading(false);
    // If server response message same as Data Matched
    if (responseJson.status == 'success') {
      console.log("위치 3");
      //AsyncStorage.setItem('user_id', responseJson.data.stu_id);
      //navigation.replace('DrawerNavigationRoutes');
      const user = {
        "user" : responseJson
      };

      const {user1} = responseJson

      console.log('[firebase.js] signin - success (user) : ' + JSON.stringify(user));
      console.log('[firebase.js] signin - success (user1) : ' + JSON.stringify(user1));
      return user.data;

    } else {
        console.log("위치 4");
        //setErrortext('아이디와 비밀번호를 다시 확인해주세요');
        console.log('Please check your id or password');
        return;
      }
    })
    .catch((error) => {
      //Hide Loader
      //setLoading(false);
      console.error(error);
      return;
    });
    console.log("위치 5");
    */
};

const uploadImage = async uri => {
  if (uri.startsWith('https')) {
    return uri;
  }

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const user = Auth.currentUser;
  // 회원 관리 정책이 firebase에서 자체 DB로 변경 되면서 user.uid는 사용불가...
  // 포토 정보는 조금 더 분석 및 설계가 필요함.
  const ref = app.storage().ref(`/profile/${user.uid}/photo.png`);
  const snapshot = await ref.put(blob, { contentType: 'image/png' });
  blob.close();

  return await snapshot.ref.getDownloadURL();
};

export const signup = async ({ name, email, password, photo }) => {
  const { user } = await Auth.createUserWithEmailAndPassword(email, password);
  const photoURL = await uploadImage(photo);
  await user.updateProfile({ displayName: name, photoURL });
  console.log('[firebase - signup] user : ' + JSON.stringify(user));
  return user;
};

export const getCurrentUser = () => {
  const { uid, displayName, email, photoURL } = Auth.currentUser;
  return { uid, name: displayName, email, photo: photoURL };
};

export const updateUserInfo = async photo => {
  const photoURL = await uploadImage(photo); 
  Auth.currentUser.updateProfile({ photoURL });
  return photoURL;
};

export const DB = firebase.firestore();

export const createChannel = async ({title, desc}) => {
  const newChannelRef = DB.collection('channels').doc();
  const id = newChannelRef.id;
  const newChannel = {
    id,
    title,
    description: desc,
    createdAt: Date.now(),
  };
  await newChannelRef.set(newChannel);
  return id;
};

export const createMessage = async ({channelId, message}) => {
  return await DB.collection('channels')
    .doc(channelId)
    .collection('messages')
    .doc(message._id)
    .set({
      ...message,
      createdAt: Date.now()
    })
}