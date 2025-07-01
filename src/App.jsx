import { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    numarDosar: "",
    obiectDosar: "",
    numeParte: "",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("http://localhost:3001/api/search-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else if (
        data.CautareDosareResult &&
        Array.isArray(data.CautareDosareResult.Dosar)
      ) {
        setResults(data.CautareDosareResult.Dosar);
      } else if (data.CautareDosareResult && data.CautareDosareResult.Dosar) {
        // If only one result, it's an object, not an array
        setResults([data.CautareDosareResult.Dosar]);
      } else {
        setResults([]);
      }
      console.log(data);
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Căutare dosare portal.just.ro</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          name="numarDosar"
          placeholder="Număr dosar"
          value={form.numarDosar}
          onChange={handleChange}
        />
        <input
          type="text"
          name="obiectDosar"
          placeholder="Obiect dosar"
          value={form.obiectDosar}
          onChange={handleChange}
        />
        <input
          type="text"
          name="numeParte"
          placeholder="Nume parte"
          value={form.numeParte}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Caută..." : "Caută"}
        </button>
      </form>
      {error && <div className="error">Eroare: {error}</div>}
      {results && Array.isArray(results) && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Număr</th>
              <th>Data</th>
              <th>Instituție</th>
              <th>Obiect</th>
            </tr>
          </thead>
          <tbody>
            {results.map((dosar, idx) => (
              <tr key={idx}>
                <td>{dosar.numar}</td>
                <td>{dosar.data}</td>
                <td>{dosar.institutie}</td>
                <td>{dosar.obiectDosar || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {results && !Array.isArray(results) && <div>Niciun rezultat găsit.</div>}
    </div>
  );
}

export default App;
