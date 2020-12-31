export default function signInSuccessWithAuthResult(authResult, redirectUrl) {

    authResult.user.getIdToken().then(function(accessToken) {
    })

    return false;

}
