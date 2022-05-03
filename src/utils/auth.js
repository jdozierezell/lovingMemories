
import axios from 'axios';

/* Check if call is made from a browser window */
const isBrowser = typeof window !== `undefined`

/* Application Base Url */
const baseURL = "https://afsp-loving-memories.herokuapp.com/api/"
export const baseImageURL = "https://afsp-loving-memories.herokuapp.com/"



/* Getter and Setter for User */

const getUser = () =>
    window.localStorage.userData
        ? JSON.parse(window.localStorage.userData)
        : {}

const setUser = user => (window.localStorage.userData = JSON.stringify(user))
const setUserID = user => (window.localStorage.userData = JSON.stringify(user))

export const handleAPIPostPublic = async (method, details, handleSuccess, handleErrors) => {


    let headers= {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    if (!isBrowser) return false;

    await fetch(baseURL+method, {
        method:'POST',
        mode:'cors',
        headers:headers,
        body:JSON.stringify(details)
    })
        .then(res => {
            if(!res.ok) {
                res.json().then(text => {
                    handleErrors(text);
                })
            }
            return res.json();
        })
        .then(data => {
            handleSuccess(data)
        })
        .catch((error) => {

        });

    return false;
}

/* Global API CALL Method */
export const handleAPIPost = async (method, details, user, handleSuccess, handleErrors) => {

    let headers;

    /* set token in here */
    if(user.token) {
        headers= {
            'Accept': 'application/json',
            'Content-Type':'application/json',
            'Authorization': `Bearer ${user.token}`,
        };
    }
    else {
        headers= {
            'Accept': 'application/json',
            'Content-Type':'application/json',
        };
    }

    if (!isBrowser) return false;

       await fetch(baseURL+method, {
        method:'POST',
        mode:'cors',
        headers:headers,
        body:JSON.stringify(details)
    })
        .then(res => {
            //console.log(res);
            //console.log(res.ok);
            let response= res.json();
            if(res.ok===false) {
                response.then(text => {
                    //console.log("error");
                    handleErrors(text);
                })
            }
            else
            {
                response.then(text => {
                    //console.log("success");
                    handleSuccess(text);
                })
            }

        })

        .catch((error) => {
            //console.log(error);
        });   

    return false;
}

/* Global API CALL Method */
export const handleAPIFetch = async (method, handleSuccess, handleErrors) => {


    let headers= {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    if (!isBrowser) return false;

    await fetch(baseURL+method, {
        method:'POST',
        mode:'cors',
        headers:headers,
    })
        .then(res => {
            if(!res.ok) {
                res.json().then(text => {
                    handleErrors(text);
                })
            }
            return res.json();
        })
        .then(data => {
            handleSuccess(data)
        })
        .catch((error) => {

        });

    return false;
}

export const handleAPIGet = async (method, handleSuccess, handleErrors, handleErrorCode) => {


    let headers= {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    if (!isBrowser) return false;

    await fetch(baseURL+method, {
        method:'GET',
        mode:'cors',
        headers:headers,
    })
        .then(res => {
            if(!res.ok) {
                res.json().then(text => {
                    ////console.log(res)
                    handleErrors(text, res);
                })
            }
            return res.json();
        })
        .then(data => {
            handleSuccess(data)
        })
        .catch((error) => {

        });

    return false;
}
/* Get Current User Details */
/*
  eg.
  const { token } = getCurrentUser();
  //console.log(token);
*/
export const getCurrentUser = () => isBrowser && getUser()

/*
  SetCurrent user details as an obj
  eg.
  setCurrentUser({
      token:data.token
    })
*/
export const setCurrentUser = (val) => {
    setUser(val)
}
/*
  SetCurrent user details as an obj
  eg.
  setCurrentUser({
      user_id:data.user_id
    })
*/
export const setCurrentUserName = (val) => {
    setUserID(val)
}

/*
  Check if the user is Logged in by checking if session token exists
*/
export const isLoggedIn = () => {
    if (!isBrowser) return false

    const user = getUser()

    return !!user.token
}

/*git
  Get Current user session token
*/
export const getSessionToken = () => {
    if (!isBrowser) return false

    const user = getUser()

    return user.token
}

/*
  Logout Current User
*/
export const logout = callback => {

    if (!isBrowser) return
    //setUser({})
    window.localStorage.clear();
    
    callback()
}


/*
  isUser details empty
*/
export const userCheck = user => {

    return JSON.stringify(user) !== '{}';
}
