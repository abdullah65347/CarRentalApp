import React, { useState } from 'react'
import api from '../../api/apiClient'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    async function submit(e) {
        e.preventDefault()
        try {
            await api.post('/auth/register', { name, email, password })
            navigate('/auth/login')
        } catch (err) {
            alert('Registration failed')
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-semibold mb-4">Register</h1>
            <form onSubmit={submit}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full mb-3 p-2 border rounded" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full mb-3 p-2 border rounded" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full mb-3 p-2 border rounded" />
                <button className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
            </form>
        </div>
    )
}