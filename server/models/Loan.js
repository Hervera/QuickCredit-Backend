class Loan {
  constructor(userEmail, createdOn, status, repaid, tenor, amount, paymentInstallment, balance, interest, updatedOn) {
    this.userEmail = userEmail;
    this.createdOn = createdOn;
    this.status = status;
    this.repaid = repaid;
    this.tenor = tenor;
    this.amount = amount;
    this.paymentInstallment = paymentInstallment;
    this.balance = balance;
    this.interest = interest;
    this.updatedOn = updatedOn;
  }
}

export default Loan;
