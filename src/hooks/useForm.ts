import { CustomError } from "../services/types"

type UseFormProps = {
  
}

type UseFormReturn = {
  loading: boolean
  handleSubmit: <T>(values: T) => Promise<void>
  error: CustomError
}

const useForm = () => {

  
  return []
}

export default useForm