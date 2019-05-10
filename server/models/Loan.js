class Loan {
  constructor(id, user, createdOn, status, repaid, tenor, amount, paymentInstallment, balance, interest) {
    this.id = id;
    this.user = user;
    this.createdOn = createdOn;
    this.status = status;
    this.repaid = repaid;
    this.tenor = tenor;
    this.amount = amount;
    this.paymentInstallment = paymentInstallment;
    this.balance = balance;
    this.interest = interest;
  }
}

export default Loan;
