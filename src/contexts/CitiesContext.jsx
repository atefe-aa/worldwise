import { createContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost/API";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        setCities(data.cities);
      } catch {
        alert("Something is wrong with fetching data!");
      } finally {
        setIsLoading(false);
      }
    }
  useEffect(function () {

    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();

      console.log(data);
      
      // Fetch updated list of cities after adding a new city
    await fetchCities();
    } catch {
      alert("Something is wrong with adding City!");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/deleteCity.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id}),
      });
      const data = await res.json();

      console.log(data);
      
      // Fetch updated list of cities after adding a new city
    await fetchCities();
    } catch {
      alert("Something is wrong with deleting City!");
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
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesProvider, CitiesContext };
