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
  const [searched, setSearched] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    setSearched(false);
    try {
      const res = await fetch(
        "https://portaljust-production.up.railway.app/api/search-cases",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      setSearched(true);
      if (data.error) setError(data.error);
      else if (
        data.CautareDosareResult &&
        Array.isArray(data.CautareDosareResult.Dosar)
      ) {
        setResults(data.CautareDosareResult.Dosar);
      } else if (data.CautareDosareResult && data.CautareDosareResult.Dosar) {
        setResults([data.CautareDosareResult.Dosar]);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Căutare dosare portal.just.ro</h1>
      <form onSubmit={handleSubmit} className="search-form" autoComplete="off">
        <div className="form-group">
          <label htmlFor="numarDosar">Număr dosar</label>
          <input
            type="text"
            name="numarDosar"
            id="numarDosar"
            placeholder="Ex: 1234/90/2022"
            value={form.numarDosar}
            onChange={handleChange}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label htmlFor="obiectDosar">Obiect dosar</label>
          <input
            type="text"
            name="obiectDosar"
            id="obiectDosar"
            placeholder="Ex: furt, divorț, etc."
            value={form.obiectDosar}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="numeParte">Nume parte</label>
          <input
            type="text"
            name="numeParte"
            id="numeParte"
            placeholder="Ex: Popescu Ion"
            value={form.numeParte}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading} className="search-btn">
          {loading ? (
            <span className="loader"></span>
          ) : (
            <span role="img" aria-label="search">
              🔍
            </span>
          )}{" "}
          Caută
        </button>
        {searched && (
          <button
            type="button"
            className="reset-btn"
            onClick={() => {
              setForm({ numarDosar: "", obiectDosar: "", numeParte: "" });
              setResults(null);
              setError(null);
              setSearched(false);
            }}
            disabled={loading}
          >
            Resetează
          </button>
        )}
      </form>

      {loading && <div className="loading-message">Căutare în curs...</div>}

      {error && <div className="error">Eroare: {error}</div>}

      {results && Array.isArray(results) && results.length > 0 && (
        <div className="results-section">
          <h2>Rezultate ({results.length})</h2>
          <table className="results-table">
            <thead>
              <tr>
                <th>Număr</th>
                <th>Data</th>
                <th>Instituție</th>
                <th>Obiect</th>
                <th>Departament</th>
                <th>Stadiu</th>
                <th>Părți</th>
              </tr>
            </thead>
            <tbody>
              {results.map((dosar, idx) => (
                <tr key={idx}>
                  <td>{dosar.numar}</td>
                  <td>
                    {dosar.data ? new Date(dosar.data).toLocaleString() : ""}
                  </td>
                  <td>{dosar.institutie}</td>
                  <td>{dosar.obiectDosar || ""}</td>
                  <td>{dosar.departament || ""}</td>
                  <td>{dosar.stadiuProcesual || ""}</td>
                  <td>
                    {dosar.parti && Array.isArray(dosar.parti.DosarParte) ? (
                      dosar.parti.DosarParte.map((p, i) => (
                        <span key={i}>
                          {p.nume} ({p.calitateParte})<br />
                        </span>
                      ))
                    ) : dosar.parti && dosar.parti.DosarParte ? (
                      <span>
                        {dosar.parti.DosarParte.nume} (
                        {dosar.parti.DosarParte.calitateParte})
                      </span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    <button
                      className="add-to-isheet-btn"
                      onClick={() => {
                        window.parent.postMessage(
                          { type: "ADD_CASE_TO_ISHEET", caseData: dosar },
                          "*"
                        );
                      }}
                    >
                      Adaugă în iSheet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {searched &&
        results &&
        Array.isArray(results) &&
        results.length === 0 && (
          <div className="no-results">Niciun rezultat găsit.</div>
        )}
    </div>
  );
}

export default App;
