const createPairArray = (people) => {
  return people.reduce((acc, firstPerson) => {
    people.forEach((secondPerson) => {
      acc.push({ firstPerson, secondPerson });
    });
    return acc;
  }, []);
};

export default createPairArray;
