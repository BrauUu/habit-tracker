import { useState, useReducer } from "react"

import { UserCircleIcon } from "@heroicons/react/24/outline"

import { useToast } from "../hooks/useToast"
import { modalReducer } from '../reducers/modalReducer'

import type { User } from "../types/others"
import type { HabitsList } from "../types/habit"

import Dropdown from "../components/dropdown/index"
import Modal from "../components/modal/default"
import Input from "../components/input"

import { login as loginRequest, register as registerRequest, synchronizeHabits as synchronizeHabitsRequest } from "../services/user.service"
import Button from "../components/button"

interface UserSectionProps {
    user: User | null,
    setUser: (user: User) => void,
    onSynchronizeHabits: (habits: HabitsList) => Promise<void>
    onAuthenticate: () => Promise<void>
}

export default function UserSection({ user, setUser, onSynchronizeHabits, onAuthenticate }: UserSectionProps) {

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
            if (response.status === 200) {
                toast.success('login with success')
                setUser(response.data?.user)
                saveTokenOnLocalStorage(response.data?.token)
                await onAuthenticate()
            }
            closeModal()
            verifyUnsynchronizedHabits()
        } catch (error: any) {
            if (error.response?.status < 500 && error.response?.status >= 400) {
                toast.error(error.response?.data.message)
            }
        }
    }

    async function register() {
        try {
            const user = modalState.data?.user

            if (user.password !== user.password_confirmation) {
                toast.error('passwords should be equal')
                return
            }

            const response = await registerRequest(user)
            if (response.status === 201) {
                toast.success('registered with success')
                setUser(response.data?.user)
                saveTokenOnLocalStorage(response.data?.token)
                await onAuthenticate()
            }
            closeModal()
            if (!verifyUnsynchronizedHabits()) {
                removeDataFromLocalStorage()
            }
        } catch (error: any) {
            if (error.response?.status < 500 && error.response?.status >= 400) {
                toast.error(error.response?.data.message)
            }
        }
    }

    function verifyUnsynchronizedHabits() {
        const localData = localStorage.getItem('habitsList')
        if (localData) {
            const localHabitsList: HabitsList = JSON.parse(localData)
            if (localHabitsList.dailyHabits.length > 0 || localHabitsList.incrementalHabits.length > 0 || localHabitsList.todos.length > 0) {
                modalDispatch({ type: "syncHabits", payload: localHabitsList })
                return true
            }
        }
        return false
    }

    async function synchronizeHabits() {
        try {
            const habits = modalState.data?.habits
            const response = await synchronizeHabitsRequest(habits)
            if (response.status === 201) {
                toast.success('habits synchronized successfully')

                const syncedHabits = {
                    dailyHabits: response.data.dailies,
                    incrementalHabits: response.data.incrementals,
                    todos: response.data.todos
                }

                await onSynchronizeHabits(syncedHabits)
            }
            removeDataFromLocalStorage()
            closeModal()
        } catch (error: any) {
            if (error.response?.status < 500 && error.response?.status >= 400) {
                toast.error(error.response?.data.message)
            }
        }
    }

    async function removeDataFromLocalStorage() {
        localStorage.removeItem('habitsList')
        localStorage.removeItem('lastDailyResetDate')
        closeModal()
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
            <div className="relative justify-end flex items-center gap-2 text-xl cursor-pointer p-2 h-12">
                {user ?
                    <div className="flex gap-2 items-center" onClick={() => setIsShowingDropdown(!isShowingDropdown)}>
                        <h2 className="">hi, {user ? user.username : 'user'}! </h2>
                        <UserCircleIcon className='h-12 w-12'></UserCircleIcon>
                        {isShowingDropdown &&
                            <div className="absolute top-12 right-0">
                                <Dropdown>
                                    <ul>
                                        <li onClick={logout}>
                                            logout
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        }
                    </div>
                    :
                    <div className="flex gap-2 items-center">
                        <Button type="secondary" action={openRegisterModal} key={'register'} text="register"></Button>
                        <Button type="primary" action={openLoginModal} key={'login'} text="login" style=""></Button>
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
                        style="pr-8"
                        value={modalState.data?.user?.password}
                        type="password"
                        onSubmit={(v) => modalDispatch({ type: 'updateUser', payload: { password: v } })}
                        onChange={(v) => modalDispatch({ type: 'updateUser', payload: { password: v } })}
                    />
                </Modal>
            )}
            {modalState.type === 'register' && (
                <Modal
                    title={`register`}
                    onClose={closeModal}
                    onConfirm={register}
                    confirmButtonText="register"
                >
                    <Input
                        placeholder="type your username"
                        value={modalState.data?.user?.username}
                        onSubmit={(v) => modalDispatch({ type: 'updateUser', payload: { username: v } })}
                        onChange={(v) => modalDispatch({ type: 'updateUser', payload: { username: v } })}
                    />
                    <Input
                        placeholder="type your password"
                        style="pr-8"
                        value={modalState.data?.user?.password}
                        type="password"
                        onSubmit={(v) => modalDispatch({ type: 'updateUser', payload: { password: v } })}
                        onChange={(v) => modalDispatch({ type: 'updateUser', payload: { password: v } })}
                    />
                    <Input
                        placeholder="confirm your password"
                        style="pr-8"
                        value={modalState.data?.user?.password_confirmation}
                        type="password"
                        onSubmit={(v) => modalDispatch({ type: 'updateUser', payload: { password_confirmation: v } })}
                        onChange={(v) => modalDispatch({ type: 'updateUser', payload: { password_confirmation: v } })}
                    />
                </Modal>
            )}
            {modalState.type === 'syncHabits' && (
                <Modal
                    title={`synchronize habits`}
                    onClose={removeDataFromLocalStorage}
                    onConfirm={synchronizeHabits}
                    confirmButtonText="save"
                    cancelButtonText="discard"
                >
                    <p>
                        we found habits saved on this device. would you like to keep them by saving in your account?
                        <b>regardless of your choice, local data will be removed from this device.</b>
                    </p>
                </Modal>
            )}
        </>
    )
}