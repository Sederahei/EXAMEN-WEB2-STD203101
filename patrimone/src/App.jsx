import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import data from "../../data/data.json";
import Possession from "../../models/possessions/Possession";
import Flux from "../../models/possessions/Flux";

function App() {

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Initial date
  const [displayDate, setDisplayDate] = useState(new Date());
  const [possessions, setPossessions] = useState([]);
  const [flux, setFlux] = useState([]);
  const [values, setValues] = useState([]);
  const [possesseur, setPossesseur] = useState("");
  const style = {
    color: "green",
    backgroundColor: "lightgray",
    padding: "10px",
    borderRadius: "5px",
  };

  useEffect(() => {
    // Load data and initialize possessions and flux
    const dataPatrimoine = data.find(
      (item) => item.model === "Patrimoine"
    ).data;
    const dataPossessions = dataPatrimoine.possessions;
    const possesseurNom = dataPatrimoine.possesseur.nom; // Get anaran'ny data

    const initialPossessions = [];
    const initialFlux = [];

    dataPossessions.forEach((item) => {
      if (item.valeurConstante !== undefined) {
        initialFlux.push(
          new Flux(
            item.possesseur.nom,
            item.libelle,
            item.valeurConstante,
            new Date(item.dateDebut),
            item.dateFin ? new Date(item.dateFin) : null,
            item.tauxAmortissement,
            item.jour
          )
        );
      } else {
        initialPossessions.push(
          new Possession(
            item.possesseur.nom,
            item.libelle,
            item.valeur,
            new Date(item.dateDebut),
            item.dateFin ? new Date(item.dateFin) : null,
            item.tauxAmortissement
          )
        );
      }
    });

    setPossessions(initialPossessions);
    setFlux(initialFlux);
    setPossesseur(possesseurNom);
  }, []);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleCalculate = () => {
    const selectedDate = new Date(date);
    setDisplayDate(selectedDate);

    const calculatedValues = {};

    // Calculate valeur for possessions
    possessions.forEach((possession) => {
      const value = possession.getValeur(selectedDate);
      if (calculatedValues[possession.libelle]) {
        calculatedValues[possession.libelle] += value;
      } else {
        calculatedValues[possession.libelle] = value;
      }
    });

    // Calculate valeur for flux
    flux.forEach((fluxItem) => {
      const value = fluxItem.getValeur(selectedDate);
      if (calculatedValues[fluxItem.libelle]) {
        calculatedValues[fluxItem.libelle] += value;
      } else {
        calculatedValues[fluxItem.libelle] = value;
      }
    });

    // Convert calculated values to an array
    const valuesArray = Object.keys(calculatedValues).map((libelle) => ({
      libelle,
      valeur: calculatedValues[libelle],
    }));

    setValues(valuesArray);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12}>
          {/* Premier div: Liste des possessions et flux */}
          <div className="mb-4">
            <h3 style={style}>
              Liste des Possessions and Flux pour {possesseur}
            </h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Libelle</th>
                  <th>Valeur</th>
                  <th>Date Début</th>
                  <th>Date Fin</th>
                  <th>Taux d'Amortissement</th>
                  <th>Valeur Constante</th>
                  <th>Jour</th>
                </tr>
              </thead>
              <tbody>
                {possessions.concat(flux).map((item, index) => (
                  <tr key={index}>
                    <td>{item instanceof Flux ? "Flux" : "Possession"}</td>
                    <td>{item.libelle}</td>
                    <td>
                      {item.valeurConstante !== undefined
                        ? item.valeurConstante
                        : item.valeur}
                    </td>
                    <td>{item.dateDebut.toISOString().split("T")[0]}</td>
                    <td>
                      {item.dateFin
                        ? item.dateFin.toISOString().split("T")[0]
                        : "N/A"}
                    </td>
                    <td>{item.tauxAmortissement || "N/A"}</td>
                    <td>{item.valeurConstante || "N/A"}</td>
                    <td>{item.jour || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {/* Deuxième div: Sélection de la date */}
          <div className="mb-4">
            <h3>Sélectionnez une Date</h3>
            <Form.Control
              type="date"
              value={date}
              onChange={handleDateChange}
            />
            <Button className="mt-3" onClick={handleCalculate}>
              Calculer Valeur
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {/* Troisième div: Valeurs calculées */}
          <div className="mt-4">
            <h3>
              Valeurs Calculées pour {possesseur} au{" "}
              {displayDate.toISOString().split("T")[0]}
            </h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Libelle</th>
                  <th>Valeur</th>
                </tr>
              </thead>
              <tbody>
                {values.map((value, index) => (
                  <tr key={index}>
                    <td>{value.libelle}</td>
                    <td>{value.valeur.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
