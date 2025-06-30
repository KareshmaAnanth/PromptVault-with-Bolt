import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface AuthFormData {
  email: string
  password: string
  fullName?: string
}

// Creative PromptVault Logo Component
function PromptVaultLogo({ size = 'large' }: { size?: 'small' | 'large' }) {
  const dimensions = size === 'large' ? 'w-10 h-10' : 'w-8 h-8'
  const sparkleSize = size === 'large' ? 'w-2 h-2' : 'w-1.5 h-1.5'
  const smallSparkleSize = size === 'large' ? 'w-1.5 h-1.5' : 'w-1 h-1'
  
  return (
    <div className={`relative ${dimensions}`}>
      {/* Vault/Safe base */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg shadow-lg">
        {/* Vault door */}
        <div className="absolute inset-1 bg-slate-800 rounded-md border border-teal-300/30">
          {/* Central lock mechanism */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`${size === 'large' ? 'w-4 h-4' : 'w-3 h-3'} bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-sm`}>
              {/* Lock center */}
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${size === 'large' ? 'w-1.5 h-1.5' : 'w-1 h-1'} bg-slate-800 rounded-full`}></div>
            </div>
          </div>
          {/* Vault handle */}
          <div className={`absolute ${size === 'large' ? 'top-1.5 right-1 w-1.5 h-3' : 'top-1 right-0.5 w-1 h-2'} bg-gradient-to-b from-slate-400 to-slate-500 rounded-sm`}></div>
        </div>
        {/* Sparkle effects for "smart" prompts */}
        <div className={`absolute -top-0.5 -right-0.5 ${sparkleSize} bg-yellow-400 rounded-full opacity-80 animate-pulse`}></div>
        <div className={`absolute -bottom-0.5 -left-0.5 ${smallSparkleSize} bg-teal-300 rounded-full opacity-60 animate-pulse`} style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  )
}

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const { signIn, signUp } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [cooldown])

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await signUp(data.email, data.password, data.fullName || '')
        if (error) throw error
      } else {
        const { error } = await signIn(data.email, data.password)
        if (error) throw error
      }
    } catch (err) {
      let errorMessage = 'An error occurred'
      
      // Extract the specific error message from Supabase error object
      if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = (err as any).message
        
        // Check for rate limit error and extract cooldown time
        const rateLimitMatch = errorMessage.match(/after (\d+) seconds/)
        if (rateLimitMatch) {
          const seconds = parseInt(rateLimitMatch[1], 10)
          setCooldown(seconds)
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = loading || cooldown > 0

  const getButtonText = () => {
    if (cooldown > 0) {
      return `Please wait ${cooldown}s`
    }
    if (loading) {
      return 'Please wait...'
    }
    return isSignUp ? 'Create Account' : 'Sign In'
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <PromptVaultLogo />
              <h1 className="text-2xl font-bold text-white">PromptVault</h1>
            </div>
            <p className="text-slate-400">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('fullName', { 
                    required: isSignUp ? 'Full name is required' : false 
                  })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="w-full px-4 py-3 pr-12 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {getButtonText()}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-teal-400 hover:text-teal-300 text-sm transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Built with{' '}
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 transition-colors"
            >
              Bolt.new
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}