import { useState } from 'react';
import { Sun, SunMoon} from "lucide-react";

export default function DarkLight() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return(
    <div>
        <SunMoon />
        <Sun />
    </div>
    
  )}