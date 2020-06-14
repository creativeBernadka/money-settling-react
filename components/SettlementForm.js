import React, { useState } from "react";
import Select from "react-select";

const Settlement = ({
  people,
  setPeople,
  recordName,
  setRecordName,
  expenses,
  setExpenses,
}) => {
  const [whoPayed, setWhoPayed] = useState("");
  const [forWhomPayed, setForWhomPayed] = useState("");

  const addNewPerson = () => {
    setPeople([...people, document.getElementById("input0").value]);
    document.getElementById("input0").value = [];
  };

  const personNameChange = (value, index) => {
    const peopleCopy = [...people];
    peopleCopy[index] = value;
    setPeople(peopleCopy);
    console.log("PEOPLE", people)
  };

  const addNewExpense = () => {
    const newExpense = {
      whoPayed: whoPayed.label,
      forWhom: forWhomPayed.map((option) => option.label),
      howMany: parseFloat(document.getElementById("howMany").value),
    };
    setExpenses([...expenses, newExpense]);
    document.getElementById("howMany").value = [];
    setWhoPayed("");
    setForWhomPayed("");
  };

  const handleWhoPayed = (option, index) => {
    const expensesCopy = [...expenses];
    expensesCopy[index].whoPayed = option.label;
    setExpenses(expensesCopy);
  };

  const handleForWhomPayed = (options, index) => {
    const expensesCopy = [...expenses];
    expensesCopy[index].forWhom = options.map((option) => option.label);
    setExpenses(expensesCopy);
  };

  const handleHowMany = (option, index) => {
    const expensesCopy = [...expenses];
    expensesCopy[index].howMany = parseFloat(option);
    setExpenses(expensesCopy);
  };

  return (
    <div className="col-12">
      <div className="form-row p-2">
        <div className="col">Record name</div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="name"
            value={recordName}
            onChange={(event) => setRecordName(event.target.value)}
          />
        </div>
      </div>
      <div className="form-row p-2">People involved</div>
      {people.map((person, index) => (
        <div className="form-row p-2" key={person}>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="name"
              value={person}
              onChange={(event) => personNameChange(event.target.value, index)}
            />
          </div>
          <div className="col" />
        </div>
      ))}
      <div className="form-row p-2">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="name"
            id="input0"
          ></input>
        </div>
        <div className="col">
          <button className="btn btn-dark" onClick={() => addNewPerson()}>
            +
          </button>
        </div>
      </div>
      <div className="form-row p-2">Expenses</div>
      <div className="form-row p-2">
        <p className="col-4">Who payed?</p>
        <p className="col-4">For whom?</p>
        <p className="col-3">How much?</p>
      </div>
      {expenses.map((expense, index) => {
        const who = {
          value: expense.whoPayed.toLowerCase(),
          label: expense.whoPayed,
        };
        const forWhom = expense.forWhom.map((element) => {
          return { value: element.toLowerCase(), label: element };
        });
        return (
          <div className="form-row p-2">
            <Select
              className="col-4"
              defaultValue={who}
              onChange={(option) => handleWhoPayed(option, index)}
              options={people.map((person) => {
                return { value: person.toLowerCase(), label: person };
              })}
            />
            <Select
              closeMenuOnSelect={false}
              className="col-4"
              defaultValue={forWhom}
              onChange={(options) => handleForWhomPayed(options, index)}
              isMulti
              options={people.map((person) => {
                return { value: person.toLowerCase(), label: person };
              })}
            />
            <div className="col-3">
              <input
                type="number"
                className="form-control"
                value={expense.howMany}
                onChange={(event) => handleHowMany(event.target.value, index)}
              />
            </div>
          </div>
        );
      })}
      <div className="form-row p-2">
        <Select
          className="col-4"
          value={whoPayed}
          onChange={(option) => setWhoPayed(option)}
          options={people.map((person) => {
            return { value: person.toLowerCase(), label: person };
          })}
        />
        <Select
          closeMenuOnSelect={false}
          className="col-4"
          value={forWhomPayed}
          onChange={(option) => setForWhomPayed(option)}
          isMulti
          options={people.map((person) => {
            return { value: person.toLowerCase(), label: person };
          })}
        />
        <div className="col-3">
          <input type="number" className="form-control" id="howMany" />
        </div>
        <div className="col">
          <button className="btn btn-dark" onClick={() => addNewExpense()}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settlement;
