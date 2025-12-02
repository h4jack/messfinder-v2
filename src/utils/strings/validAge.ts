const isValidAge = (dobString: string, ageLimit = 18) => {
    const dob = new Date(dobString);
    const today = new Date();

    if (isNaN(dob.getTime())) return false;

    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    const d = today.getDate() - dob.getDate();

    // Adjust if birthday hasn't occurred yet this year
    const isBirthdayPassed = m > 0 || (m === 0 && d >= 0);
    const actualAge = isBirthdayPassed ? age : age - 1;

    return actualAge >= ageLimit;
}

export default isValidAge;