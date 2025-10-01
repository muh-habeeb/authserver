import { useState } from "react"
import { useAuthStore } from "../store/AuthStore.js";
import { motion } from "framer-motion"
import { Mail, Lock, Loader, } from "lucide-react"
import Input from "../components/input";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const SignIn = () => {
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  //to manage the input fileds
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [formData, setFormData] = useState({
    email: "",
    password: ""

  })

  // generic change handler
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(formData.email, formData.password);
      toast.success("Login successful!");
      navigate("/")
    }
    catch (error) {
      toast.error(error?.response?.data?.message)
      // console.log("errorroor:", error?.response?.data?.message || error.message);

    }
  }


  return (
    <motion.div

      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800/50  backdrop-filter backdrop-blur-xl rounded-2xl shadow-gray-800 shadow-xl  overflow-hidden"
    >
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
          Welcome Back
        </h2>

        <form onSubmit={handleLogin}>
          {[
            {
              name: "email",
              type: "text",
              placeholder: "Email",
              icon: Mail,
            },
            {
              name: "password",
              type: "password",
              placeholder: "Password",
              icon: Lock,
            },
          ].map(({ name, type, placeholder, icon }) => (
            <Input
              key={name}
              icon={icon}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleInputChange}
              autoComplete="off"
              autoCorrect="off"
            />
          ))}
          <div className='flex items-center mb-6'>
            <Link to='/forgot-password' className='text-sm text-green-400 hover:underline'>
              Forgot password?
            </Link>
          </div>

          {/*  show error */}

          {/* {error && <p className='text-red-500 font-semibold mb-2 capitalize'>{error}</p>} */}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? <Loader className='w-6 h-6 animate-spin  mx-auto' /> : "Login"}
          </motion.button>
        </form>
      </div>
      <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
        <p className='text-sm text-gray-400'>
          Don't have an account?{" "}
          <Link to='/signup' className='text-green-400 hover:underline'>
            Sign up
          </Link>
        </p>
      </div>
    </motion.div >
  )
}

export default SignIn