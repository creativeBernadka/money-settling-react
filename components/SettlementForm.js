import React, { useMemo } from "react";
import Select from "react-select";

import { emptyPayment } from "../pages/settlement";

const Settlement = ({
  values,
  handleChange,
  setFieldValue,
  nickNames,
  payments,
}) => {
  const peopleOptions = useMemo(
    () =>
      nickNames.map(({ name }) => {
        return { value: name.toLowerCase(), label: name };
      }),
    [nickNames]
  );
  return (
    <div className="col-12">
      <div className="form-row p-2">
        <div className="col">Record name</div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="name"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-row p-2">People involved</div>
      {nickNames?.map(({ name }, index) => (
        <div className="form-row p-2" key={index}>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="name"
              name={`nick_names[${index}].name`}
              value={name}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            {index + 1 === nickNames?.length && (
              <button
                className="btn btn-dark"
                onClick={() =>
                  setFieldValue(`nick_names[${index + 1}.name]`, "")
                }
              >
                +
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="form-row p-2">Expenses</div>
      <div className="form-row p-2">
        <p className="col-4">Who payed?</p>
        <p className="col-4">For whom?</p>
        <p className="col-3">How much?</p>
      </div>
      {payments?.map((payment, index) => {
        const who = {
          value: payment.who_payed?.name?.toLowerCase(),
          label: payment.who_payed?.name,
        };
        const forWhom = payment.for_whom?.map(({ single_user: { name } }) => {
          return name && { value: name.toLowerCase(), label: name };
        });
        return (
          <div className="form-row p-2">
            <Select
              className="col-4"
              value={who}
              onChange={(option) => {
                setFieldValue(
                  `payments[${index}].who_payed.name`,
                  option.label
                );
              }}
              options={peopleOptions}
            />
            <Select
              closeMenuOnSelect={false}
              className="col-4"
              value={forWhom}
              onChange={(options) => {
                options.forEach((option, optionIndex) => {
                  setFieldValue(
                    `payments[${index}].for_whom[${optionIndex}].single_user.name`,
                    option.label
                  );
                });
              }}
              isMulti
              options={peopleOptions}
            />
            <div className="col-3">
              <input
                type="number"
                className="form-control"
                value={payment.how_many}
                name={`payments[${index}].how_many`}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              {index + 1 === payments.length && (
                <button
                  className="btn btn-dark"
                  onClick={() =>
                    setFieldValue(`payments[${index + 1}]`, emptyPayment)
                  }
                >
                  +
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Settlement;
