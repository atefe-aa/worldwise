import { createContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost/API";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities.php`, {
          method: "POST",
          headers: { "Content-Type": "aplication/json" },
        });
        const data = await res.json();
       
        setCities(data.cities);
      } catch {
        alert("Something is wrong with fetching data!");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities.php`, {
        method: "POST",
        headers: { "Content-Type": "aplication/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setCurrentCity(data.cities.at(0));
     
    } catch {
      alert("Something is wrong with fetching data!");
    } finally {
      setIsLoading(false);
    }
  }

  async function addCity(newCity) {
    
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/addCity.php`, {
        method: "POST",
        headers: { "Content-Type": "aplication/json" },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();
      console.log(data);
    } catch {
      alert("Something is wrong with fetching data!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        addCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesProvider, CitiesContext };
