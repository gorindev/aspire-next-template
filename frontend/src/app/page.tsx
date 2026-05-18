import WeatherApp from "@/components/weather-app";
import { Suspense } from 'react';
import Image from 'next/image';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface WeatherData {
  forecast: WeatherForecast[];
  error?: string;
}

async function getWeatherData(): Promise<WeatherData> {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return { forecast: [], error: 'API_URL is not configured.' };
  }

  try {
    const response = await fetch(`${apiUrl}/api/weatherforecast`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return { forecast: [], error: `API returned status ${response.status}` };
    }

    const forecast = await response.json();
    return { forecast };
  } catch {
    return { forecast: [], error: 'Failed to connect to weather service.' };
  }
}

export default async function HomePage() {
  const weatherData = getWeatherData();

  return (
    <div className="app-container">
      <header className="app-header">
        <a
          href="https://aspire.dev"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Aspire website (opens in new tab)"
          className="logo-link"
        >
          <Image src="/Aspire.png" className="logo" alt="Aspire logo" width={50} height={50} />
        </a>
        <h1 className="app-title">Aspire Starter</h1>
        <p className="app-subtitle">Modern distributed application development</p>
      </header>

      <main className="main-content" suppressHydrationWarning>
        <Suspense fallback={<div className="loading">Loading weather forecast...</div>}>
          <WeatherApp weatherPromise={weatherData} />
        </Suspense>
      </main>

      <footer className="app-footer">
        <nav aria-label="Footer navigation">
          <a href="https://aspire.dev" target="_blank" rel="noopener noreferrer">
            Learn more about Aspire<span className="visually-hidden"> (opens in new tab)</span>
          </a>
          <a
            href="https://github.com/microsoft/aspire"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            aria-label="View Aspire on GitHub (opens in new tab)"
          >
            <img src="/github.svg" alt="" width="24" height="24" aria-hidden="true" />
            <span className="visually-hidden">GitHub</span>
          </a>
        </nav>
      </footer>
    </div>
  );
}
