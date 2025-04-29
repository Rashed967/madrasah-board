import axios  from "axios";
import { useMutation } from "@tanstack/react-query";

interface MarkazPayload {
    madrasah: string | null
    allMadrasah: string[]
    code: string
  }

  const createMarkaz = async (data: MarkazPayload) => {
    const access_token = localStorage.getItem('access_token')
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/markazs`,
      data,
    {
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type' : 'application/json'
        }
    }
    )
    return response.data
  }
  
function useCreateMarkaz() {
    return useMutation({
      mutationFn: createMarkaz,
    })
  }

export default useCreateMarkaz;