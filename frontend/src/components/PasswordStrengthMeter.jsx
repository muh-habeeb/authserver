import { Check, X } from 'lucide-react'
import React from 'react'


const PasswordRules = ({ password }) => {

  const rules = [
    { label: "At least 6 character ", met: password.length >= 6 },
    { label: "Contains uppercase letter ", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter ", met: /[a-z]/.test(password) },
    { label: "Contains a number  ", met: /\d/.test(password) },
    { label: "Contains a special character ", met: /[^A-Za-z0-9]/.test(password) },
  ]
  return (
    <div className="mt-2 space-y-1">
      {rules.map((item, key) => (
        <div className="flex item-center text-sm" key={key}>
          {item.met ? (
            <Check className=' size-4 text-green-500 mr-2' />
          ) : (

            <X className=' size-4 text-gray-500 mr-2' />
          )}
          <span className={item.met ? "text-green-500" : `text-gray-500`}   >{item.label}</span>
        </div>
      ))}

    </div>
  )
}
const PasswordStrengthMeter = ({ password }) => {

  const getStrength = (password) => {
    let strength = 0
    if (password.length >= 6) strength++;
    if (password.match(/[A-Z]/) && password.match(/[a-z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^A-Za-z\d]/)) strength++;
    return strength
  }

  const getColor = (strength) => {
    if (strength === 0) return "bg-red-500"
    if (strength === 1) return "bg-red-400"
    if (strength === 2) return "bg-yellow-500"
    if (strength === 3) return "bg-yellow-400"
    return "bg-green-5000"
  }

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak"
    if (strength === 1) return " Weak"
    if (strength === 2) return " Fair"
    if (strength === 3) return "Good"
    return "Strong"
  }

  const strength = getStrength(password)
  return (
    <div className="mt-2" >
      <div className="flex justify-between items-center mb-1">
        <span className='text-sm text-gray-500 '>Password strength</span>
        <span className='text-sm text-gray-500 '>{getStrengthText(strength)}</span>
      </div>

      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div className={`h-1 w-1/4 rounded-full  transition-colors duration-300 ${index < strength ? getColor(strength) : "bg-gray-600"}`} key={index} ></div>
        ))}
      </div>


      <PasswordRules password={password} />
    </div >
  )
}

export default PasswordStrengthMeter




// import { Check, X } from 'lucide-react';
// import React from 'react';

// const PasswordRules = ({ password }) => {
//   const rules = [
//     { label: "At least 6 characters", met: password.length >= 6 },
//     { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
//     { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
//     { label: "Contains a number", met: /\d/.test(password) },
//     { label: "Contains a special character", met: /[^A-Za-z0-9]/.test(password) },
//   ];
//   return (
//     <div className="mt-2 space-y-1">
//       {rules.map((item, key) => (
//         <div className="flex items-center text-sm" key={key}>
//           {item.met ? (
//             <Check className="size-4 text-green-500 mr-2" />
//           ) : (
//             <X className="size-4 text-gray-500 mr-2" />
//           )}
//           <span className={item.met ? "text-green-500" : "text-gray-500"}>{item.label}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// const PasswordStrengthMeter = ({ password }) => {
//   const getStrength = (password) => {
//     if (typeof password !== 'string') return 0;

//     let strength = 0;
//     if (password.length >= 6) strength++;
//     if (password.match(/[A-Z]/) && password.match(/[a-z]/)) strength++;
//     if (password.match(/\d/)) strength++;
//     if (password.match(/[^A-Za-z\d]/)) strength++;
//     return strength;
//   };

//   const getColor = (strength) => {
//     if (strength === 0) return "bg-red-500";
//     if (strength === 1) return "bg-red-400";
//     if (strength === 2) return "bg-yellow-500";
//     if (strength === 3) return "bg-yellow-400";
//     return "bg-green-500";
//   };

//   const strength = getStrength(password);

//   return (
//     <div className="mt-2">
//       <div className="flex justify-between items-center mb-1">
//         <span className="text-sm text-gray-500">Password strength</span>
//         <span className="text-sm text-gray-500">{strength}</span>
//       </div>

//       <div className="flex space-x-1">
//         {[...Array(4)].map((_, index) => (
//           <div
//             key={index}
//             className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${
//               index < strength ? getColor(strength) : "bg-gray-600"
//             }`}
//           ></div>
//         ))}
//       </div>
//       <PasswordRules password={password} />
//     </div>
//   );
// };

// export default PasswordStrengthMeter;
