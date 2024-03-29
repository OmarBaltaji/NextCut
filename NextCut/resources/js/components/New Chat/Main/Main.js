import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import WelcomeBoard from '../WelcomeBoard/WelcomeBoard';
import '../../../../css/Main.css';
import ChatBoard from '../ChatBoard/ChatBoard';
import Header from '../../Header';

import api from '../../../api';

export  default function Main(){
    const history = useHistory();
    const [currentPeerUser, setCurrentPeerUser] =  useState([]);
    const [userInfo, setUserInfo] =  useState([]);
    const [listUser, setListUser ]=   useState([]);
    const role = localStorage.getItem('role');

    useEffect(() => {
        getAuthInfo();
        if(role) { // If not signed in do not show the list of users
            getListUser();
        }
    },[]);

    function getAuthInfo() {
        api.getUserInfo()
        .then(response => {
            setUserInfo(response.data);
        }).catch(error => {
            if(error.response.status == 401) {
                history.push('/home');
            }
        })
    }

   function  getListUser() { // Get list of all users
        api.getUsers()
        .then(response => {
            setListUser(response.data);
        })
    }

    //Only customers can chat to barbers and vice versa

    function renderListCustomer (){ // Render this list for barbers
        return listUser.map(user => {
            return(
                <i  key={user.id}>
                {user.id !== userInfo.id && user.roles == "Customer" ?
                    <button
                    style={{ backgroundColor:'beige' }}
                    key={user.id}
                    className={
                    currentPeerUser &&
                    currentPeerUser.id === user.id
                    ? 'viewWrapItemFocused'
                    : 'viewWrapItem'}
                    onClick={() => {setCurrentPeerUser(user)}} >
                        <img
                            className="viewAvatarItem"
                            src={user.profile_photo}
                            alt="icon avatar"
                        />
                        <div className="viewWrapContentItem">
                            <span className="textItem">
                                {`${user.name}`}
                            </span>
                        </div>
                    </button>
                    : '' }
            </i>
            )
        })
    }

    function renderListBarber() { // Render this list for customers
        return listUser.map(user => {
            return(
                <i  key={user.id}>
                    {user.id !== userInfo.id && user.roles == "Barber" ?
                        <button
                        style={{ backgroundColor:'beige' }}
                        key={user.id}
                        className={
                        currentPeerUser &&
                        currentPeerUser.id === user.id
                        ? 'viewWrapItemFocused'
                        : 'viewWrapItem'}
                        onClick={() => {setCurrentPeerUser(user)}} >
                            <img
                                className="viewAvatarItem"
                                src={user.profile_photo}
                                alt="icon avatar"
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    {`${user.name}`}
                                </span>
                            </div>
                        </button>
                    : '' }
                </i>
            )
        })
    }

    return (
        <>
            <Header />
            <div className="root_chat">
                <div className="body_chat">
                    <div className="viewListUser">
                        {listUser.length > 0 ? (role == 'Barber' ? renderListCustomer() : renderListBarber()) : ''}
                    </div>
                    <div className="viewBoard">
                        {currentPeerUser.length != 0 ? (
                            <ChatBoard currentPeerUser={currentPeerUser} />
                        ) : (
                            <WelcomeBoard
                                currentUserNickname={userInfo.name}
                                currentUserAvatar={userInfo.profile_photo} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
