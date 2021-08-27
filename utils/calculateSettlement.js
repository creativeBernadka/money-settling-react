const calculate = (expenses, people) => {
  const borrowersArray = [];
  expenses.forEach(({for_whom, who_payed, how_many}) => {
    for_whom.forEach((person) => {
      let borrower = borrowersArray.find((resultModel) => {
        return (
          resultModel.whoBorrowed === person &&
          resultModel.fromWhomBorrowed === who_payed
        );
      });

      if (borrower) {
        borrower.howMany +=
          how_many / for_whom.length;
      } else {
        borrower = {
          whoBorrowed: person,
          fromWhomBorrowed: who_payed,
          howMany: how_many / for_whom.length,
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
