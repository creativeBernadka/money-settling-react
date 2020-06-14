const calculate = (expenses, people) => {
  const borrowersArray = [];
  expenses.forEach((settlingModel) => {
    settlingModel.forWhom.forEach((person) => {
      let borrower = borrowersArray.find((resultModel) => {
        return (
          resultModel.whoBorrowed === person &&
          resultModel.fromWhomBorrowed === settlingModel.whoPayed
        );
      });

      if (borrower) {
        borrower.howMany +=
          settlingModel.howMany / settlingModel.forWhom.length;
      } else {
        borrower = {
          whoBorrowed: person,
          fromWhomBorrowed: settlingModel.whoPayed,
          howMany: settlingModel.howMany / settlingModel.forWhom.length,
        };
        borrowersArray.push(borrower);
      }
    });
  });

  const helperBorrowerArray = JSON.parse(JSON.stringify(borrowersArray));

  helperBorrowerArray.forEach((borrower) => {
    const person = borrowersArray.find((resultModel) => {
      return (
        borrower.whoBorrowed === resultModel.fromWhomBorrowed &&
        borrower.fromWhomBorrowed === resultModel.whoBorrowed
      );
    });
    if (person) {
      borrower.howMany = (borrower.howMany - person.howMany) / 2;
    }
  });

  return helperBorrowerArray;
};

export default calculate;
