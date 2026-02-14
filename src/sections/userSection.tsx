import { useState, useReducer } from "react"

import { UserCircleIcon } from "@heroicons/react/24/outline"

import { useToast } from "../hooks/useToast"
import { modalReducer } from '../reducers/modalReducer'

import type { User } from "../types/others"

import Dropdown from "../components/dropdown/index"
import Modal from "../components/modal/default"
import Input from "../components/input"

import { login as loginRequest } from "../services/user.service"

interface UserSectionProps {
    user: User|null,
    setUser: (user: User) => void
}

export default function UserSection({user, setUser}: UserSectionProps) {

    const [isShowingDropdown, setIsShowingDropdown] = useState(false)
    const [modalState, modalDispatch] = useReducer(modalReducer, { type: null })

    const toast = useToast()

    function saveTokenOnLocalStorage(token: string) {
        window.localStorage.setItem('token', token)
    }

    function removeTokenOnLocalStorage() {
        window.localStorage.removeItem('token')
    }

    async function login() {
        try {
            const user = modalState.data?.user
            const response = await loginRequest(user)
            toast.success('login with success')
            setUser(response.data?.user)
            saveTokenOnLocalStorage(response.data?.token)
            closeModal()
        } catch (error: any) {
            if(error.response?.status < 500 && error.response?.status >= 400) {
                toast.error(error.response?.data.message)
            }
        }
    }

    function logout() {
        toast.success('logout with success')
        removeTokenOnLocalStorage()
        window.location.reload()
    }

    function closeModal() {
        modalDispatch({ type: "hideModal" })
    }

    function openLoginModal() {
        modalDispatch({ type: "login" })
    }

    function openRegisterModal() {
        modalDispatch({ type: "register" })
    }

    return (
        <>
            <div className="relative justify-end flex items-center gap-2 text-xl cursor-pointer p-2" onClick={() => setIsShowingDropdown(!isShowingDropdown)}>
                <h2 className="">hi, {user ? user.username : 'user'}! </h2>
                <UserCircleIcon className='h-12 w-12'></UserCircleIcon>
                {isShowingDropdown &&
                    <div className="absolute top-16">
                        <Dropdown>
                            {!user ?
                                <ul>
                                    <li onClick={openLoginModal}>
                                        login
                                    </li>
                                    <li onClick={openRegisterModal}>
                                        register
                                    </li>
                                </ul>
                                :
                                <ul>
                                    <li onClick={logout}>
                                        logout
                                    </li>
                                </ul>
                            }
                        </Dropdown>
                    </div>
                }
            </div>
            {modalState.type === 'login' && (
                <Modal
                    title={`login`}
                    onClose={closeModal}
                    onConfirm={login}
                    confirmButtonText="login"
                >
                    <Input
                        placeholder="type your username"
                        value={modalState.data?.user?.username}
                        onSubmit={(v) => modalDispatch({ type: 'updateUser', payload: { username: v } })}
                        onChange={(v) => modalDispatch({ type: 'updateUser', payload: { username: v } })}
                    />
                    <Input
                        placeholder="type your password"
                        value={modalState.data?.user?.password}
                        type="password"
                        onSubmit={(v) => modalDispatch({ type: 'updateUser', payload: { password: v } })}
                        onChange={(v) => modalDispatch({ type: 'updateUser', payload: { password: v } })}
                    />
                </Modal>
            )}
            {/* {modalState.type === 'register' && (
                <Modal
                    title={`register`}
                    onClose={closeModal}
                    onConfirm={register}
                    confirmButtonText="register"
                >
                    <p>oi</p>
                </Modal>
            )} */}
        </>
    )
}