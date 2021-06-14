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

const transaction = (url, tmpData) => {
  return fetch(url, {
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
      return json.data;
    }else{      
      return;
    }
  })
  .catch((error) => {
    console.error(error);
  });
}

export const signin = (data) => {
  const url = 'http://192.168.190.52:3000/auth/login';
  const tmpData = {
    MEMB_IDNT: "01082625642",
    MEMB_PWRD: "1q2w3e4r!!"
  };

  const jsonData = transaction(url, tmpData);
  return jsonData;
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

//export const signup = async ({ name, email, password, photo }) => {
export const signup = async (data, flag) => {
  console.log('data : ' + data);
  console.log('flag : ' + flag);
  // const { user } = await Auth.createUserWithEmailAndPassword(email, password);
  // const photoURL = await uploadImage(photo);
  // await user.updateProfile({ displayName: name, photoURL });
  // console.log('[firebase - signup] user : ' + JSON.stringify(user));
  // return user;
  return;
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