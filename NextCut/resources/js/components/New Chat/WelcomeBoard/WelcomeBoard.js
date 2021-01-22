import React from 'react';
import '../../../../css/WelcomeBoard.css';

export default function WelcomeBoard(props) {

    return (
        <div className="viewWelcomeBoard">
            <span className="textTitleWelcome">
                {`Welcome, ${props.currentUserNickname}`}
            </span>
            <img
                className="avatarWelcome"
                src={props.currentUserAvatar}
                alt="icon avatar"
            />
            <span className="textDesciptionWelcome">
                Let's start talking!
            </span>
        </div>
        )
}
