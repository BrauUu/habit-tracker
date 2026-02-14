import axios, { AxiosError } from "axios";


const env = import.meta.env

export const api = axios.create({
  baseURL: env.VITE_API_URL
})

const publicRoutes = ['/login', '/register']

api.interceptors.request.use(
  (config) => {
     const isPublicRoute = publicRoutes.some(route => 
      config.url?.includes(route)
    )
    if (!isPublicRoute) {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token')
          break
        case 404:
          console.error('Recurso não encontrado')
          break
        case 500:
          console.error('Erro no servidor')
          break
      }
    } else if (error.request) {
      console.error('Sem resposta do servidor')
    } else {
      console.error('Erro na requisição:', error.message)
    }

    return Promise.reject(error)
  }
)