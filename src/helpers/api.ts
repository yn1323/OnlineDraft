import axios from 'axios'
import { END_POINT } from '@/constants/common'

export const req = async (path: string, params: {}) =>
  await axios
    .post(`${END_POINT}${path}`, params)
    .then(response => response.data)
    .catch(error => console.log(error))
