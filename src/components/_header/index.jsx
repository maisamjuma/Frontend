import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../../contexts/authContext'
import {doSignOut} from '../../firebase/auth'

const Header = () => {
    const navigate = useNavigate()
    const {userLoggedIn} = useAuth()
    return (
        <nav
            className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200'>
            {/*
                        we cannot display these three buttons or links all together (to log out, to login, and to register a new account)
                        the log out button should only be visible if the user is logged in
                        otherwise the login and register new account buttons should be visible
                        */}
            {

                userLoggedIn //to check if user logged in, so then we decide which buttons we need to display
                    ?
                    <>
                        <button onClick={
                            () => {
                                doSignOut().then(() => {
                                    navigate('/login')
                                })
                            }
                        }
                                className='text-sm text-blue-600 underline'>
                            Logout
                        </button>
                    </>
                    :
                    <>

                        <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
                        <Link className='text-sm text-blue-600 underline' to={'/register'}>Register New Account</Link>
                    </>
            }

        </nav>
    )
}

export default Header