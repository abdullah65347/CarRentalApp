import React, { useState, useContext } from 'react'
import api from '../../api/apiClient'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    async function submit(e) {
        e.preventDefault()
        try {
            const res = await api.post('/auth/login', { email, password })
            const token = res.data.accessToken || res.data.token
            login(token)
            navigate('/')
        } catch (err) {
            alert('Login failed')
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-semibold mb-4">Login</h1>
            <form onSubmit={submit}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full mb-3 p-2 border rounded" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full mb-3 p-2 border rounded" />
                <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
            </form>
        </div>
    )
}