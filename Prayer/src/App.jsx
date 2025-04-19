import { useEffect, useState } from "react";
import Prayer from "./component/Prayer";

function App() {
  function convertTo12Hour(time24) {
    if (!time24) {
      return "";
    }
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = ((hours + 11) % 12) + 1;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  const [prayerTimes, setPrayerTimes] = useState({});
  const [selectedCity, setSelectedCity] = useState("Cairo");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const cities = [
    { name: "القاهره", value: "Cairo" },
    { name: "الاسكندريه", value: "Alexandria" },
    { name: "الجيزه", value: "Giza" },
    { name: "المنصوره", value: "Mansora" },
    { name: "اسوان", value: "Aswan" },
    { name: "الاقصر", value: "Luxor" },
  ];

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${selectedCity}&country=Egypt`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data_prayer = await response.json();
        setPrayerTimes(data_prayer.data.timings);
        console.log("Prayer Times for", selectedCity, ":", data_prayer.data.timings);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching prayer times:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [selectedCity]);

  return (
    <section>
      <div className="container">
        <div className="top_section">
          <div className="city">
            <h3>المدينه</h3>
            <select value={selectedCity} onChange={handleCityChange}>
              {cities.map((city_obj) => (
                <option key={city_obj.value} value={city_obj.value}>
                  {city_obj.name}
                </option>
              ))}
            </select>
          </div>
          <div className="date">
            <h3>التاريخ</h3>
            <h4>{new Date().toLocaleDateString()}</h4>
          </div>
        </div>

        {loading && <p>جاري تحميل أوقات الصلاة...</p>}
        {error && <p>حدث خطأ في جلب أوقات الصلاة: {error}</p>}

        {!loading && !error && Object.keys(prayerTimes).length > 0 && (
          <>
            <Prayer name="الفجر" time={convertTo12Hour(prayerTimes.Fajr)} />
            <Prayer name="الظهر" time={convertTo12Hour(prayerTimes.Dhuhr)} />
            <Prayer name="العصر" time={convertTo12Hour(prayerTimes.Asr)} />
            <Prayer name="المغرب" time={convertTo12Hour(prayerTimes.Maghrib)} />
            <Prayer name="العشاء" time={convertTo12Hour(prayerTimes.Isha)} />
          </>
        )}
      </div>
    </section>
  );
}

export default App;
