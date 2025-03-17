'use client'
import Form from '../components/Form';
import { useSignals } from '@preact/signals-react/runtime';
import {formType, isSubmitting} from '../components/Form'


const Register = () => {
  useSignals()
  if(!isSubmitting.value) {
  formType.value = 'Create Account';
  } else {
  formType.value = 'Creating Account...';
  }

  return (
    <>
       <div>Register</div>
    <Form />
    </>
 
  )
}

export default Register