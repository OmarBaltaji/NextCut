import moment from 'moment'
import React, {useState, useEffect} from 'react';
import 'react-toastify/dist/ReactToastify.css'
import images from '../Themes/Images';
import './ChatBoard.css'
import {AppString} from '../Const';

import firebase from 'firebase';
import config from '../../../Firebase/FirebaseConfig';

import api from '../../../api';
import { useRouteMatch } from 'react-router-dom';


if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
    firebase.app(); // if already initialized
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then(function(registration) {
        console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function(err) {
        console.log("Service worker registration failed, error:", err);
    });
}

const db = firebase.firestore();
db.settings({
 timestampsInSnapshots: true
});

const storage = firebase.storage();

export  default function ChatBoard(props){

    const [userInfo, setUserInfo] = useState('');
    const [isShowSticker, setIsShowSticker] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [listOfMessages, setListOfMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    let currentPeerUser = props.currentPeerUser;
    let groupChatId;
    let removeListener = null;
    let currentPhotoFile = null;
    let messagesEnd= null;
    let refInput = null;

    useEffect(() => {
        api.getUserInfo().then(response => {
            setUserInfo(response.data)
            getListHistory(response.data.id)
        });

        return () => {
            // removeListener();
        };

    }, [props.currentPeerUser, loading]);

    useEffect(() => {
        scrollToBottom();
    });

    function getListHistory(user_id) {
        if (removeListener) {
            // removeListener()
        }
        if (hashString(user_id) <= hashString(currentPeerUser.id)) {
            groupChatId = `${user_id}-${currentPeerUser.id}`;
        } else {
            groupChatId = `${currentPeerUser.id}-${user_id}`;
        }
        let listMessage = [];
        removeListener =
            db.collection('messages')
            .doc(groupChatId)
            .collection(groupChatId)
            .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            listMessage.push(change.doc.data());
                        }
                    })
                    setListOfMessages(listMessage);
                    setLoading(false);
                })
    }

    function openListSticker(){
        setIsShowSticker(!isShowSticker)
    }

    function onSendMessage (content, type){
        if (isShowSticker && type === 2) {
            setIsShowSticker(false)
        }
        if (content.trim() === '') {
            return
        }

        const timestamp = moment().valueOf().toString();

        const itemMessage = {
            idFrom: userInfo.id,
            idTo: currentPeerUser.id,
            timestamp: timestamp,
            content: content.trim(), //to remove whitespace
            type: type
        }

        if (hashString(userInfo.id) <= hashString(currentPeerUser.id)) {
            groupChatId = `${userInfo.id}-${currentPeerUser.id}`;
        } else {
            groupChatId = `${currentPeerUser.id}-${userInfo.id}`;
        }

        db.collection('messages')
        .doc(groupChatId)
        .collection(groupChatId)
        .doc(timestamp)
        .set(itemMessage)
        .then(() => {
            setInputValue('');
            setLoading(false);
        })
        .catch(err => {
        })
    }

    function onChoosePhoto(event){
        if (event.target.files && event.target.files[0]) {
            currentPhotoFile = event.target.files[0]
            // Check if this file is an image
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf('image/') === 0) {
                uploadPhoto()
            }
        }
    }

    function uploadPhoto(){
        if (currentPhotoFile) {
            const timestamp = moment().valueOf().toString();

            const uploadTask = storage
                .ref()
                .child(timestamp)
                .put(currentPhotoFile);

            uploadTask.on(
                'state_changed',
                null,
                err => {
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        onSendMessage(downloadURL, 1);
                    })
                }
            )
        } else {
        }
    }

    function onKeyboardPress(event) {
        if (event.key === 'Enter') {
            onSendMessage(inputValue, 0)
        }
    }

    function scrollToBottom(){
        if (messagesEnd) {
            messagesEnd.scrollIntoView({})
        }
    }

    return (
        <div className="viewChatBoard">
            {/* Header */}
            <div className="headerChatBoard">
                <img
                    className="viewAvatarItem"
                    src={currentPeerUser.profile_photo}
                    alt="icon avatar"
                />
                <span className="textHeaderChatBoard">
                   {currentPeerUser.name}
                </span>
            </div>

            {/* List message */}
            <div className="viewListContentChat">
                {renderListMessage()}
                <div
                    style={{float: 'left', clear: 'both'}}
                    ref={el => {messagesEnd = el}}
                />
            </div>

            {/* Stickers */}
            {isShowSticker ? renderStickers() : null}

            {/* View bottom */}
            <div className="viewBottom">
                <a>
                    <img
                        className="icOpenGallery"
                        src={images.ic_photo}
                        alt="icon open gallery"
                        onClick={() => refInput.click()}
                    />
                </a>
                <input
                    ref={el => {
                        refInput = el
                    }}
                    accept="image/*"
                    className="viewInputGallery"
                    type="file"
                    onChange={onChoosePhoto}
                />
                <a>
                    <img
                        className="icOpenSticker"
                        src={images.ic_sticker}
                        alt="icon open sticker"
                        onClick={openListSticker}
                    />
                </a>

                <input
                    className="viewInput"
                    placeholder="Type your message"
                    value={inputValue}
                    onChange={event => {
                        setInputValue(event.target.value)
                    }}
                    onKeyPress={onKeyboardPress}
                />
                <a>
                    <img
                        className="icSend"
                        src={images.ic_send}
                        alt="icon send"
                        onClick={() => onSendMessage(inputValue, 0)}
                    />
                </a>
            </div>

        </div>
    )

    function renderListMessage(){
        if (listOfMessages.length > 0) { //changed it from listMessages
            let viewListMessage = []
            listOfMessages.forEach((item, index) => {
                if (item.idFrom === userInfo.id) {
                    // Item right (logged in user message)
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className="viewItemRight" key={item.timestamp}>
                                <p className="textContentItem">{item.content}</p>
                                <time>{moment(Number(item.timestamp)).format('lll')}</time>
                            </div>
                        )
                    } else if (item.type === 1) { //if image is sent
                        viewListMessage.push(
                            <div className="viewItemRight2" key={item.timestamp}>
                                <img
                                    className="imgItemRight"
                                    src={item.content}
                                    alt="content message"
                                />
                                <time className="textTimeRight">
                                    {moment(Number(item.timestamp)).format('lll')}
                                </time>
                            </div>

                        )
                    } else {
                        viewListMessage.push( //if gif is sent
                            <div className="viewItemRight3" key={item.timestamp}>
                                <img
                                    className="gifItemRight"
                                    src={getGifImage(item.content)}
                                    alt="content message"
                                />
                                <time className="textTimeRightGif">
                                    {moment(Number(item.timestamp)).format('lll')}
                                </time>
                            </div>
                        )
                    }
                } else {
                    // Item left (peer message)
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    <div className="viewItemLeft">
                                        <p className="textContentItem">{item.content}</p>
                                        <time style={{ float:'left' }}>{moment(Number(item.timestamp)).format('lll')}</time>
                                    </div>
                                </div>
                            </div>
                        )
                    } else if (item.type === 1) { //if image sent
                        viewListMessage.push(
                            <>
                                <div className="viewWrapItemLeft2" key={item.timestamp}>
                                    <div className="viewWrapItemLeft3">
                                        <div className="viewItemLeft2">
                                            <img
                                                className="imgItemLeft"
                                                src={item.content}
                                                alt="content message"
                                            />
                                        </div>

                                    </div>
                                </div>
                                <time className="textTimeLeft">
                                                {moment(Number(item.timestamp)).format('lll')}
                                </time>
                            </>
                        )
                    } else {
                        viewListMessage.push( //if gif sent
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    <div className="viewItemLeft3" key={item.timestamp}>
                                        <img
                                            className="gifItemLeft"
                                            src={getGifImage(item.content)}
                                            alt="content message"
                                        />
                                    </div>
                                </div>
                                <time style={{ float:'left' }} className="textTimeLeftGif">
                                    {moment(Number(item.timestamp)).format('lll')}
                                </time>
                            </div>
                        )
                    }
                }
            })

            return viewListMessage
        } else {
            return (
                <div className="viewWrapSayHi">
                    <span className="textSayHi">Say hi to new friend</span>
                    <img
                        className="imgWaveHand"
                        src={images.ic_wave_hand}
                        alt="wave hand"
                    />
                </div>
            )
        }
    }

    function renderStickers(){
        return (
            <div className="viewStickers">
                <a>
                    <img
                    className="imgSticker"
                    src={images.mimi1}
                    alt="sticker"
                    onClick={() => onSendMessage('mimi1', 2)}
                    />
                </a>
                <a>
                    <img
                    className="imgSticker"
                    src={images.mimi2}
                    alt="sticker"
                    onClick={() => onSendMessage('mimi2', 2)}
                    />
                </a>
                <a>
                    <img
                    className="imgSticker"
                    src={images.mimi3}
                    alt="sticker"
                    onClick={() => onSendMessage('mimi3', 2)}
                    />
                </a>
                <a>
                    <img
                    className="imgSticker"
                    src={images.mimi4}
                    alt="sticker"
                    onClick={() => onSendMessage('mimi4', 2)}
                    />
                </a>
                <a>
                    <img
                    className="imgSticker"
                    src={images.mimi5}
                    alt="sticker"
                    onClick={() => onSendMessage('mimi5', 2)}
                    />
                </a>
                <a>
                    <img
                    className="imgSticker"
                    src={images.mimi6}
                    alt="sticker"
                    onClick={() => onSendMessage('mimi6', 2)}
                    />
                </a>
                <a>
                    <img
                    className="imgSticker"
                    src={images.mimi7}
                    alt="sticker"
                    onClick={() => onSendMessage('mimi7', 2)}
                    />
                </a>
                <a>
                    <img
                    className="imgSticker"
                    src={images.mimi8}
                    alt="sticker"
                    onClick={() => onSendMessage('mimi8', 2)}
                    />
                </a>
                <a>
                    <img
                    className="imgSticker"
                    src={images.mimi9}
                    alt="sticker"
                    onClick={() => onSendMessage('mimi9', 2)}
                    />
                </a>
            </div>
        )
    }

    function hashString(str){ //to have a hashed name for our document in firestore
        let hash = 0
        str = String(str);
        for (let i = 0; i < str.length; i++) {
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
            hash = hash & hash // Convert to 32bit integer
        }
        return hash
    }

    function getGifImage(value) {
        switch (value) {
            case 'mimi1':
                return images.mimi1
            case 'mimi2':
                return images.mimi2
            case 'mimi3':
                return images.mimi3
            case 'mimi4':
                return images.mimi4
            case 'mimi5':
                return images.mimi5
            case 'mimi6':
                return images.mimi6
            case 'mimi7':
                return images.mimi7
            case 'mimi8':
                return images.mimi8
            case 'mimi9':
                return images.mimi9
            default:
                return null
        }
    }
}
