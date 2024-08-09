import React, { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Possession from "..models/possessions/Possession.js"; // Assurez-vous que le chemin est correct
import Flux from "./models/possessions/Flux.js"; // Assurez-vous que le chemin est correct
import Argent from "../models/possessions/Argent"; // Assurez-vous que le chemin est correct
import BienMateriel from "../models/possessions/BienMateriel.js"; // Assurez-vous que le chemin est correct

const possessionsData = [
  new BienMateriel(
    "John Doe",
    "MacBook Pro",
    4000000,
    new Date("2023-12-25"),
    null,
    5
  ),
  new Flux(
    "John Doe",
    "Alternance",
    500000,
    new Date("2023-01-01"),
    null,
    null,
    1
  ),
  new Flux(
    "John Doe",
    "Survie",
    -300000,
    new Date("2023-01-01"),
    null,
    null,
    2
  ),
];

const PatrimoinePage = () => {
  const [date, setDate] = useState(new Date());
  const [totalValue, setTotalValue] = useState(0);

  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
  };

  const handleCalculateValue = () => {
    const total = possessionsData.reduce((sum, possession) => {
      return sum + possession.getValeur(date);
    }, 0);
    setTotalValue(total);
  };

  return (
    <div className="container mt-4">
      <h1>Patrimoine</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Valeur Initiale</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Amortissement</th>
            <th>Valeur Actuelle</th>
          </tr>
        </thead>
        <tbody>
          {possessionsData.map((possession, index) => (
            <tr key={index}>
              <td>{possession.libelle}</td>
              <td>{possession.valeur.toFixed(2)}</td>
              <td>{possession.dateDebut.toLocaleDateString()}</td>
              <td>
                {possession.dateFin
                  ? possession.dateFin.toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                {possession.tauxAmortissement
                  ? `${possession.tauxAmortissement}%`
                  : "N/A"}
              </td>
              <td>{possession.getValeur(date).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Form.Group controlId="formDate">
        <Form.Label>Select Date</Form.Label>
        <Form.Control type="date" onChange={handleDateChange} />
      </Form.Group>
      <Button onClick={handleCalculateValue} variant="primary">
        Calculer Valeur du Patrimoine
      </Button>

      <h3 className="mt-4">
        Valeur Totale du Patrimoine: {totalValue.toFixed(2)}
      </h3>
    </div>
  );
};

export default PatrimoinePage;
