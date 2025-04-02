
import { use, useState } from "react";
import axios
 from "axios";
export default function Turistics() {
  const [result, setResult] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleClick = async () => {
    console.log('Prompt = ', prompt);

    const response = await axios.post('http://localhost:3333/api/call');
    
  }
  return(
    <div>
      <h1>Turismo</h1>
      
    </div>
    
  )}