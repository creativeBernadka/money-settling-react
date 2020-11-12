import React from "react";
import Select from "react-select";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "@material-ui/core";
import { useDispatch } from 'react-redux';
import {
  updateSettlement
} from '../store/settlementSlice';

const Settlement = ({ calculateSettlement, initialValues }) => {
  const dispatch = useDispatch();
  return (
    <div className="col-12">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) =>
          calculateSettlement({
            recordName: values.recordName,
            people: values.people,
            expenses: values.expenses,
          })
        }
      >
        {({ values }) => {
          dispatch(updateSettlement({value: values})) //dodać debounce
          return (
          <Form>
            <div className="col">Record name</div>
            <Field
              name="recordName"
              label="Record Name"
              className="form-row p-2"
              component={FormikTextField}
            />
            <FieldArray
              name="people"
              render={(arrayHelpers) => (
                <div>
                  <div className="form-row p-2">People involved</div>
                  {values.people &&
                    values.people.length > 0 &&
                    values.people.map((_, index) => (
                      <div key={index}>
                        <Field
                          name={`people[${index}]`}
                          placeholder="Name"
                          component={FormikTextField}
                        />
                        <button
                          type="button"
                          className="btn btn-dark"
                          onClick={() =>
                            values.people.length > 1
                              ? arrayHelpers.remove(index)
                              : arrayHelpers.pop()
                          }
                        >
                          -
                        </button>
                      </div>
                    ))}
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => arrayHelpers.push("")}
                  >
                    Add new person
                  </button>
                </div>
              )}
            />
            <FieldArray
              name="expenses"
              render={(arrayHelpers) => (
                <div>
                  <div className="form-row p-2">Expenses</div>
                  <div className="form-row p-2">
                    <p className="col-4">Who payed?</p>
                    <p className="col-4">For whom?</p>
                    <p className="col-3">How much?</p>
                  </div>
                  {values.expenses &&
                    values.expenses.length > 0 &&
                    values.expenses.map((expense, index) => {
                      const forWhom = (expense.forWhom || []).map((element) => {
                        return { value: element.toLowerCase(), label: element };
                      });
                      return (
                        <div className="form-row p-2">
                          <Field
                            className="col-4"
                            component={SelectField}
                            name={`expenses[${index}].whoPayed`}
                            options={values.people.map((person) => {
                              return {
                                value: person.toLowerCase(),
                                label: person,
                              };
                            })}
                          />
                          <Field
                            className="col-4"
                            component={SelectField}
                            name={`expenses[${index}].forWhom`}
                            defaultValue={forWhom}
                            isMulti
                            closeMenuOnSelect={false}
                            options={values.people.map((person) => {
                              return {
                                value: person.toLowerCase(),
                                label: person,
                              };
                            })}
                          />
                          <div className="col-3">
                            <Field
                              className="form-control"
                              name={`expenses[${index}].howMany`}
                              label=""
                              component={FormikTextField}
                            />
                          </div>
                          <button
                            type="button"
                            className="btn btn-dark"
                            onClick={() =>
                              values.expenses.length > 1
                                ? arrayHelpers.remove(index)
                                : arrayHelpers.pop()
                            }
                          >
                            -
                          </button>
                        </div>
                      );
                    })}
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() =>
                      arrayHelpers.push({
                        whoPayed: "",
                        forWhom: [],
                        howMany: "",
                      })
                    }
                  >
                    Add new expense
                  </button>
                </div>
              )}
            />
            <button type="submit" className="btn btn-dark">
              Save & show summary
            </button>
          </Form>
        )}}
      </Formik>
    </div>
  );
};

function FormikTextField(props) {
  const { field, form, ...restProps } = props;
  const error = ""; //get(form.touched, field.name) && get(form.errors, field.name);

  return (
    <TextField
      {...restProps}
      {...field}
      error={!!error}
      helperText={error}
      id={field.name}
    />
  );
}

const SelectField = ({ options, field, form, ...restProps }) => {
  const setFieldValue = (option) => {
    const value = Array.isArray(option) ?  option?.map(({ value }) => value) || [] : option?.value || ""
    form.setFieldValue(field.name, value);
  };
  return (
    <Select
      {...restProps}
      options={options}
      name={field.name}
      value={
        options ? options.find((option) => option.value === field.value) : ""
      }
      onChange={setFieldValue}
      onBlur={field.onBlur}
    />
  );
};

export default Settlement;
