'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; 

export function HeaderInfo() {
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('New Delhi'); // Default location
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherIcon, setWeatherIcon] = useState<string | null>(null); 

  useEffect(() => {
    // Format the date once the component mounts on the client
    const today = new Date();
    const formattedDate = today.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    setDate(formattedDate.replace(/,/g, ','));

    // Function to fetch weather data
    const fetchWeather = async (lat: number, lon: number) => {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        console.error("OpenWeather API key not found.");
        return;
      }
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("Full Weather API Response:", data);

        if (data.main && data.name) {
          setTemperature(Math.round(data.main.temp));
          setLocation(data.name);
          //grabbing icon from api response
          if (data.weather && data.weather[0]) {
            console.log("Weather icon code received:", data.weather[0].icon);
            setWeatherIcon(data.weather[0].icon);
          }
        }
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      }
    };

    // Get user's location from the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // If user denies location, you could fall back to a default or do nothing.
          console.log("Geolocation permission denied. Using default location.");
          // Optionally fetch weather for the default location
        }
      );
    }
  }, []);

  return (
     <div className="hidden md:flex items-center text-[11px] lg:text-sm text-muted-foreground">
      <span>{date}</span>
      <span className="mx-2">|</span>
      <div className="flex items-center">
        <span>{location} {temperature !== null ? `${temperature}°C` : ''}</span>
        {/* If we have an icon, display it */}
        {weatherIcon && (
          <Image
            src={`https://openweathermap.org/img/wn/${weatherIcon}.png`}
            alt="Weather icon"
            width={28}
            height={28}
            className="mr-1"
          />
        )}
      </div>
    </div>
  );
}