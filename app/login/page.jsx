'use client'
import Form , {isSubmitting, formType} from '../components/Form'
import { useSignals } from '@preact/signals-react/runtime'
const Login = () => {
  useSignals()

  if(!isSubmitting.value) {
    formType.value = 'Login';
    } else {
    formType.value = 'Logging In...';
    }
  

  return (
    <Form />
  )
}

export default Login